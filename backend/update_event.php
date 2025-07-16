<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}
require_once __DIR__ . '/db.php';
$event_id = $_POST['event_id'] ?? null;
$title = trim($_POST['title'] ?? '');
$date = trim($_POST['date'] ?? '');
$location = trim($_POST['location'] ?? '');
$status = trim($_POST['status'] ?? '');
if (!$event_id || !$title || !$date || !$location || !$status) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}
try {
    $stmt = $pdo->prepare('UPDATE events SET title = ?, date = ?, location = ?, Status = ? WHERE ID = ?');
    $stmt->execute([$title, $date, $location, $status, $event_id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 