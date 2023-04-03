<?php
require_once('./config.php');
require_once('./utils/return_data.php');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_drivestar";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(errorMsg("Fehler bei Datenbankverbindung: " . $e->getMessage()));
}
