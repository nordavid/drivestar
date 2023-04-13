<?php
function getQuestionByIdHandler($id)
{
    global $conn;

    try {
        $stmt = $conn->prepare(
            "SELECT q.*, GROUP_CONCAT(a.answer SEPARATOR '|') AS answers
            FROM question q
                JOIN answer a ON q.id = a.question_id
            WHERE q.id = :id
            GROUP BY q.id;"
        );
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
