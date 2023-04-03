<?php
require_once('./utils/input_validation.php');
require_once('./utils/image_upload.php');
require_once("./utils/jwt_util.php");

function registerHandler($username, $email, $password)
{
    global $conn;

    if (!isValidUsername($username)) {
        die(errorMsg("Username hat falsches Format"));
    }

    if (!isValidEmail($email)) {
        die(errorMsg("E-Mail Adresse hat falsches Format"));
    }

    if (!isValidPassword($password, 6, 30)) {
        die(errorMsg("Das Passwort muss zwischen 6 und 30 Zeichen lang sein"));
    }

    if (isEmailUsed($email)) {
        die(errorMsg("E-Mail Adresse wird bereits verwendet"));
    }

    try {
        $password = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO user (username, password, email) VALUES (:name, :password, :email)");
        $stmt->bindParam(":name", $username, PDO::PARAM_STR);
        $stmt->bindParam(":password", $password, PDO::PARAM_STR);
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        $userId = $conn->lastInsertId();

        upload_profilepicture($userId, "profilepicture_$userId");


        // Registered successful and logged in
        $userObj = ["user_id" => $userId, "username" => $username, "is_admin" => false];
        exit(returnData(create_token($userObj)));
    } catch (PDOException $e) {
        die(errorMsg("Fehler bei Registrierung. " . $e->getMessage()));
    }
}

function isEmailUsed($email)
{
    global $conn;

    try {
        $stmt = $conn->prepare('SELECT id FROM user WHERE email = :email;');
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        }
    } catch (PDOException $e) {
        echo errorMsg("Fehler: " . $e->getMessage());
        return true;
    }
    return false;
}

function upload_profilepicture($userId, $name)
{
    global $conn;

    try {
        $imgPath = upload_image("profilepicture", "profilepictures", $name, 5);
        $stm = $conn->prepare('UPDATE user SET profilepicture = :imgPath WHERE id = :userId;');
        $stm->bindParam(":imgPath", $imgPath, PDO::PARAM_STR);
        $stm->bindParam(":userId", $userId, PDO::PARAM_STR);
        $stm->execute();
    } catch (Exception $e) {
        die(errorMsg($e->getMessage()));
    }
}
