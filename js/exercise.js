class Exercise {
    static Type = {
        Training: "Training",
        Exam: "Exam",
    };

    constructor(type, id, duration, questionIds) {
        this.type = type;
        this.id = id;
        this.duration = duration;
        this.questionIds = questionIds;
        this.currentQuestionNumber = 1;
        this.currentQuestion = null;
        this.answeredQuestions = [];
        this.answerDetails = {};
        this.isSolutionMode = false;
        this.timer = null;

        this.answerButtons = null;
        this.exerciseWindow = document.getElementById("exercise-window");
        this.exerciseContainer = document.getElementById("exercise-container");
        this.questionContainer = document.getElementById("exercise-question-container");
        this.confirmBtn = document.getElementById("confirm-exercise-answer");
        this.quitBtn = document.getElementById("cancel-exercise-btn");
        this.answersContainer = document.getElementById("exercise-answers-container");

        this.handleCancelExercise = this.handleCancelExercise.bind(this);
        this.handleExerciseConfirmation = this.handleExerciseConfirmation.bind(this);
        this.handleAnswerClicked = this.handleAnswerClicked.bind(this);
        this.handleSelectorItemClick = this.handleSelectorItemClick.bind(this);

        this.init();
    }

    init() {
        if (this.type == Exercise.Type.Training) {
            this.exerciseContainer.classList.add("training");
            this.exerciseContainer.classList.remove("exam");
        } else {
            this.exerciseContainer.classList.add("exam");
            this.exerciseContainer.classList.remove("training");
            this.confirmBtn.innerText = "Weiter";
            document.querySelector("#cancel-exercise-btn p").innerText = "Prüfung abbrechen";
            this.initQuestionSelector();
        }
        this.exerciseWindow.style.display = "flex";
        this.displayRemainingTime(this.duration);
        this.startTimer(this.duration, this.timeRunOut);
        this.displayAnsweredQuestionCount();
        this.navigateToQuestion(this.currentQuestionNumber);
        this.quitBtn.addEventListener("click", this.handleCancelExercise);
        this.confirmBtn.addEventListener("click", this.handleExerciseConfirmation);
    }

    // Methods that change view
    displayQuestion(question) {
        this.removeBookmarkBtnEventListener();

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

        this.questionContainer.innerHTML = questionEl;
        this.addBookmarkBtnEventListener();
    }

    displayAnswers(answers) {
        this.removeAnswerButtonsListener();
        this.answersContainer.innerHTML = "";

        answers.forEach((answer) => {
            const answerEl = `
            <div data-isCorect="${answer.is_correct}" class="exercise-answer">
                <div class="check-indicator">
                    <img src="./img/icons/fill/subcattick.svg" alt="Checkmark" />
                </div>
                <p class="exercise-answer-text">${answer.answer}</p>
            </div>
            `;

            this.answersContainer.insertAdjacentHTML("beforeend", answerEl);
        });

        this.addAnswerButtonsListener();

        // display previously selected answer options
        if (this.currentQuestionNumber in this.answerDetails) {
            for (let i = 0; i < this.answerButtons.length; i++) {
                const element = this.answerButtons[i];
                if (this.answerDetails[this.currentQuestionNumber][i].selected)
                    element.classList.add("selected");
            }
        }
    }

    displayAnsweredQuestionCount() {
        if (this.type == Exercise.Type.Training) {
            document.getElementById("exercise-question-number").textContent =
                this.answeredQuestions.length + 1 + "/" + this.questionIds.length;
        } else {
            document.getElementById("exercise-question-number").textContent =
                this.answeredQuestions.length + "/" + this.questionIds.length;
        }
    }

    displaySolution() {
        this.isSolutionMode = true;

        for (let i = 0; i < this.currentQuestion.answers.length; i++) {
            if (this.currentQuestion.answers[i].is_correct) {
                this.answerButtons[i].classList.add("correct");
            } else {
                this.answerButtons[i].classList.add("wrong");
            }
        }
    }

    displayRemainingTime(timer) {
        var minutes, seconds;

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("exercise-timer").textContent = minutes + ":" + seconds;
    }

    // Question navigation methods
    async navigateToQuestion(number) {
        this.currentQuestionNumber = number;
        this.currentQuestion = await this.fetchCurrentQuestion();
        this.displayQuestion(this.currentQuestion);
        this.displayAnswers(this.currentQuestion.answers);

        if (this.type == Exercise.Type.Exam) {
            this.setQuestionSelectorItemActive(this.currentQuestionNumber);
        }
    }

    async markQuestionAsAnswered(questionNumber) {
        if (!this.answeredQuestions.includes(questionNumber) || this.type == Exercise.Type.Exam) {
            if (!this.answeredQuestions.includes(questionNumber)) {
                this.answeredQuestions.push(questionNumber);
                this.displayAnsweredQuestionCount();
            }

            this.answerDetails[questionNumber] = [];
            this.answerButtons.forEach((item, index) => {
                this.answerDetails[questionNumber].push({
                    id: this.currentQuestion.answers[index].id,
                    selected: item.classList.contains("selected"),
                });
            });

            this.setQuestionSelectorItemDone(questionNumber);
            this.updateUserAnswerRequest(questionNumber);
        }
    }

    // Question selector methods
    initQuestionSelector() {
        const container = document.getElementById("question-id-selector");
        container.innerHTML = "";

        for (let i = 1; i <= this.questionIds.length; i++) {
            const selectorEl = `
            <div data-id="${i}" class="selector-item ${i == 1 ? "current" : ""}">${i}</div>
            `;

            container.insertAdjacentHTML("beforeend", selectorEl);
        }

        this.addQuestionSelectorListeners();
    }

    setQuestionSelectorItemDone(questionNumber) {
        if (this.type == Exercise.Type.Exam) {
            const selectorItem = document.querySelector(
                `.selector-item[data-id="${questionNumber}"]`
            );
            selectorItem.classList.add("done");
        }
    }

    setQuestionSelectorItemActive(questionNumber) {
        const elements = document.querySelectorAll("#question-id-selector .selector-item");
        elements.forEach((item) => item.classList.remove("current"));

        const selectorItem = document.querySelector(`.selector-item[data-id="${questionNumber}"]`);
        selectorItem.classList.add("current");
    }

    addAnswerButtonsListener() {
        this.answerButtons = document.querySelectorAll(
            "#exercise-answers-container .exercise-answer"
        );
        this.answerButtons.forEach((item) =>
            item.addEventListener("click", this.handleAnswerClicked)
        );
    }

    removeAnswerButtonsListener() {
        this.answerButtons = document.querySelectorAll(
            "#exercise-answers-container .exercise-answer"
        );
        this.answerButtons.forEach((item) =>
            item.removeEventListener("click", this.handleAnswerClicked)
        );
    }

    // Event listeners
    addQuestionSelectorListeners() {
        const elements = document.querySelectorAll("#question-id-selector .selector-item");
        elements.forEach((item) => item.addEventListener("click", this.handleSelectorItemClick));
    }

    removeQuestionSelectorListeners() {
        const elements = document.querySelectorAll("#question-id-selector .selector-item");
        elements.forEach((item) => item.removeEventListener("click", this.handleSelectorItemClick));
    }

    addBookmarkBtnEventListener() {
        const bookMarkBtn = document.querySelector(
            "#exercise-question-content .save-question-button"
        );
        bookMarkBtn.addEventListener("click", this.handleBookmarkToggle);
    }

    removeBookmarkBtnEventListener() {
        const bookMarkBtn = document.querySelector(
            "#exercise-question-content .save-question-button"
        );
        bookMarkBtn?.removeEventListener("click", this.handleBookmarkToggle);
    }

    // Event handler methods
    handleCancelExercise() {
        this.cleanup();
        this.exerciseWindow.style.display = "none";
    }

    handleAnswerClicked(e) {
        if (
            (!this.isSolutionMode &&
                !this.answeredQuestions.includes(this.currentQuestionNumber)) ||
            this.type == Exercise.Type.Exam
        ) {
            e.currentTarget.classList.toggle("selected");
        }
    }

    handleSelectorItemClick(e) {
        this.navigateToQuestion(parseInt(e.currentTarget.dataset.id));

        const elements = document.querySelectorAll("#question-id-selector .selector-item");
        elements.forEach((item) => item.classList.remove("current"));
        e.currentTarget.classList.add("current");
    }

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

    handleExerciseConfirmation(e) {
        if (this.type === Exercise.Type.Training) {
            this.handleTrainingConfirmation(e);
        } else {
            this.handleExamConfirmation(e);
        }
    }

    handleTrainingConfirmation(e) {
        console.log(this.currentQuestionNumber);
        if (!this.isSolutionMode) {
            if (this.currentQuestionNumber == this.questionIds.length) {
                e.currentTarget.innerText = "Training beenden";
            } else {
                e.currentTarget.innerText = "Nächste Frage";
            }

            this.displaySolution();
            return;
        }

        // solution mode active
        this.isSolutionMode = false;

        e.currentTarget.innerText = "Lösung anzeigen";

        if (this.isLastQuestion()) {
            this.handleExerciseFinish();
            this.exerciseWindow.style.display = "none";
        } else {
            this.markQuestionAsAnswered(this.currentQuestionNumber);
            this.currentQuestionNumber++;
            this.navigateToQuestion(this.currentQuestionNumber);
        }
    }

    async handleExamConfirmation(e) {
        if (this.areAllQuestionsAnswered()) {
            this.handleExerciseFinish();
            return;
        }

        this.markQuestionAsAnswered(this.currentQuestionNumber);
        if (this.areAllQuestionsAnswered()) {
            e.currentTarget.innerText = "Prüfung beenden";
        }

        if (!this.isLastQuestion()) {
            this.currentQuestionNumber++;
            this.navigateToQuestion(this.currentQuestionNumber);
        }
    }

    handleExerciseFinish() {
        console.log("finisdhisdh");
        this.cleanup();
        this.postExerciseFinishedRequest();
    }

    cleanup() {
        clearTimeout(this.timer);
        this.quitBtn.removeEventListener("click", this.handleCancelExercise);
        this.confirmBtn.removeEventListener("click", this.handleExerciseConfirmation);

        this.removeQuestionSelectorListeners();
    }

    // Util methods
    async updateUserAnswerRequest(questionNumber) {
        const formData = new FormData();
        formData.append("exercise_id", this.id);
        formData.append("question_id", this.questionIds[questionNumber - 1]);

        for (let i = 0; i < this.answerDetails[questionNumber].length; i++) {
            formData.append(
                "user_answers[]",
                JSON.stringify(this.answerDetails[questionNumber][i])
            );
        }

        try {
            await postRequest("exercise/useranswer", formData, true);
        } catch (error) {
            console.log(error.message);
        }
    }

    async postExerciseFinishedRequest() {
        const formData = new FormData();
        formData.append("id", this.id);

        try {
            const response = await postRequest("exercise/finish", formData, true);
            console.log(response);
        } catch (error) {
            console.log(error.message);
        }
    }

    async fetchCurrentQuestion() {
        try {
            const question = await getRequest(
                "question",
                { id: this.questionIds[this.currentQuestionNumber - 1] },
                true
            );
            return question;
        } catch (error) {
            console.log(error.message);
        }
    }

    isLastQuestion() {
        return this.currentQuestionNumber >= this.questionIds.length;
    }

    areAllQuestionsAnswered() {
        return this.answeredQuestions.length >= this.questionIds.length;
    }

    startTimer(duration, callback) {
        var timer = duration;
        var boundFunc = this.displayRemainingTime.bind(this);

        this.timer = setInterval(function () {
            boundFunc(timer);

            if (--timer < 0) {
                timer = duration;
                callback();
            }
        }, 1000);
    }

    timeRunOut() {
        alert("Over");
    }
}
