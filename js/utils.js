async function isAdmin() {
    try {
        const user = await getRequest("account/user", {}, true);
        return user.is_admin;
    } catch (error) {
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

function formatDate(dateString) {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();

    return `${day}.${month}.${year}`;
}

function registerTooltips() {
    const elementsWithTooltip = document.querySelectorAll("[data-tooltip]");

    elementsWithTooltip.forEach((element) => {
        element.addEventListener("mouseover", handleMouseOver);
    });

    function handleMouseOver() {
        const tooltipbox = createTooltipBox(this);

        handleMouseMove.tooltipbox = tooltipbox;
        this.addEventListener("mousemove", handleMouseMove);

        handleMouseLeave.tooltipbox = tooltipbox;
        handleMouseLeave.element = this;
        this.addEventListener("mouseleave", handleMouseLeave);
    }

    const handleMouseLeave = {
        handleEvent() {
            this.tooltipbox.remove();
            this.element.removeEventListener("mousemove", handleMouseMove);
            this.element.removeEventListener("mouseleave", handleMouseLeave);
        },
    };

    const handleMouseMove = {
        handleEvent(e) {
            const tooltipW = this.tooltipbox.offsetWidth;
            const tooltipH = this.tooltipbox.offsetHeight;
            const buffer = 10;
            const margin = 32;

            // check if on the right of the cursor is enough space for the tooltip
            // otherwise position to the left
            if (window.innerWidth - e.clientX < tooltipW + margin) {
                this.tooltipbox.style.left = e.clientX - tooltipW + "px";
            } else {
                this.tooltipbox.style.left = e.clientX + buffer + "px";
            }

            // position tooltip vertically
            this.tooltipbox.style.top = e.clientY - tooltipH - buffer + "px";
        },
    };

    function createTooltipBox(el) {
        let tooltip = document.createElement("div");
        tooltip.innerText = el.dataset.tooltip;
        tooltip.classList.add("tooltip");

        document.body.appendChild(tooltip);

        return tooltip;
    }
}
