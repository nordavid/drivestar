class Exercise {
    constructor(id, duration, questionIds) {
        this.id = id;
        this.duration = duration;
        this.questionIds = questionIds;
        this.currentQuestionIndex = 0;
        this.answeredQuestions = {};
    }

    async handleExercise() {
        const question = await this.fetchQuestionWithAnswers(
            this.questionIds[this.currentQuestionIndex]
        );
        this.displayQuestion(question, this.getQuestionContainer());
        this.getBookmarkButton().addEventListener("click", this.handleBookmarkToggle);
    }

    async fetchQuestionWithAnswers(id) {
        try {
            const question = await getRequest("question", { id: id }, true);
            return question;
        } catch (error) {
            console.log(error.message);
        }
    }

    displayQuestion(question, container) {
        const questionEl = `
        <div id="exercise-question" class=" ${question.is_bookmarked ? "saved" : ""}">
            <div class="header">
                <h1>Frage: ${question.identifier}</h1>
                <h3>Fehlerpunkte: ${question.fault_points}</h3>
            </div>
            <div id="exercise-question-content" class="question-content">
            ${question.image_path ? `<img src="./uploads/${question.image_path}" />` : ""}
                <p>${question.question}</p>
                <div data-id="${question.id}" class="save-question-button">
                    <img
                        src="./img/icons/line/save.svg"
                        alt="Speichern Icon"
                    />
                    <h3>Frage speichern</h3>
                </div>
            </div>
        </div>
        `;

        container.innerHTML = questionEl;
    }

    getQuestionContainer() {
        return document.getElementById("exercise-question-container");
    }

    getBookmarkButton() {
        return document.querySelector("#exercise-question-content .save-question-button");
    }

    // Handlers
    async handleBookmarkToggle(e) {
        e.currentTarget.closest("#exercise-question").classList.toggle("saved");

        const formData = new FormData();
        formData.append("id", e.currentTarget.dataset.id);

        try {
            const data = await postRequest("question/bookmark", formData, true);
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    }
}
