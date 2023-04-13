<?php
function getCategoryStatsHandler()
{
    global $conn;
    $userId = get_user_id();

    try {
        $stmt = $conn->prepare(
            'SELECT c.title AS category_title, 
                CAST(SUM(q.total_question_count) AS INT) AS total_question_count,
                COUNT(DISTINCT ua.question_id) AS correct_answer_count
            FROM category c
                JOIN (
                    SELECT category_id, COUNT(*) AS total_question_count
                    FROM question
                    GROUP BY category_id
                ) q ON c.id = q.category_id
                LEFT JOIN question qs ON c.id = qs.category_id
                LEFT JOIN user_answer ua ON qs.id = ua.question_id AND ua.is_correct = 1
                LEFT JOIN exercise e ON ua.exercise_id = e.id
            WHERE e.user_id = :userId
            GROUP BY c.title;'
        );
        $stmt->bindParam(":userId", $userId, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo returnData($result);
        } else {
            echo errorMsg("Keine Ergebnisse gefunden");
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
