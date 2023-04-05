async function redirectIfNotAuthenticated() {
    const isAuthenticated = await isLoggedIn();
    if (!isAuthenticated) {
        //window.location.href = "./login.html";
    }
}

redirectIfNotAuthenticated();

if (isAdmin()) {
    document.querySelector(".nav-admin").classList.remove("hidden");
}

// Dashboard navigation
const navEl = document.querySelectorAll(".nav-element");
const dashboardSections = document.querySelectorAll(".dashboard-section");

function activeLink() {
    dashboardSections.forEach((item) => item.classList.add("hidden"));
    const section = this.id.split("-")[2];
    const dashboardSection = document.querySelector(`section#${section}`);
    dashboardSection.classList.remove("hidden");

    navEl.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
}
navEl.forEach((item) => item.addEventListener("click", activeLink));

// Main category select
const categorySelect = document.querySelectorAll(".cat-button");

function activeCategory() {
    categorySelect.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
}
categorySelect.forEach((item) => item.addEventListener("click", activeCategory));

// Functions
function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "./";
}
