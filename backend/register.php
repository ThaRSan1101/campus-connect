<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

require_once __DIR__ . '/db.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

// Validate input
if (!$name || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !str_ends_with($email, '@seu.ac.lk')) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

// Check if email already exists
$stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE Email = ?');
$stmt->execute([$email]);
if ($stmt->fetchColumn() > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already registered.']);
    exit;
}

// Hash password
$hash = password_hash($password, PASSWORD_DEFAULT);

// Insert user
try {
    $stmt = $pdo->prepare('INSERT INTO users (Name, Email, Password, role, is_active, register_date) VALUES (?, ?, ?, "Student", 1, CURDATE())');
    $stmt->execute([$name, $email, $hash]);
    // Log activity
    $desc = "New user registered: $name ($email)";
    $pdo->prepare('INSERT INTO activities (type, description) VALUES ("user", ?)')->execute([$desc]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} 