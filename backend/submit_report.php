<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

require_once __DIR__ . '/db.php';

// Get user ID from session or (for now) from POST (should be from session in production)
$user_id = $_POST['user_id'] ?? null;
$location = trim($_POST['location'] ?? '');
$description = trim($_POST['description'] ?? '');
$type = trim($_POST['issueType'] ?? '');
$timeObserved = $_POST['timeObserved'] ?? null;
$phone = trim($_POST['contactInfo'] ?? '');
$submitted_date = date('Y-m-d');

if (!$user_id || !$location || !$description || !$type) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

// Handle image upload
$image_path = null;
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = __DIR__ . '/../uploads/reports/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $filename = uniqid('report_', true) . '.' . $ext;
    $target = $upload_dir . $filename;
    if (move_uploaded_file($_FILES['photo']['tmp_name'], $target)) {
        $image_path = 'uploads/reports/' . $filename;
    }
}

try {
    $stmt = $pdo->prepare('INSERT INTO reports (User_ID, Location, description, type, image, issue_address_date, submitted_date, phone, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "Pending")');
    $stmt->execute([$user_id, $location, $description, $type, $image_path, $timeObserved, $submitted_date, $phone]);
    // Log activity
    $desc = "New report submitted by User ID $user_id at $location";
    $pdo->prepare('INSERT INTO activities (type, description) VALUES ("report", ?)')->execute([$desc]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 