<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}
require_once __DIR__ . '/db.php';
$report_id = $_POST['report_id'] ?? null;
if (!$report_id) {
    echo json_encode(['success' => false, 'message' => 'Missing report_id.']);
    exit;
}
try {
    $stmt = $pdo->prepare('DELETE FROM reports WHERE ID = ?');
    $stmt->execute([$report_id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 