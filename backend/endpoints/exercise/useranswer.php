<?php
function userAnswerHandler($exercise_id, $question_id, $user_answers)
{


    $isCorrect = true;

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
                            $isCorrect = false;
                            exit(successMsg("Antwort gespeichert"));
                        }
                    }
                }
            }
        } else {
            echo errorMsg();
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
