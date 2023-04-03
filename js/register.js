const inputProfilepicture = document.querySelector("#form-profilepicture");

inputProfilepicture.addEventListener("change", () => {
    console.log(inputProfilepicture);
    const uploadedFile = inputProfilepicture.files[0];

    document.querySelector("#license-image").src = URL.createObjectURL(uploadedFile);
    document.querySelector("#upload-button").textContent = uploadedFile.name;
});

const inputName = document.querySelector("#form-name");
inputName.addEventListener("input", (e) => {
    document.querySelector("#license-name").textContent = inputName.value;
    document.querySelector("#license-id").textContent = getRandomLicenseNumber();
});

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

const registerForm = document.querySelector("#register-form");
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    console.log(formData);

    const response = await postRequest("account/register", formData);
    console.log(response);
});
