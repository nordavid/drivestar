<?php
function getCategoriesHandler($filter)
{
    switch ($filter) {
        case 'All':
            getAllCategories();
            break;
        case 'Bookmarks':
            getCategoriesForBookmarks();
            break;
        default:
            getCategoriesForSection($filter);
            break;
    }
}

function getCategoriesForSection($section)
{
    global $conn;

    try {
        $stmt = $conn->prepare("SELECT * FROM category WHERE section = :section;");
        $stmt->bindParam(":section", $section, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo returnData($categories);
        } else {
            echo errorMsg("Keine Kategorien gefunden", 404);
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}

function getAllCategories()
{
    global $conn;

    try {
        $stmt = $conn->prepare("SELECT * FROM category;");
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo returnData($categories);
        } else {
            echo errorMsg("Keine Kategorien gefunden", 404);
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}

function getCategoriesForBookmarks()
{
    global $conn;
    $userId = get_user_id();

    try {
        $stmt = $conn->prepare(
            'SELECT c.id, c.identifier, c.title, c.section
            FROM bookmark b 
                JOIN question q ON b.question_id = q.id 
                JOIN category c ON q.category_id = c.id
            WHERE b.user_id = :userId
            GROUP BY c.id'
        );
        $stmt->bindParam(":userId", $userId, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo returnData($categories);
        } else {
            echo errorMsg("Keine Kategorien gefunden", 404);
        }
    } catch (PDOException $e) {
        echo errorMsg($e->getMessage());
    }
}
