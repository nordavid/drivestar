<?php
function getCategoriesForSectionHandler($section) {
    global $conn;

    try {
        $stmt = $conn->prepare("SELECT * FROM category WHERE section = :section;");
        $stmt->bindParam(":section", $section, PDO::PARAM_STR);
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
