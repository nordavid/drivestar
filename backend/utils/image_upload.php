<?php
function upload_image($formFileName, $uploadsSubDir, $newFileName, $maxMb = 3)
{

    if (!isset($_FILES[$formFileName])) {
        throw new Exception("Es gibt keine Datei zum Hochladen");
    }

    $filepath = $_FILES[$formFileName]['tmp_name'];
    $fileSize = filesize($filepath);
    $fileinfo = finfo_open(FILEINFO_MIME_TYPE);
    $filetype = finfo_file($fileinfo, $filepath);

    if ($fileSize === 0) {
        throw new Exception("Die Datei ist leer");
    }

    if ($fileSize > $maxMb * 1024 * 1024) {
        throw new Exception("Die Datei ist zu groß");
    }

    $allowedTypes = [
        'image/png' => 'png',
        'image/jpeg' => 'jpg'
    ];

    if (!in_array($filetype, array_keys($allowedTypes))) {
        throw new Exception("Dateiformat nicht erlaubt");
    }

    $extension = $allowedTypes[$filetype];
    $targetDirectory = dirname(__DIR__, 2) . "/uploads" . "/" . $uploadsSubDir;

    $newFilepath = $targetDirectory . "/" . $newFileName . "." . $extension;

    if (!move_uploaded_file($filepath, $newFilepath)) {
        throw new Exception("Die Datei konnte nicht hochgeladen werden");
    }

    return $uploadsSubDir . "/" . $newFileName . "." . $extension;
}
