<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';
try {
    $stmt = $pdo->query('SELECT User_ID, Name, Email, role, is_active, register_date FROM users ORDER BY register_date DESC, User_ID DESC');
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $users]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 