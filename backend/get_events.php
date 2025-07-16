<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';
try {
    $stmt = $pdo->query('SELECT ID, title, date, location, Status FROM events ORDER BY date DESC, ID DESC');
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $events]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 