window.onload = function () {
    initDashboard();
};

function initDashboard() {
    redirectIfNotAuthenticated();

    if (isAdmin()) {
        document.querySelector(".nav-admin").classList.remove("hidden");
    }

    initNavigation();
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
function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "./";
}
