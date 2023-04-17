<?php
function getCategoryStatsHandler()
{
    global $conn;
    $userId = get_user_id();

    try {
        $stmt = $conn->prepare(
            'SELECT 
            c.title AS category_title, 
            COUNT(q.id) AS total_question_count,
            CAST(COALESCE(SUM(ua.is_correct), 0) AS INTEGER) AS correct_answer_count
        FROM category c 
        JOIN question q ON q.category_id = c.id 
        LEFT JOIN (
            SELECT ua.question_id, e.id AS exercise_id, ua.is_correct
            FROM user_answer ua 
            JOIN exercise e ON ua.exercise_id = e.id 
            WHERE e.user_id = :userId
        ) ua ON ua.question_id = q.id 
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
