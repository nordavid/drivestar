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

let isToastShown = false;

function showToast(message, position) {
    // create toast
    if (isToastShown) {
        document.querySelector(".toast").innerText = message;
        return;
    }

    isToastShown = true;
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerText = message;

    // add toast to container
    const container = document.getElementById("toast-container");
    if (position == "right") {
        container.style.alignItems = "flex-end";
        toast.style.animationName = "slideInFromRight, fadeOut";
        toast.style.right = "16px";
    } else if (position == "left") {
        container.style.alignItems = "flex-start";
        toast.style.animationName = "slideInFromLeft, fadeOut";
        toast.style.left = "16px";
    }
    container.appendChild(toast);

    // remove
    setTimeout(() => {
        container.removeChild(toast);
        isToastShown = false;
    }, 4500);
}
