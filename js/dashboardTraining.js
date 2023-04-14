function initTrainingSection() {
    getTrainingElements();

    removeEventListeners();

    addSliderEventListeners();
    addTrainingSectionListeners();
    addTrainingStartBtnListener();
    addTrainingCategoryListeners();

    loadTrainingCategories("Grundstoff");
}

let questionSlider,
    questionTooltip,
    timeSlider,
    timeTooltip,
    trainingSectionBtns,
    trainingStartBtn,
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

    // Training start button
    trainingStartBtn = document.querySelector(".start-training-button");

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

function addTrainingStartBtnListener() {
    trainingStartBtn.addEventListener("click", handleTrainingStartBtnClicked);
}

function handleCategoryToggle(e) {
    e.currentTarget.classList.toggle("selected");
    onTrainingCategoryChange();
}

function handleSelectAllCategories() {
    categoryItems.forEach((item) => item.classList.add("selected"));
    onTrainingCategoryChange();
}

function handleDeselectAllCategories() {
    categoryItems.forEach((item) => item.classList.remove("selected"));
    onTrainingCategoryChange();
}

function handleTrainingStartBtnClicked() {
    const selectedCatsCount = getSelectedTrainingCategoriesCount();
    if (selectedCatsCount < 1) {
        console.log("Wähle mindestens eine Kategorie aus");
    } else {
        startTraining();
    }
}

function onTrainingCategoryChange() {
    const selectedCatsCount = getSelectedTrainingCategoriesCount();

    const trainingBtn = document.querySelector(".start-training-button");
    if (selectedCatsCount < 1) {
        trainingBtn.style.opacity = 0.5;
    } else {
        trainingBtn.style.opacity = 1;
    }
}

function getSelectedTrainingCategoriesCount() {
    const selectedTrainingCategories = document.querySelectorAll(".subcat-item.selected");
    return selectedTrainingCategories.length;
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
    categoryItems.forEach((item) => item.removeEventListener("click", handleCategoryToggle));

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

function getSelectedTrainingCategoryIds() {
    let selectedIds = [];
    const selectedTrainingCategories = document.querySelectorAll(".subcat-item.selected");
    selectedTrainingCategories.forEach((item) => selectedIds.push(item.dataset.id));
    return selectedIds;
}

async function startTraining() {
    let trainingSettings = new FormData();
    trainingSettings.append("type", "Practice");
    trainingSettings.append("duration", timeSlider.value * 60);
    trainingSettings.append("question_count", questionSlider.value);

    const selectedCatsIds = getSelectedTrainingCategoryIds();
    for (let i = 0; i < selectedCatsIds.length; i++) {
        trainingSettings.append("categories[]", selectedCatsIds[i]);
    }

    const response = await postRequest("exercise/start", trainingSettings, true);
    const data = await response.text();

    console.log(data);
}
