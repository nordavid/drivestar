<?php
require_once("./utils/jwt_util.php");

function loginHandler($username, $password)
{
    global $conn;

    try {
        $stmt = $conn->prepare('SELECT id, username, password, is_admin FROM user WHERE username = :username');
        $stmt->bindParam(":username", $username, PDO::PARAM_STR);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            throw new PDOException("Username oder Passwort falsch");
        }
    } catch (PDOException $e) {
        die(errorMsg($e->getMessage()));
    }

    if ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (password_verify($password, $result['password'])) {
            if (password_needs_rehash($result['password'], PASSWORD_DEFAULT)) {

                try {
                    $newPasswordHash = password_hash($password, PASSWORD_DEFAULT);

                    $query = $conn->prepare('UPDATE player SET password = :newHash WHERE username = :username;');
                    $query->bindParam(":newHash", $newPasswordHash, PDO::PARAM_STR);
                    $query->bindParam(":username", $username, PDO::PARAM_STR);

                    $query->execute();
                } catch (PDOException $e) {
                    die(errorMsg());
                }
            }

            // logged in
            $userObj = ["user_id" => $result['id'], "username" => $result['username'], "is_admin" => $result['is_admin']];
            exit(returnData(create_token($userObj)));
        } else {
            die(errorMsg("Username oder Passwort falsch"));
        }
    }
}
