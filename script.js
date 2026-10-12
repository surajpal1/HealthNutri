// ================= BMI CALCULATOR =================

function calculateBMI() {

    let weight = parseFloat(document.getElementById("weight").value);
    let height = parseFloat(document.getElementById("height").value);

    if (!weight || !height) {
        document.getElementById("result").innerHTML =
            "Please enter your weight and height.";
        return;
    }

    let heightMeter = height / 100;
    let bmi = weight / (heightMeter * heightMeter);

    let category = "";

    if (bmi < 18.5) {
        category = "Underweight";
    }
    else if (bmi < 25) {
        category = "Normal Weight";
    }
    else if (bmi < 30) {
        category = "Overweight";
    }
    else {
        category = "Obese";
    }

    document.getElementById("result").innerHTML =
        `Your BMI: ${bmi.toFixed(2)}<br>
        <span>${category}</span>`;
}


// ================= CALORIES CALCULATOR =================

function calculateCalories() {

    let age = parseInt(document.getElementById("age").value);
    let weight = parseFloat(document.getElementById("weight").value);
    let height = parseFloat(document.getElementById("height").value);
    let gender = document.getElementById("gender").value;
    let activity = parseFloat(document.getElementById("activity").value);

    let bmr;

    if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    }
    else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let calories = Math.round(bmr * activity);

    document.getElementById("caloriesResult").innerHTML =
        "Daily Calories Needed:<br><b>" + calories + " kcal</b>";
}


// ================= DIET PLAN GENERATOR =================

function generateDiet() {

    let calories = Number(document.getElementById("calories").value);
    let goal = document.getElementById("goal").value;
    let diet = document.getElementById("diet").value;

    if (!calories || calories <= 0) {

        document.getElementById("dietResult").innerHTML =
            "<h3>Please enter valid daily calories.</h3>";

        return;
    }


    // Protein target
    let proteinTarget = Math.round((calories * 0.15) / 4);


    // Meal calorie distribution
    let breakfastCalories = Math.round(calories * 0.25);
    let lunchCalories = Math.round(calories * 0.30);
    let snackCalories = Math.round(calories * 0.15);
    let dinnerCalories = Math.round(calories * 0.30);


    // Goal name
    let goalName = "";

    if (goal === "loss") {
        goalName = "Weight Loss Diet";
    }
    else if (goal === "maintain") {
        goalName = "Maintenance Diet";
    }
    else {
        goalName = "Weight Gain Diet";
    }


    // Protein foods
    let proteinFood;

    if (diet === "nonveg") {
        proteinFood = "Eggs / Chicken / Fish";
    }
    else {
        proteinFood = "Paneer / Soybean / Dal / Curd";
    }


    // Meal foods according to diet
    let breakfastFood;
    let lunchFood;
    let dinnerFood;


    if (diet === "nonveg") {

        breakfastFood =
            "Oats + Milk + Banana + 2 Eggs";

        lunchFood =
            "Rice + Dal + Chicken + Vegetables";

        dinnerFood =
            "Roti/Rice + Chicken/Eggs + Vegetables";

    }
    else {

        breakfastFood =
            "Oats + Milk + Banana + Peanut Butter";

        lunchFood =
            "Rice + Dal + Paneer + Vegetables";

        dinnerFood =
            "Roti/Rice + Paneer + Dal + Vegetables";
    }


    // Final diet plan
    let result = `

        <h2>${goalName}</h2>

        <p>
            <strong>Daily Calories:</strong>
            ${calories} kcal
        </p>

        <p>
            <strong>Daily Protein Target:</strong>
            ${proteinTarget} g
        </p>


        <h3>🍳 Breakfast — ${breakfastCalories} kcal</h3>

        <ul>
            <li>${breakfastFood}</li>
            <li>Milk – 250-300 ml</li>
        </ul>


        <h3>🍛 Lunch — ${lunchCalories} kcal</h3>

        <ul>
            <li>${lunchFood}</li>
            <li>Rice – 200-300 g cooked</li>
            <li>Vegetables – 150 g</li>
        </ul>


        <h3>🍎 Snack — ${snackCalories} kcal</h3>

        <ul>
            <li>Banana / Apple – 1 serving</li>
            <li>Nuts – 20-30 g</li>
            <li>Curd – 100-150 g</li>
        </ul>


        <h3>🍽️ Dinner — ${dinnerCalories} kcal</h3>

        <ul>
            <li>${dinnerFood}</li>
            <li>Vegetables – 150 g</li>
        </ul>


        <hr>

        <p>
            <strong>Protein Sources:</strong>
            ${proteinFood}
        </p>

    `;


    document.getElementById("dietResult").innerHTML = result;
}