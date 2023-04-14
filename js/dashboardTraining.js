function initTrainingSection() {
    getTrainingElements();

    removeEventListeners();

    addSliderEventListeners();
    addTrainingSectionListeners();
    addTrainingCategoryListeners();

    loadTrainingCategories("Grundstoff");
}

let questionSlider,
    questionTooltip,
    timeSlider,
    timeTooltip,
    trainingSectionBtns,
    categoryItems,
    selectAllCategoriesBtn,
    deselectAllCategoriesBtn;

function getTrainingElements() {
    // Main category / section radio buttons
    trainingSectionBtns = document.querySelectorAll(".maincat-item");

    // Training settings slider
    questionSlider = document.getElementById("question-slider");
    questionTooltip = document.getElementById("question-slider-tooltip");

    timeSlider = document.getElementById("time-slider");
    timeTooltip = document.getElementById("time-slider-tooltip");

    // Categories list / checkbox
    categoryItems = document.querySelectorAll(".subcat-item");

    selectAllCategoriesBtn = document.querySelector("#select-all-subcats");
    deselectAllCategoriesBtn = document.querySelector("#unselect-all-subcats");
}

function refreshCategories() {
    categoryItems = document.querySelectorAll(".subcat-item");
    addTrainingCategoryListeners();
}

function removeEventListeners() {
    trainingSectionBtns.forEach((item) => item.removeEventListener("click", handleSectionSelect));
    questionSlider.removeEventListener("input", questionSliderHandler);
    timeSlider.removeEventListener("input", timeSliderHandler);

    categoryItems.forEach((item) => item.removeEventListener("click", handleCategoryToggle));
    selectAllCategoriesBtn.removeEventListener("click", handleSelectAllCategories);
    deselectAllCategoriesBtn.removeEventListener("click", handleDeselectAllCategories);
}

function addSliderEventListeners() {
    questionSlider.addEventListener("input", questionSliderHandler);
    timeSlider.addEventListener("input", timeSliderHandler);
}

const questionSliderHandler = () => showSliderTooltip(questionSlider, questionTooltip);
const timeSliderHandler = () => showSliderTooltip(timeSlider, timeTooltip, "min");

function addTrainingSectionListeners() {
    trainingSectionBtns.forEach((item) => item.addEventListener("click", handleSectionSelect));
}

function handleSectionSelect(e) {
    const selectedTraingSection = e.currentTarget;

    trainingSectionBtns.forEach((item) => item.classList.remove("active"));
    selectedTraingSection.classList.add("active");

    loadTrainingCategories(selectedTraingSection.dataset.filter);
}

function addTrainingCategoryListeners() {
    categoryItems.forEach((item) => item.addEventListener("click", handleCategoryToggle));
    selectAllCategoriesBtn.addEventListener("click", handleSelectAllCategories);
    deselectAllCategoriesBtn.addEventListener("click", handleDeselectAllCategories);
}

function handleCategoryToggle(e) {
    e.currentTarget.classList.toggle("selected");
}

function handleSelectAllCategories() {
    categoryItems.forEach((item) => item.classList.add("selected"));
}

function handleDeselectAllCategories() {
    categoryItems.forEach((item) => item.classList.remove("selected"));
}

// Position slider tooltips
function showSliderTooltip(slider, tooltip, unitname = "") {
    tooltip.innerHTML = slider.value + " " + unitname;
    const bulletPosition = (slider.value - slider.min) / (slider.max - slider.min);

    console.log(bulletPosition);
    console.log(bulletPosition * slider.offsetWidth + "px");

    tooltip.style.left = bulletPosition * (slider.offsetWidth - 22) + "px";
}

async function loadTrainingCategories(filter) {
    const response = await getRequest("category", { filter: filter }, true);

    const data = await response.json();
    if (response.ok) {
        if (!data.error) {
            showTrainingCategories(data.payload);
        }
    } else {
        console.log(data.message);
    }
}

function showTrainingCategories(categories) {
    const trainingCategoryContainer = document.querySelector("#training-subcat-container");
    emptyElement(trainingCategoryContainer);

    categories.forEach((category) => {
        const categoryEl = `
            <div data-id="${category.id}" class="subcat-item selected">
                <div class="check-indicator">
                    <img src="./img/icons/fill/subcattick.svg" alt="Checkmark" />
                </div>
                <div class="subcat-info">
                    <h3>Theorie Kapitel: ${category.identifier}</h3>
                    <h2>${category.title}</h2>
                </div>
            </div>
        `;

        trainingCategoryContainer.insertAdjacentHTML("beforeend", categoryEl);
    });

    refreshCategories();
}
