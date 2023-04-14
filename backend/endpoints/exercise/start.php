<?php
function startExerciseHandler($type, $duration, $question_count, $categories)
{
    $userId = get_user_id();

    $questionIds = getRandomQuestionIds($categories, $question_count);
    if (count($questionIds) <= 0) {
        die(errorMsg("Fehler beim Starten der Übung"));
    }

    $exerciseId = insertExercise($userId, $type, $duration);
    if (!$exerciseId) {
        die(errorMsg("Fehler beim Starten der Übung"));
    }

    $insertedAnswers = insertUserAnswers($exerciseId, $questionIds);
    if (!$insertedAnswers) {
        die(errorMsg("Fehler beim Starten der Übung"));
    }

    echo returnData($questionIds, 201);
}

function insertExercise($userId, $type, $duration): string | false
{
    global $conn;

    $timestamp = time() + $duration;
    $finishedUntil = date('Y-m-d H:i:s', $timestamp);

    try {
        $stmt = $conn->prepare("INSERT INTO exercise (user_id, type, finished_until) VALUES (:userId, :type, :finishedUntil)");
        $stmt->bindParam(":userId", $userId, PDO::PARAM_STR);
        $stmt->bindParam(":type", $type, PDO::PARAM_STR);
        $stmt->bindParam(":finishedUntil", $finishedUntil, PDO::PARAM_STR);
        $stmt->execute();
        return $conn->lastInsertId();
    } catch (PDOException $e) {
        return false;
    }
}

function getRandomQuestionIds($categories, $question_count): array | false
{
    global $conn;

    $concatenatedCategories = implode(',', array_fill(0, count($categories), '?'));

    try {
        $stmt = $conn->prepare(
            "SELECT question.id 
            FROM question 
            WHERE category_id IN ($concatenatedCategories) 
                AND question.id NOT IN (SELECT user_answer.question_id FROM user_answer WHERE user_answer.is_correct = 1) 
            ORDER BY RAND() 
            LIMIT ?;"
        );

        for ($i = 1; $i <= count($categories); $i++) {
            $stmt->bindParam($i, $categories[$i - 1], PDO::PARAM_STR);
        }
        $stmt->bindParam(count($categories) + 1, $question_count, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $questionIds = $stmt->fetchAll(PDO::FETCH_COLUMN);
            return $questionIds;
        }
    } catch (PDOException $e) {
        return false;
    }
    return false;
}

function insertUserAnswers($exerciseId, $questionIds)
{
    global $conn;

    try {
        $stmt = $conn->prepare("INSERT INTO user_answer (exercise_id, question_id) VALUES (:exerciseId, :questionId)");

        foreach ($questionIds as $questionId) {
            $stmt->bindParam(':exerciseId', $exerciseId, PDO::PARAM_INT);
            $stmt->bindParam(':questionId', $questionId, PDO::PARAM_INT);
            $stmt->execute();
        }
    } catch (PDOException $e) {
        return false;
    }
    return true;
}
