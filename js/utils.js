// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
function parseJwt(token) {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

function isAdmin() {
    const token = localStorage.getItem("jwtToken");
    if (token !== null && token !== undefined) {
        return parseJwt(token).user.isAdmin;
    }
}

function showToast(message) {
    // Create a new toast element
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerText = message;

    // Add the toast to the container
    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
        container.removeChild(toast);
    }, 3500);
}
