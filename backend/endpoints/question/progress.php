<?php
function getQuestionsProgressHandler()
{
    global $conn;

    $userId = get_user_id();

    try {
        $stmt = $conn->prepare(
            "SELECT 
                (SELECT COUNT(*) FROM question) AS total_questions_count,
                CAST(SUM(ua.is_correct) AS INTEGER) AS correct_answers_count
            FROM user_answer ua
                INNER JOIN exercise e ON ua.exercise_id = e.id
            WHERE e.user_id = :userId;"
        );
        $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo returnData($result);
        } else {
            echo errorMsg();
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
