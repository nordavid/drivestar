// Login user with request to api
const registerForm = document.querySelector("#login-form");
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);

    try {
        const jwt = await postRequest("account/login", formData, true);
        localStorage.setItem("jwtToken", jwt);
        window.location.href = "./dashboard.html";
    } catch (error) {
        console.log(error.message);
        showToast(error.message);
    }
});

async function redirectIfAuthenticated() {
    const isAuthenticated = await isLoggedIn();
    if (isAuthenticated) {
        window.location.href = "./dashboard.html";
    }
}

redirectIfAuthenticated();
