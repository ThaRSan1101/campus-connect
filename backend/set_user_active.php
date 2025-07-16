<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}
$user_id = $_POST['user_id'] ?? null;
$is_active = isset($_POST['is_active']) ? (int)$_POST['is_active'] : null;
if (!$user_id || !isset($_POST['is_active'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}
try {
    $stmt = $pdo->prepare('UPDATE users SET is_active = ? WHERE User_ID = ?');
    $stmt->execute([$is_active, $user_id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 