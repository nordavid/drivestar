<?php
function getExerciseResultHandler($id)
{
    global $conn;

    try {
        $stmt = $conn->prepare(
            "SELECT ua.question_id, ua.is_correct, q.fault_points 
            FROM user_answer ua JOIN question q ON ua.question_id = q.id 
            WHERE exercise_id = :id;"
        );
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo returnData($result);
        } else {
            echo errorMsg("Keine beantworteten Fragen gefunden");
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
