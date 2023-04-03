<?php
function isValidEmail($email)
{
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    return true;
}

function isValidUsername($username, $maxLength = 20)
{
    if (empty($username) || strlen($username) > $maxLength || preg_match("/^[A-Za-z]+(?:[-' ][A-Za-z]+)*(?:\s+[A-Za-z]+)?$/", $username) == false) {
        return false;
    }
    return true;
}

function isValidPassword($password, $minLength = 5, $maxLength = 25)
{
    if (empty($password) || strlen($password) > $maxLength || strlen($password) < $minLength) {
        return false;
    }
    return true;
}
