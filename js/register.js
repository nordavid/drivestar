// Preview profile picture on license after selecting
const inputProfilepicture = document.querySelector("#form-profilepicture");
inputProfilepicture.addEventListener("change", () => {
    const uploadedFile = inputProfilepicture.files[0];

    document.querySelector("#license-image").src = URL.createObjectURL(uploadedFile);
    document.querySelector("#upload-button").textContent = uploadedFile.name;
});

// Change license name on input change
const inputName = document.querySelector("#form-name");
inputName.addEventListener("input", (e) => {
    document.querySelector("#license-name").textContent = inputName.value;

    if (inputName.value == "") {
        document.querySelector("#license-name").textContent = "Linda Sternschnuppe";
    }

    document.querySelector("#license-id").textContent = getRandomLicenseNumber();
});

// Set license date
document.querySelector("#license-date").textContent = getDateString();

function getRandomLicenseNumber() {
    let num1 = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    let num2 = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    let num3 = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    return num1 + " " + num2 + " " + num3;
}

function getDateString() {
    let today = new Date();
    let day = today.getDate().toString().padStart(2, "0");
    let month = (today.getMonth() + 1).toString().padStart(2, "0");
    let year = today.getFullYear().toString().slice(-2);

    return day + "." + month + "." + year;
}

// Register user with request to api
const registerForm = document.querySelector("#register-form");
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);

    const fileInput = document.getElementById("form-profilepicture");
    const file = fileInput.files[0];
    formData.append("upload_profilepicture", file ? true : false);

    try {
        const jwt = await postRequest("account/register", formData, true);
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
