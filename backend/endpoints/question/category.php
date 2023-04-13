<?php
function getQuestionsByCategoryIdHandler($id)
{
    global $conn;

    try {
        $stmt = $conn->prepare(
            "SELECT q.*, GROUP_CONCAT(a.answer SEPARATOR '|') AS answers
          FROM question q
          JOIN answer a ON q.id = a.question_id
          WHERE q.category_id = :id
          GROUP BY q.id;"
        );
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($questions as &$question) {
                $question['answers'] = explode('|', $question['answers']);
            }
            echo returnData($questions);
        } else {
            echo errorMsg("Keine Fragen gefunden");
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
