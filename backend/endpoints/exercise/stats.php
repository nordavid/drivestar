<?php
function getExerciseStatsHandler()
{
    global $conn;

    $userId = get_user_id();

    try {
        $stmt = $conn->prepare(
            'SELECT exercise.id AS id, 
                exercise.type,
                exercise.created_at AS date, 
                TIME_TO_SEC(TIMEDIFF(exercise.accomplished_at, exercise.created_at)) AS time_needed, 
                COUNT(*) AS total_questions_count,
                CAST(SUM(user_answer.is_correct) AS INTEGER) AS correct_answers_count
            FROM exercise
            LEFT JOIN user_answer ON exercise.id = user_answer.exercise_id 
            WHERE exercise.user_id = :userId AND exercise.accomplished_at IS NOT NULL
            GROUP BY exercise.id
            ORDER BY exercise.created_at DESC
            LIMIT 6;'
        );
        $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo returnData($exercises);
        } else {
            echo errorMsg("Keine Übungen gefunden");
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
