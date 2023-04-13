<?php
function getCategoryStatsHandler()
{
    global $conn;
    $userId = get_user_id();

    'SELECT 
    category.id, category.title AS category_name, 
    SUM(total_question_counts.question_count) AS question_count 
FROM 
    category 
    JOIN (
        SELECT 
            category_id, 
            COUNT(*) AS question_count 
        FROM 
            question 
        GROUP BY 
            category_id
    ) AS total_question_counts ON category.id = total_question_counts.category_id 
GROUP BY 
    category.title';

    'SELECT c.title AS category_title, 
COUNT(DISTINCT q.id) AS total_question_count,
COUNT(DISTINCT ua.question_id) AS correct_answer_count
FROM category c
JOIN question q ON c.id = q.category_id
LEFT JOIN user_answer ua ON q.id = ua.question_id AND ua.is_correct = 1
GROUP BY c.title';

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
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo returnData($categories);
        } else {
            echo errorMsg("Keine Kategorien gefunden");
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
