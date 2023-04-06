var questionSlider = document.getElementById("question-slider");
var questionTooltip = document.getElementById("question-slider-tooltip");

questionSlider.addEventListener("input", showQuestionSliderValue, false);

function showQuestionSliderValue() {
    questionTooltip.innerHTML = questionSlider.value;
    var bulletPosition =
        (questionSlider.value - questionSlider.min) / (questionSlider.max - questionSlider.min);
    console.log(bulletPosition);

    console.log(bulletPosition * questionSlider.offsetWidth + "px");
    // questionTooltip.style.left = bulletPosition * (questionSlider.offsetWidth - 0) + "px";
    questionTooltip.style.left = bulletPosition * (questionSlider.offsetWidth - 22) + "px";
}

var timeSlider = document.getElementById("time-slider");
var timeTooltip = document.getElementById("time-slider-tooltip");

timeSlider.addEventListener("input", showTimeSliderValue, false);

function showTimeSliderValue() {
    timeTooltip.innerHTML = timeSlider.value + " min";
    var bulletPosition = (timeSlider.value - timeSlider.min) / (timeSlider.max - timeSlider.min);
    console.log(bulletPosition);

    console.log(bulletPosition * timeSlider.offsetWidth + "px");
    // timeTooltip.style.left = bulletPosition * (timeSlider.offsetWidth - 0) + "px";
    timeTooltip.style.left = bulletPosition * (timeSlider.offsetWidth - 22) + "px";
}

// Training category select
const trainingCategorySelect = document.querySelectorAll(".maincat-item");

function activeCategory() {
    trainingCategorySelect.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
}
trainingCategorySelect.forEach((item) => item.addEventListener("click", activeCategory));
