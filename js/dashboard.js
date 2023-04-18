window.onload = function () {
    initDashboard();
};

async function initDashboard() {
    redirectIfNotAuthenticated();

    if (await isAdmin()) {
        document.querySelector(".nav-admin").classList.remove("hidden");
    }

    initNavigation();
    loadDashboardContent();
}

async function redirectIfNotAuthenticated() {
    const isAuthenticated = await isLoggedIn();
    if (!isAuthenticated) {
        window.location.href = "./login.html";
    }
}

function initNavigation() {
    const navEl = document.querySelectorAll(".nav-element");
    navEl.forEach((item) =>
        item.addEventListener("click", (e) => {
            const clickedNavEl = e.currentTarget;
            const section = clickedNavEl.id.split("-")[2];

            if (section === "logout") return;

            // Highlight clicked nav element
            navEl.forEach((item) => item.classList.remove("active"));
            clickedNavEl.classList.add("active");

            loadDashboardSection(section);
        })
    );
}

function loadDashboardSection(section) {
    // Hide other dashboard pages
    const dashboardSections = document.querySelectorAll(".dashboard-section");
    dashboardSections.forEach((item) => item.classList.remove("active"));

    // Show correct dashboard page
    const dashboardSection = document.querySelector(`section#${section}`);
    dashboardSection.classList.add("active");

    switch (section) {
        case "dashboard":
            // initDashboard();
            break;

        case "questions":
            initQuestionSection();
            break;

        case "training":
            initTrainingSection();
            break;

        case "exam":
            break;

        default:
            break;
    }
}

// Functions
function loadDashboardContent() {
    loadProfileInfo();
    loadTotalProgress();
    loadExerciseStats();
    loadCategoryStats();
}

async function loadProfileInfo() {
    try {
        const user = await getRequest("account/user", {}, true);

        const profileName = document.querySelector("#profile-name p:nth-of-type(2)");
        profileName.innerText = user.username;

        if (user.profilepicture) {
            const profilePicture = document.querySelector("#profile-info .profilepicture");
            profilePicture.src = "./uploads/" + user.profilepicture;
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function loadTotalProgress() {
    try {
        const progress = await getRequest("question/progress", {}, true);

        const { total_questions_count, correct_answers_count } = progress;

        let percentage = (correct_answers_count / total_questions_count) * 100;
        let roundedPercentage = Math.ceil(percentage);

        const progressWidget = document.querySelector("#total-progress");
        progressWidget.querySelector("h2").innerText = roundedPercentage + "%";
        progressWidget.querySelector(".bar").style.width = roundedPercentage + "%";
        progressWidget.querySelector("#correct-answers").innerText = correct_answers_count;
        progressWidget.querySelector("#remaining-questions").innerText =
            total_questions_count - correct_answers_count;
    } catch (error) {
        console.log(error.message);
    }
}

async function loadExerciseStats() {
    try {
        const exercises = await getRequest("exercise/stats", {}, true);

        const exerciseTable = document.getElementById("training-table-container");
        exerciseTable.innerHTML = "";
        exercises.forEach((exercise) => {
            const perfect = exercise.correct_answers_count == exercise.total_questions_count;

            const exerciseEl = `
                <div class="training ${perfect ? "perfect" : ""}">
                    <p>${formatDate(exercise.date)}</p>
                    <p>${exercise.correct_answers_count} von ${
                exercise.total_questions_count
            } Fragen</p>
                    <p>${Math.ceil(exercise.time_needed / 60)} Minuten</p>
                </div>
            `;

            exerciseTable.insertAdjacentHTML("beforeend", exerciseEl);
        });
    } catch (error) {
        console.log(error.message);
    }
}

async function loadCategoryStats() {
    try {
        const categories = await getRequest("category/stats", {}, true);
        console.log(categories);
        const categoryStatsContainer = document.getElementById("category-progress-container");
        categoryStatsContainer.innerHTML = "";
        categories.forEach((cat) => {
            const { total_questions_count, correct_answers_count } = cat;

            let percentage = (correct_answers_count / total_questions_count) * 100;
            let roundedPercentage = Math.floor(percentage);

            const catEl = `
                <div class="category-progress">
                    <h2>${cat.title}</h2>
                    <div class="progress">
                        <div style="width: ${roundedPercentage}%;" class="bar"></div>
                    </div>
                </div>
            `;

            categoryStatsContainer.insertAdjacentHTML("beforeend", catEl);
        });
    } catch (error) {
        console.log(error.message);
    }
}

function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "./";
}
