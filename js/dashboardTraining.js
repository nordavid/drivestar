// Slider tooltips
function showSliderTooltip(slider, tooltip, unitname = "") {
    tooltip.innerHTML = slider.value + " " + unitname;
    const bulletPosition = (slider.value - slider.min) / (slider.max - slider.min);

    console.log(bulletPosition);
    console.log(bulletPosition * slider.offsetWidth + "px");

    tooltip.style.left = bulletPosition * (slider.offsetWidth - 22) + "px";
}

const questionSlider = document.getElementById("question-slider");
var questionTooltip = document.getElementById("question-slider-tooltip");
questionSlider.addEventListener("input", () => showSliderTooltip(questionSlider, questionTooltip));

var timeSlider = document.getElementById("time-slider");
var timeTooltip = document.getElementById("time-slider-tooltip");
timeSlider.addEventListener("input", () => showSliderTooltip(timeSlider, timeTooltip, "min"));

// Training main category select
const trainingCategorySelect = document.querySelectorAll(".maincat-item");

function activeCategory() {
    trainingCategorySelect.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
}
trainingCategorySelect.forEach((item) => item.addEventListener("click", activeCategory));

// Training sub category select
const categoryItems = document.querySelectorAll(".subcat-item");
categoryItems.forEach((item) =>
    item.addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("selected");
    })
);

const selectAllSubcatsBtn = document.querySelector("#select-all-subcats");
selectAllSubcatsBtn.addEventListener("click", () => {
    categoryItems.forEach((item) => item.classList.add("selected"));
});

const unselectAllSubcatsBtn = document.querySelector("#unselect-all-subcats");
unselectAllSubcatsBtn.addEventListener("click", () => {
    categoryItems.forEach((item) => item.classList.remove("selected"));
});
