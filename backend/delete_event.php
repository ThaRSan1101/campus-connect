<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}
require_once __DIR__ . '/db.php';
$event_id = $_POST['event_id'] ?? null;
if (!$event_id) {
    echo json_encode(['success' => false, 'message' => 'Missing event_id.']);
    exit;
}
try {
    $stmt = $pdo->prepare('DELETE FROM events WHERE ID = ?');
    $stmt->execute([$event_id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 