function initExamSection() {
    const startExamBtn = document.getElementById("start-exam-button");
    startExamBtn.addEventListener("click", handleExamStart);
}

async function handleExamStart() {
    const formData = new FormData();
    formData.append("type", "Exam");
    formData.append("duration", 60 * 60);
    formData.append("question_count", 30);
    formData.append("categories[]", null);

    try {
        const data = await postRequest("exercise/start", formData, true);
        console.log(data);
        new Exercise(Exercise.Type.Exam, data.exerciseId, 60 * 60, data.questionIds);
    } catch (error) {
        console.log(error.message);
    }
}
