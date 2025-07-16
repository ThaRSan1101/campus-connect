// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();
    // Email domain validation
    if (!/@seu\.ac\.lk$/i.test(email)) {
      alert('Only @seu.ac.lk email addresses are allowed.');
      return;
    }
    if (!password) {
      alert('Password is required.');
      return;
    }
    const data = { email, password };
    try {
      const response = await fetch('/campus-connect/backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert('Login failed. Server did not return valid data.\n' + text);
        return;
      }
      console.log('Login response:', result);
      if (response.ok && result.success) {
        // Store user info in localStorage
        localStorage.setItem('User_ID', result.User_ID);
        localStorage.setItem('userName', result.name);
        localStorage.setItem('userRole', result.role);
        localStorage.setItem('userEmail', result.email);
        alert('Login successful! Redirecting to dashboard...');
        if (result.role.toLowerCase() === 'admin') {
          window.location.href = '/campus-connect/frontend/pages/admin/admin-dashboard.html';
        } else {
          window.location.href = '/campus-connect/frontend/pages/dashboard.html';
        }
      } else {
        alert('Invalid password or email');
      }
    } catch (error) {
      console.error('Network or fetch error:', error);
      alert('Login failed due to a network error. Please check your connection or contact support.');
    }
  });
}
// Password visibility toggle
const togglePasswordBtn = document.getElementById('togglePassword');
if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
} 