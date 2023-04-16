class Exercise {
    constructor(type, id, duration, questionIds) {
        this.type = type;
        this.id = id;
        this.duration = duration;
        this.questionIds = questionIds;
        this.currentQuestionNumber = 0;
        this.exerciseWindow = document.getElementById("exercise-window");
        this.questionContainer = document.getElementById("exercise-question-container");
        this.confirmBtn = document.getElementById("confirm-exercise-answer");
        this.answersContainer = document.getElementById("exercise-answers-container");
        this.init();
    }

    init() {
        if (this.type == "Training") {
            document.getElementById("exercise-question-selector").style.visibility = "hidden";
        }
        this.exerciseWindow.style.display = "flex";
        this.startTimer(this.duration, this.timeRunOut);
        this.displayQuestionNumber();
        this.fetchCurrentQuestion();

        this.confirmBtn.addEventListener("click", this.handleConformBtnClicked.bind(this));
    }

    async fetchCurrentQuestion() {
        const response = await getRequest(
            "question",
            { id: this.questionIds[this.currentQuestionNumber] },
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
    }

    displayQuestionNumber() {
        document.getElementById("exercise-question-number").textContent =
            this.currentQuestionNumber + 1 + "/" + this.questionIds.length;
    }

    navigateToQuestion(questionNumber) {}

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

    // Event handler functions
    handleConformBtnClicked(e) {
        e.currentTarget.innerText = "Weiter";
        this.currentQuestionNumber++;
        this.fetchCurrentQuestion();
        this.navigateToQuestion(this.currentQuestionNumber);
        this.displayQuestionNumber();
    }
}
