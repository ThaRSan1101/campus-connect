// Registration form handler
const form = document.getElementById('registerForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/@seu\.ac\.lk$/i.test(email)) {
      alert('Only @seu.ac.lk email addresses are allowed.');
      form.email.focus();
      return;
    }
    const password = form.password.value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!document.getElementById('agreeTerms').checked) {
      alert('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    const data = {
      name: form.name.value.trim(),
      email: email,
      password: password
    };
    try {
      const response = await fetch('/campus-connect/backend/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert('Registration failed. Server did not return valid data.\n' + text);
        return;
      }
      console.log('Registration response:', result);
      if (response.ok && result.success) {
        alert('Registration successful! Redirecting to login...');
        window.location.href = '/campus-connect/frontend/pages/login.html';
      } else {
        alert('Registration failed: ' + (result.message || 'Unknown error.'));
      }
    } catch (error) {
      console.error('Network or fetch error:', error);
      alert('Registration failed due to a network error. Please check your connection or contact support.');
    }
  });
}

// Toggle password visibility
function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const icon = button.querySelector('i');
    
    button.addEventListener('click', function() {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    togglePasswordVisibility('password', 'togglePassword');
    togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');

    // Email validation
    document.getElementById('email').addEventListener('blur', function() {
        const email = this.value;
        if (email && !email.includes('@seu.ac.lk')) {
            this.classList.add('is-invalid');
            this.nextElementSibling.innerHTML = 
                '<i class="fas fa-exclamation-triangle me-1"></i>Only @seu.ac.lk email addresses are allowed';
        } else {
            this.classList.remove('is-invalid');
            this.nextElementSibling.innerHTML = 
                '<i class="fas fa-info-circle me-1"></i>Only @seu.ac.lk email addresses are allowed';
        }
    });

    // Password confirmation validation
    document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.classList.add('is-invalid');
            this.nextElementSibling.innerHTML = 
                '<i class="fas fa-exclamation-triangle me-1"></i>Passwords do not match';
        } else {
            this.classList.remove('is-invalid');
            this.nextElementSibling.innerHTML = '';
        }
    });

    // Password strength validation
    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (password.length < 6) {
            this.classList.add('is-invalid');
            this.nextElementSibling.innerHTML = 
                '<i class="fas fa-exclamation-triangle me-1"></i>Password must be at least 6 characters';
        } else {
            this.classList.remove('is-invalid');
            this.nextElementSibling.innerHTML = 
                '<i class="fas fa-shield-alt me-1"></i>Password must be at least 6 characters long';
        }
        
        // Re-validate confirm password
        if (confirmPassword.value && password !== confirmPassword.value) {
            confirmPassword.classList.add('is-invalid');
            confirmPassword.nextElementSibling.innerHTML = 
                '<i class="fas fa-exclamation-triangle me-1"></i>Passwords do not match';
        } else if (confirmPassword.value) {
            confirmPassword.classList.remove('is-invalid');
            confirmPassword.nextElementSibling.innerHTML = '';
        }
    });
}); 