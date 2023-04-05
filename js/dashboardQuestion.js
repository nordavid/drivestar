// Main category select
const categorySelect = document.querySelectorAll(".cat-button");

function activeCategory() {
    categorySelect.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
}
categorySelect.forEach((item) => item.addEventListener("click", activeCategory));
