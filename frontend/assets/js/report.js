// Report form handler
const reportForm = document.getElementById('reportForm');
if (reportForm) {
  reportForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    if (!location || !description) {
      alert('Please fill in all required fields.');
      return;
    }
    const formData = new FormData(reportForm);
    // Add user_id from localStorage
    const userId = localStorage.getItem('User_ID');
    if (userId) {
      formData.append('user_id', userId);
    }
    if (location === 'Other') {
      const customLocation = document.getElementById('customLocation').value.trim();
      if (!customLocation) {
        alert('Please specify the custom location.');
        return;
      }
      formData.set('location', customLocation);
    }
    try {
      const response = await fetch('/campus-connect/backend/submit_report.php', {
        method: 'POST',
        body: formData
      });
      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert('Submission failed. Server did not return valid data.\n' + text);
        return;
      }
      console.log('Report submission response:', result);
      if (response.ok && result.success) {
        alert('Report submitted successfully!');
        // Stay on the report page, do not redirect
        reportForm.reset();
        // Optionally, clear image preview
        if (previewImg && imagePreview) {
          previewImg.src = '';
          imagePreview.classList.add('d-none');
        }
      } else {
        alert('Submission failed: ' + (result.message || 'Unknown error.'));
      }
    } catch (error) {
      console.error('Network or fetch error:', error);
      alert('Submission failed due to a network error. Please check your connection or contact support.');
    }
  });
}

// Image preview logic
const photoInput = document.getElementById('photo');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('preview');
if (photoInput && imagePreview && previewImg) {
  photoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
        imagePreview.classList.remove('d-none');
      };
      reader.readAsDataURL(file);
    } else {
      previewImg.src = '';
      imagePreview.classList.add('d-none');
    }
  });
}
// Remove image logic
const removeImageBtn = imagePreview ? imagePreview.querySelector('button') : null;
if (removeImageBtn && photoInput && previewImg && imagePreview) {
  removeImageBtn.addEventListener('click', function () {
    photoInput.value = '';
    previewImg.src = '';
    imagePreview.classList.add('d-none');
  });
}

document.addEventListener('DOMContentLoaded', function() {
    // Set user name in navigation and welcome
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.querySelectorAll('.user-name').forEach(el => el.textContent = userName);
    }
    // Set up profile popup
    const trigger = document.getElementById('userProfileTrigger');
    const popup = document.getElementById('userProfilePopup');
    const popupUserName = document.getElementById('popupUserName');
    const popupUserEmail = document.getElementById('popupUserEmail');
    if (trigger && popup) {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            popupUserName.textContent = localStorage.getItem('userName') || 'User Name';
            popupUserEmail.textContent = localStorage.getItem('userEmail') || 'user@email.com';
            const rect = trigger.getBoundingClientRect();
            popup.style.display = 'block';
            popup.style.position = 'absolute';
            popup.style.top = (window.scrollY + rect.bottom + 8) + 'px';
            popup.style.left = (rect.left) + 'px';
            popup.style.zIndex = 3000;
        });
        document.addEventListener('click', function(e) {
            if (!popup.contains(e.target) && e.target !== trigger) {
                popup.style.display = 'none';
            }
        });
    }
    // Logout button logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.clear();
            window.location.href = '/campus-connect/frontend/pages/login.html';
        });
    }
}); 