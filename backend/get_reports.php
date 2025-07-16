<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query('SELECT r.ID, r.User_ID, u.Name as user_name, u.Email as user_email, r.Location, r.description, r.type, r.image, r.issue_address_date, r.submitted_date, r.Status, r.phone FROM reports r JOIN users u ON r.User_ID = u.User_ID ORDER BY r.submitted_date DESC, r.ID DESC');
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $reports]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 