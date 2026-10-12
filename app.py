from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from pathlib import Path
import os

app = Flask(__name__)
app.secret_key = os.environ.get("HEALTHNUTRI_SECRET_KEY", "change-this-secret-before-deployment")
DB_PATH = Path(__file__).with_name("healthnutri.db")

def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with db() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )""")

init_db()

@app.context_processor
def common_context():
    return {"current_user": session.get("user_name")}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/bmi")
def bmi():
    return render_template("bmi.html")

@app.route("/calories")
def calories():
    return render_template("calories.html")

@app.route("/diet")
def diet():
    return render_template("diet.html")

@app.route("/water", methods=["GET", "POST"])
def water():
    if "user_id" not in session:
        # Tracker works for guests too; browser session keeps their current total.
        session.setdefault("water_ml", 0)
    if request.method == "POST":
        action = request.form.get("action", "add")
        if action == "reset":
            session["water_ml"] = 0
        else:
            try:
                amount = int(request.form.get("amount", "250"))
                if 1 <= amount <= 3000:
                    session["water_ml"] = min(10000, int(session.get("water_ml", 0)) + amount)
                else:
                    flash("Please enter an amount between 1 and 3000 ml.", "error")
            except (TypeError, ValueError):
                flash("Enter a valid water amount.", "error")
        return redirect(url_for("water"))
    return render_template("water.html", water_ml=int(session.get("water_ml", 0)), water_goal=2500)

@app.route("/recipes")
def recipes():
    return render_template("recipes.html")

@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        flash("Please log in to view your dashboard.", "error")
        return redirect(url_for("login"))
    return render_template("dashboard.html", name=session.get("user_name", "there"))

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        if not name or not email or len(password) < 6:
            return render_template("signup.html", error="Enter your name, a valid email, and a password of at least 6 characters.")
        try:
            with db() as conn:
                cur = conn.execute("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                                   (name, email, generate_password_hash(password)))
                session["user_id"] = cur.lastrowid
                session["user_name"] = name
                session["user_email"] = email
            flash("Account created successfully. Welcome to HealthNutri!", "success")
            return redirect(url_for("dashboard"))
        except sqlite3.IntegrityError:
            return render_template("signup.html", error="An account with this email already exists. Please log in.")
    return render_template("signup.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        with db() as conn:
            user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        if user and check_password_hash(user["password_hash"], password):
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            session["user_email"] = user["email"]
            return redirect(url_for("dashboard"))
        return render_template("login.html", error="Email or password is incorrect.")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("user_id", None)
    session.pop("user_name", None)
    session.pop("user_email", None)
    flash("You have been logged out.", "success")
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)
