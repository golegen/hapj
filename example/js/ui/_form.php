<?php
var_dump($_SERVER);
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header('HTTP/1.1 404 Not Found');
    exit(1);
}
echo json_encode(array(
    'data' => $_POST,
), JSON_UNESCAPED_UNICODE);