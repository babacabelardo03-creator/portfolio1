<?php
/* ==========================================================
   contact.php - receives the portfolio contact form (POST)
   and emails it to you. Returns JSON to script.js.
   ========================================================== */
header('Content-Type: application/json; charset=utf-8');

// >>> CHANGE THIS to the email address that should receive messages <<<
$to = 'your.email@example.com';

function respond(bool $ok, string $message, int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.', 405);
}

// Honeypot: real visitors never see or fill this field
if (!empty($_POST['website'])) {
    respond(true, 'Message sent.');
}

// Read and clean input
$name    = trim(strip_tags($_POST['name'] ?? ''));
$email   = trim($_POST['email'] ?? '');
$message = trim(strip_tags($_POST['message'] ?? ''));

// Validate
if ($name === '' || $message === '') {
    respond(false, 'Please fill in your name and message.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', 422);
}
if (mb_strlen($name) > 100 || mb_strlen($message) > 3000) {
    respond(false, 'Your name or message is too long.', 422);
}

// Block header injection in the name field
$name = str_replace(["\r", "\n"], ' ', $name);

// Build the email
$subject = 'Portfolio message from ' . $name;
$body    = "Name: $name\nEmail: $email\n\nMessage:\n$message\n";
$headers = "From: Portfolio <no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'localhost') . ">\r\n"
         . "Reply-To: $email\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    respond(true, 'Thank you! Your message has been sent.');
}

respond(false, 'The server could not send the email. Check your mail settings.', 500);