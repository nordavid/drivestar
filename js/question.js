class Question {
    type;
    identifier;
    text;
    imagePath;
    categoryId;
    faultPoints;
    answers;
    isBookmarked;

    constructor(id) {
        this.id = id;
    }

    async initQuestion() {
        try {
            const question = await getRequest("question", { id: this.id }, true);
            this.type = question.type;
            this.identifier = question.identifier;
            this.text = question.question;
            this.imagePath = question.image_path;
            this.categoryId = question.category_id;
            this.faultPoints = question.fault_points;
            this.answers = question.answers;
            this.isBookmarked = question.is_bookmarked;
        } catch (error) {
            console.log(error.message);
        }
    }
}
