<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}
$user_id = $_POST['user_id'] ?? null;
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
if (!$user_id || !$name || !$email) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}
try {
    $stmt = $pdo->prepare('UPDATE users SET Name = ?, Email = ? WHERE User_ID = ?');
    $stmt->execute([$name, $email, $user_id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 