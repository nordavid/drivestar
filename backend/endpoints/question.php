<?php
function getQuestionByIdHandler($id)
{
    global $conn;

    $userId = get_user_id();

    try {
        $stmt = $conn->prepare(
            "SELECT q.*,  
                GROUP_CONCAT(a.answer SEPARATOR '|') AS answers, 
                GROUP_CONCAT(a.is_correct SEPARATOR '|') AS correct_answers, 
                GROUP_CONCAT(a.id SEPARATOR '|') AS answer_ids, 
                IF(b.user_id IS NOT NULL, 1, 0) AS is_bookmarked 
            FROM question q
                JOIN answer a ON q.id = a.question_id
                LEFT JOIN bookmark b ON q.id = b.question_id AND b.user_id = :userId
            WHERE q.id = :id
            GROUP BY q.id;"
        );
        $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $answersArr = [];

            $answers = explode('|', $row['answers']);
            $is_correct_answers = explode('|', $row['correct_answers']);
            $answer_ids = explode('|', $row['answer_ids']);

            for ($i = 0; $i < count($answers); $i++) {
                $answer = [
                    'id' => (int) $answer_ids[$i],
                    'answer' => $answers[$i],
                    'is_correct' => ($is_correct_answers[$i] == '1')
                ];
                $answersArr[] = $answer;
            }

            $row['answers'] = $answersArr;
            unset($row['correct_answers']);
            unset($row['answer_ids']);

            echo returnData($row);
        } else {
            echo errorMsg("Frage nicht gefunden");
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
