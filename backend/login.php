<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

$stmt = $pdo->prepare('SELECT User_ID, Name, Email, Password, role, is_active FROM users WHERE Email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['Password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid password or email.']);
    exit;
}
if (!$user['is_active']) {
    echo json_encode(['success' => false, 'message' => 'Account is disabled.']);
    exit;
}

// Success
unset($user['Password']);
echo json_encode([
    'success' => true,
    'User_ID' => $user['User_ID'],
    'name' => $user['Name'],
    'role' => $user['role'],
    'email' => $user['Email'],
    'message' => 'Login successful.'
]);
// The frontend will handle redirecting to the correct dashboard based on the role. 