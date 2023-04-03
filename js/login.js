// Login user with request to api
const registerForm = document.querySelector("#login-form");
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);

    const response = await postRequest("account/login", formData);
    const data = await response.json();
    if (response.ok) {
        if (!data.error) {
            console.log(data);
            localStorage.setItem("jwtToken", data.payload);
            window.location.href = "./dashboard";
        }
    } else {
        console.log(data.message);
    }
});
