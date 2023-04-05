<?php
require_once("./utils/jwt_util.php");

function loginHandler($email, $password)
{
    global $conn;

    try {
        $stmt = $conn->prepare('SELECT id, username, password, is_admin FROM user WHERE email = :email');
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            throw new PDOException("E-Mail Adresse oder Passwort falsch");
        }
    } catch (PDOException $e) {
        die(errorMsg($e->getMessage()));
    }

    if ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (password_verify($password, $result['password'])) {
            if (password_needs_rehash($result['password'], PASSWORD_DEFAULT)) {

                try {
                    $newPasswordHash = password_hash($password, PASSWORD_DEFAULT);

                    $query = $conn->prepare('UPDATE player SET password = :newHash WHERE email = :email;');
                    $query->bindParam(":newHash", $newPasswordHash, PDO::PARAM_STR);
                    $query->bindParam(":email", $email, PDO::PARAM_STR);

                    $query->execute();
                } catch (PDOException $e) {
                    die(errorMsg());
                }
            }

            // logged in
            $userObj = ["userId" => $result['id'], "username" => $result['username'], "isAdmin" => $result['is_admin']];
            exit(returnData(create_token($userObj)));
        } else {
            die(errorMsg("Username oder Passwort falsch"));
        }
    }
}
