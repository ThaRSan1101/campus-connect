<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}
$user_id = $_POST['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Missing user_id.']);
    exit;
}
try {
    $stmt = $pdo->prepare('DELETE FROM users WHERE User_ID = ?');
    $stmt->execute([$user_id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 