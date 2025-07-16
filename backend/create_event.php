<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

require_once __DIR__ . '/db.php';

$title = trim($_POST['title'] ?? '');
$date = trim($_POST['date'] ?? '');
$location = trim($_POST['location'] ?? '');
$status = trim($_POST['status'] ?? '');

if (!$title || !$date || !$location || !$status) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

try {
    $stmt = $pdo->prepare('INSERT INTO events (title, date, location, Status) VALUES (?, ?, ?, ?)');
    $stmt->execute([$title, $date, $location, $status]);
    echo json_encode(['success' => true, 'message' => 'Event created successfully.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 