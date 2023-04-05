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

const navEl = document.querySelectorAll(".nav-element");
function activeLink() {
    navEl.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
}
navEl.forEach((item) => item.addEventListener("click", activeLink));

function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "./";
}
