<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';
try {
    $stmt = $pdo->query('SELECT id, type, description, created_at FROM activities ORDER BY created_at DESC, id DESC LIMIT 10');
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $activities]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 