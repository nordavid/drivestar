<?php
function getUserHandler()
{
    $userId = get_user_id();

    try {
        global $conn;
        $sql = "SELECT username, profilepicture, is_admin FROM user WHERE user.id = :id LIMIT 1;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":id", $userId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            echo returnData($result);
        } else echo errorMsg("User nicht gefunden");
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
