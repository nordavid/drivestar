<?php
function bookmarkQuestionHandler($id)
{
    global $conn;

    $userId = get_user_id();

    try {
        $stmt = $conn->prepare("SELECT * FROM bookmark WHERE user_id = :userId AND question_id = :questionId;");
        $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
        $stmt->bindParam(":questionId", $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // Delete bookmark
            $stmt = $conn->prepare("DELETE FROM bookmark WHERE user_id = :userId AND question_id = :questionId;");
            $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
            $stmt->bindParam(":questionId", $id, PDO::PARAM_INT);
            $stmt->execute();
        } else {
            // Add bookmark
            $stmt = $conn->prepare("INSERT INTO bookmark (user_id, question_id) VALUES (:userId, :questionId;");
            $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
            $stmt->bindParam(":questionId", $id, PDO::PARAM_INT);
            $stmt->execute();
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
