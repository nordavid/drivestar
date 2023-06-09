<?php
function getQuestionsByCategoryIdHandler($id, $bookmarked)
{
    global $conn;

    $userId = get_user_id();

    try {
        $stmt = null;

        if ($bookmarked == "true") {
            $stmt = $conn->prepare(
                "SELECT q.*, 
                    GROUP_CONCAT(a.answer SEPARATOR '|') AS answers, 
                    GROUP_CONCAT(a.is_correct SEPARATOR '|') AS correct_answers,
                    IF(b.user_id IS NOT NULL, 1, 0) AS is_bookmarked 
                FROM question q
                    JOIN answer a ON q.id = a.question_id
                    LEFT JOIN bookmark b ON q.id = b.question_id AND b.user_id = :userId
                WHERE q.category_id = :id AND b.user_id = :userId
                GROUP BY q.id;"
            );
        } else {
            $stmt = $conn->prepare(
                "SELECT q.*, 
                    GROUP_CONCAT(a.answer SEPARATOR '|') AS answers, 
                    GROUP_CONCAT(a.is_correct SEPARATOR '|') AS correct_answers,
                    IF(b.user_id IS NOT NULL, 1, 0) AS is_bookmarked 
                FROM question q
                    JOIN answer a ON q.id = a.question_id
                    LEFT JOIN bookmark b ON q.id = b.question_id AND b.user_id = :userId
                WHERE q.category_id = :id
                GROUP BY q.id
                LIMIT 20;"
            );
        }
        $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($questions as &$question) {

                $answersArr = [];
                $answers = explode('|', $question['answers']);
                $is_correct_answers = explode('|', $question['correct_answers']);

                for ($i = 0; $i < count($answers); $i++) {
                    $answer = [
                        'answer' => $answers[$i],
                        'is_correct' => ($is_correct_answers[$i] == '1')
                    ];
                    $answersArr[] = $answer;
                }

                $question['answers'] = $answersArr;
                unset($question['correct_answers']);
            }
            echo returnData($questions);
        } else {
            echo returnData([]);
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
