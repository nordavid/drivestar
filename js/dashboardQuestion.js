let selectedSection;

function initQuestionSection() {
    loadCategories("Grundstoff");
    // loadQuestions(1, false);
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

            const response = await postRequest("question/bookmark", formData, true);
            const data = await response.json();
            console.log(data);
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
    const response = await getRequest("category", { filter: filter }, true);

    const data = await response.json();
    if (response.ok) {
        if (!data.error) {
            addCategories(data.payload);
        }
    } else {
        console.log(data.message);
    }
}

async function loadQuestions(categoryId, bookmarked) {
    const response = await getRequest(
        "question/category",
        { id: categoryId, bookmarked: bookmarked },
        true
    );

    const data = await response.json();
    if (response.ok) {
        if (!data.error) {
            addQuestions(data.payload);
        }
    } else {
        console.log(data.message);
    }
}

function addCategories(categories) {
    const categoryContainer = document.querySelector("#subcategory-select .subcategory-container");
    emptyElement(categoryContainer);

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
    const subcatItems = document.querySelector(".subcategory").classList.add("active");
    loadQuestions(categories[0].id, selectedSection == "Bookmarks" ? true : false);
}

function addQuestions(questions) {
    const questionContainer = document.querySelector("#question-list");
    emptyElement(questionContainer);

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
                    <h3>Frage markieren</h3>
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
