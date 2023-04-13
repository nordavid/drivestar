<?php
function getQuestionByIdHandler($id)
{
    global $conn;

    $userId = get_user_id();

    try {
        $stmt = $conn->prepare(
            "SELECT q.*, GROUP_CONCAT(a.answer SEPARATOR '|') AS answers, IF(b.user_id IS NOT NULL, 1, 0) AS is_bookmarked 
            FROM question q
                JOIN answer a ON q.id = a.question_id
                LEFT JOIN bookmark b ON q.id = b.question_id AND b.user_id = :userId
            WHERE q.id = :id
            GROUP BY q.id
            LIMIT 20;"
        );
        $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $question = $stmt->fetch(PDO::FETCH_ASSOC);
            $question['answers'] = explode('|', $question['answers']);
            echo returnData($question);
        } else {
            echo errorMsg("Frage nicht gefunden");
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
