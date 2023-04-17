async function isAdmin() {
    const response = await getRequest("account/user", {}, true);
    const data = await response.json();

    if (response.ok) {
        if (!data.error) {
            return data.payload.is_admin;
        }
    } else {
        return false;
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
