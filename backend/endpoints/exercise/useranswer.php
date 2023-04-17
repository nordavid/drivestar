<?php
function userAnswerHandler($exercise_id, $question_id, $user_answers)
{
    global $conn;

    try {
        $stmt = $conn->prepare(
            "SELECT id, is_correct
            FROM answer
            WHERE question_id = :id"
        );
        $stmt->bindParam(":id", $question_id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $answers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($user_answers as $user_answer) {
                $uaObj = json_decode($user_answer, true);

                foreach ($answers as $answer) {
                    if (intval($uaObj["id"]) == $answer["id"]) {
                        if ($uaObj["selected"] != $answer["is_correct"]) {
                            exit(successMsg("Antwort gespeichert"));
                        }
                    }
                }
            }

            setUserAnswerToCorrect($exercise_id, $question_id);
        } else {
            echo errorMsg();
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}

function setUserAnswerToCorrect($exercise_id, $question_id)
{
    global $conn;

    try {
        $stmt = $conn->prepare(
            "UPDATE user_answer 
            SET is_correct = 1 
            WHERE exercise_id = :exerciseId AND question_id = :questionId;"
        );
        $stmt->bindParam(":exerciseId", $exercise_id, PDO::PARAM_INT);
        $stmt->bindParam(":questionId", $question_id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            echo successMsg("Frage beantwortet");
        }
    } catch (PDOException $e) {
        die(errorMsg($e->getMessage()));
    }
}
