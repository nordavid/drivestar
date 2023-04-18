let selectedSection;

function initQuestionSection() {
    loadCategories("Grundstoff");
    addSectionEventListeners();
}

function addSectionEventListeners() {
    const sectionButtons = document.querySelectorAll(".cat-button");
    sectionButtons.forEach((item) =>
        item.addEventListener("click", function (e) {
            toggleSection(sectionButtons, e.currentTarget);
        })
    );
}

function addCategoryEventListeners() {
    const subcatItems = document.querySelectorAll(".subcategory");
    subcatItems.forEach((item) =>
        item.addEventListener("click", function (e) {
            toggleCategory(subcatItems, e.currentTarget);
        })
    );
}

function addBookmarkBtnEventListeners() {
    const bookMarkBtns = document.querySelectorAll(".save-question-button");
    bookMarkBtns.forEach((item) =>
        item.addEventListener("click", async (e) => {
            e.currentTarget.closest(".question").classList.toggle("saved");

            const formData = new FormData();
            formData.append("id", e.currentTarget.dataset.id);

            try {
                const data = await postRequest("question/bookmark", formData, true);
                console.log(data);
            } catch (error) {
                console.log(error.message);
            }
        })
    );
}

function toggleSection(sectionButtons, currentEl) {
    sectionButtons.forEach((item) => item.classList.remove("active"));
    currentEl.classList.add("active");

    selectedSection = currentEl.dataset.filter;
    loadCategories(currentEl.dataset.filter);

    emptyElement(document.querySelector("#question-list"));
}

function toggleCategory(categoryItems, currentEl) {
    categoryItems.forEach((item) => item.classList.remove("active"));
    currentEl.classList.add("active");

    loadQuestions(currentEl.dataset.id, selectedSection == "Bookmarks" ? true : false);
}

async function loadCategories(filter) {
    try {
        const categories = await getRequest("category", { filter: filter }, true);
        addCategories(categories);
    } catch (error) {
        console.log(error.message);
    }
}

async function loadQuestions(categoryId, bookmarked) {
    try {
        const questions = await getRequest(
            "question/category",
            { id: categoryId, bookmarked: bookmarked },
            true
        );
        addQuestions(questions);
    } catch (error) {
        console.log(error.message);
    }
}

function addCategories(categories) {
    const categoryContainer = document.querySelector("#subcategory-select .subcategory-container");
    emptyElement(categoryContainer);

    if (categories.length == 0) {
        showToast("Du hast noch keine Fragen gespeichert", "right");
        loadCategories("Grundstoff");
        selectedSection = "Grundstoff";
        return;
    }

    categories.forEach((category) => {
        const categoryEl = `
            <div data-id="${category.id}" class="subcategory">
                <h3>Theorie Kapitel: ${category.identifier}</h3>
                <h2>${category.title}</h2>
            </div>
        `;

        categoryContainer.insertAdjacentHTML("beforeend", categoryEl);
    });

    addCategoryEventListeners();

    // Load questions for first visible category and highlight first category
    document.querySelector(".subcategory").classList.add("active");
    loadQuestions(categories[0].id, selectedSection == "Bookmarks" ? true : false);
}

function addQuestions(questions) {
    const questionContainer = document.querySelector("#question-list");
    emptyElement(questionContainer);

    if (questions.length == 0) {
        questionContainer.innerText = "Keine Fragen gefunden";
        return;
    }

    questions.forEach((question) => {
        const questionEl = `
        <div class="question  ${question.is_bookmarked ? "saved" : ""}">
            <div class="question-info">
                <div class="header">
                    <h1 class="question-identifier">Theorie Frage: ${question.identifier}</h1>
                    <div class="divider"></div>
                    <h2 class="qustion-points">Fehlerpunkte: ${question.fault_points}</h2>
                </div>
                <p>${question.question}</p>
                <div data-id="${question.id}" class="save-question-button">
                    <img src="./img/icons/line/save.svg" alt="Gespeichert Icon" />
                    <h3>Frage speichern</h3>
                </div>
            </div>
            ${
                question.image_path
                    ? `<div class="question-image"><img src="./uploads/${question.image_path}" /></div>`
                    : ""
            }
        </div>
    `;

        questionContainer.insertAdjacentHTML("beforeend", questionEl);
    });

    addBookmarkBtnEventListeners();
}

function emptyElement(element) {
    element.innerHTML = "";
}
