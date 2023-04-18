<?php
function finishExerciseHandler($id)
{
    global $conn;

    $currentTimestamp = time();
    $finishedTime = date('Y-m-d H:i:s', $currentTimestamp);

    try {
        $stmt = $conn->prepare('UPDATE exercise SET accomplished_at = :finishedTime WHERE id = :exerciseId;');
        $stmt->bindParam(":finishedTime", $finishedTime, PDO::PARAM_STR);
        $stmt->bindParam(":exerciseId", $id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            echo successMsg("Exercise abgeschlossen");
        } else {
            echo errorMsg();
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
