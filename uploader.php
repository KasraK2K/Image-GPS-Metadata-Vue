<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  header('Location: /');
  exit;
};

/* -------------------------------- Variables ------------------------------- */
$target_directory = "uploads/" . date('Y-m-d') . "/";
$file_name = $_FILES["image"]["name"];
$target_file = basename($file_name) ? $target_directory . basename($file_name) : null;
$file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
$max_file_size = 20000000;
$mime_type = ["jpg", "jpeg", "gif", "png", "bmp"];
$response = (object) array();
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   ERRORS                                   */
/* -------------------------------------------------------------------------- */
if (!$file_name) {
  $response->code = 400;
  $response->message = 'Uploaded file not found.';
  $response->url = 0;
  echo json_encode($response);
  return;
}; // file not inputted

if (file_exists($target_file)) {
  $response->code = 409;
  $response->message = 'This file already exists.';
  $response->url = 0;
  echo json_encode($response);
  return;
}; // file already exists

if ($_FILES["image"]["size"] > $max_file_size) {
  $response->code = 400;
  $response->message = 'Uploaded file is too large.';
  $response->url = 0;
  echo json_encode($response);
  return;
}; // file was too large

if (!file_exists($target_directory)) {
  mkdir($target_directory, 0777, true);
}; // create folder if not exist
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                           Upload image to server                           */
/* -------------------------------------------------------------------------- */
if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
  $response->code = 200;
  $response->message = 'Image uploaded correctly.';
  $response->url = '/' . $target_file;
  echo json_encode($response);
  return;
};
/* -------------------------------------------------------------------------- */
