<?php
function getCategoryStatsHandler()
{
    global $conn;
    $userId = get_user_id();

    try {
        $stmt = $conn->prepare(
            'SELECT 
            c.title AS category_title,
            total_question_count.total_questions,
            CAST(SUM(ua.is_correct) AS INTEGER) AS correct_answers_count
            FROM category c 
                JOIN question q ON q.category_id = c.id 
                LEFT JOIN user_answer ua ON ua.question_id = q.id
                LEFT JOIN exercise e ON ua.exercise_id = e.id
                JOIN (
    SELECT 
      q.category_id, 
      COUNT(q.id) AS total_questions 
    FROM 
      question q 
    GROUP BY 
      q.category_id
  ) AS total_question_count ON total_question_count.category_id = c.id
          WHERE 
            e.user_id = :userId
          GROUP BY 
            c.title'
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
