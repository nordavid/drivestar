class Exercise {
    constructor(type, id, duration, questionIds) {
        this.type = type;
        this.id = id;
        this.duration = duration;
        this.questionIds = questionIds;
        this.currentQuestionNumber = 1;
        this.finishedQuestions = [];
        this.isSolutionMode = false;

        this.exerciseWindow = document.getElementById("exercise-window");
        this.questionContainer = document.getElementById("exercise-question-container");
        this.confirmBtn = document.getElementById("confirm-exercise-answer");
        this.quitBtn = document.getElementById("cancel-exercise-btn");
        this.answersContainer = document.getElementById("exercise-answers-container");
        this.init();
    }

    static Type = {
        Training: "Training",
        Exam: "Exam",
    };

    init() {
        if (this.type == Exercise.Type.Training) {
            document.getElementById("exercise-question-selector").style.visibility = "hidden";
        } else {
            this.confirmBtn.innerText = "Weiter";
            this.initQuestionSelector();
        }
        this.exerciseWindow.style.display = "flex";
        this.startTimer(this.duration, this.timeRunOut);
        this.displayQuestionNumber();
        this.fetchCurrentQuestion();

        this.quitBtn.addEventListener("click", this.handleCancelExerciseClicked.bind(this));
        this.confirmBtn.addEventListener("click", this.handleConfirmBtnClicked.bind(this));
    }

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

    async fetchCurrentQuestion() {
        const response = await getRequest(
            "question",
            { id: this.questionIds[this.currentQuestionNumber - 1] },
            true
        );

        const data = await response.json();
        if (response.ok) {
            if (!data.error) {
                this.displayQuestion(data.payload);
            }
        } else {
            console.log(data.message);
        }
    }

    displayQuestion(question) {
        console.log(question);

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
                        alt="Markieren Icon"
                    />
                    <h3>Frage markieren</h3>
                </div>
            </div>
        </div>
        `;

        this.questionContainer.innerHTML = questionEl;
        this.addBookmarkBtnEventListener();
        this.displayAnswers(question.answers);
    }

    displayAnswers(answers) {
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

        const answerElements = document.querySelectorAll(
            "#exercise-answers-container .exercise-answer"
        );
        answerElements.forEach((item) => item.addEventListener("click", this.handleAnswerClicked));
    }

    displayQuestionNumber() {
        if (this.type == Exercise.Type.Training) {
            document.getElementById("exercise-question-number").textContent =
                this.finishedQuestions.length + 1 + "/" + this.questionIds.length;
        } else {
            document.getElementById("exercise-question-number").textContent =
                this.finishedQuestions.length + "/" + this.questionIds.length;
        }
    }

    // Timer
    startTimer(duration, callback) {
        var timer = duration,
            minutes,
            seconds;

        setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            document.getElementById("exercise-timer").textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                timer = duration;
                callback();
            }
        }, 1000);
    }

    timeRunOut() {
        alert("Over");
    }

    addQuestionSelectorListeners() {
        const elements = document.querySelectorAll("#question-id-selector .selector-item");
        elements.forEach((item) =>
            item.addEventListener("click", this.handleSelectorItemClick.bind(this))
        );
    }

    addBookmarkBtnEventListener() {
        const bookMarkBtn = document.querySelector(
            "#exercise-question-content .save-question-button"
        );

        bookMarkBtn.addEventListener("click", async (e) => {
            e.currentTarget.closest("#exercise-question").classList.toggle("saved");

            let formData = new FormData();
            formData.append("id", e.currentTarget.dataset.id);

            const response = await postRequest("question/bookmark", formData, true);
            const data = await response.json();
            console.log(data);
        });
    }

    goToQuestionNumber(number) {
        this.currentQuestionNumber = number;
        this.fetchCurrentQuestion();
        if (this.type == Exercise.Type.Exam) {
            this.setActiveQuestion(this.currentQuestionNumber);
        }
    }

    goToNextQuestion() {
        this.currentQuestionNumber++;
        this.fetchCurrentQuestion();
        if (this.type == Exercise.Type.Exam) {
            this.setActiveQuestion(this.currentQuestionNumber);
        }
    }

    markQuestionAsDone(questionNumber) {
        this.finishedQuestions.push(questionNumber);
        if (this.type == Exercise.Type.Exam) {
            const selectorItem = document.querySelector(
                `.selector-item[data-id="${questionNumber}"]`
            );
            selectorItem.classList.add("done");
        }
    }

    setActiveQuestion(questionNumber) {
        const elements = document.querySelectorAll("#question-id-selector .selector-item");
        elements.forEach((item) => item.classList.remove("current"));

        const selectorItem = document.querySelector(`.selector-item[data-id="${questionNumber}"]`);
        selectorItem.classList.add("current");
    }

    showSolution() {
        this.isSolutionMode = true;
    }

    // Event handler functions
    handleCancelExerciseClicked() {
        this.exerciseWindow.style.display = "none";
    }

    handleSelectorItemClick(e) {
        this.goToQuestionNumber(e.currentTarget.dataset.id);

        const elements = document.querySelectorAll("#question-id-selector .selector-item");
        elements.forEach((item) => item.classList.remove("current"));
        e.currentTarget.classList.add("current");
    }

    handleAnswerClicked(e) {
        e.currentTarget.classList.toggle("selected");
    }

    handleConfirmBtnClicked(e) {
        if (this.type == Exercise.Type.Training) {
            if (!this.isSolutionMode) {
                e.currentTarget.innerText = "Nächste Frage";
                this.markQuestionAsDone(this.currentQuestionNumber);
                this.showSolution();
                return;
            } else {
                // solution mode
                this.isSolutionMode = false;
                e.currentTarget.innerText = "Lösung anzeigen";
                if (
                    this.finishedQuestions.length >= this.questionIds.length ||
                    this.currentQuestionNumber >= this.questionIds.length
                ) {
                    console.log("raus da");
                    return;
                }
            }
        } else {
            if (
                this.finishedQuestions.length >= this.questionIds.length ||
                this.currentQuestionNumber >= this.questionIds.length
            ) {
                console.log("raus da");
            } else {
                if (!this.finishedQuestions.includes(this.currentQuestionNumber)) {
                    this.markQuestionAsDone(this.currentQuestionNumber);
                }
                this.goToNextQuestion();
                this.displayQuestionNumber();
            }
        }
    }
}
