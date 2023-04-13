<?php
function getCategoriesHandler()
{
    global $conn;

    try {
        $stmt = $conn->prepare("SELECT * FROM category;");
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo returnData($categories);
        } else {
            echo errorMsg("Keine Kategorien gefunden");
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
