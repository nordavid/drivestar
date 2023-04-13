<?php
function getExerciseResultHandler($id)
{
    global $conn;

    try {
        $stmt = $conn->prepare("SELECT question_id, is_correct FROM user_answer WHERE exercise_id = :id;");
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
