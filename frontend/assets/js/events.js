// User Profile Popup and Logout Logic
function getUserInfo() {
    return {
        name: localStorage.getItem('userName') || 'User Name',
        email: localStorage.getItem('userEmail') || 'user@email.com'
    };
}

// Fetch and display events for students
async function loadStudentEvents() {
    try {
        const response = await fetch('/campus-connect/backend/get_events.php');
        const result = await response.json();
        const container = document.querySelector('.container.py-4');
        const noEventsBox = document.getElementById('noEventsBox');
        // Remove old event cards
        container.querySelectorAll('.event-card').forEach(card => card.remove());
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            if (noEventsBox) noEventsBox.style.display = 'none';
            result.data.forEach(event => {
                const card = document.createElement('div');
                card.className = 'row justify-content-center mt-4 event-card';
                card.innerHTML = `
                    <div class="col-md-6">
                        <div class="card shadow-sm event-card">
                            <div class="card-body">
                                <h5 class="card-title mb-2">
                                    <i class="fas fa-calendar-alt me-2 text-primary"></i>
                                    ${event.title}
                                </h5>
                                <p class="mb-1 text-muted">
                                    <i class="fas fa-clock me-1"></i>
                                    ${event.date}
                                </p>
                                <p class="mb-2 text-muted">
                                    <i class="fas fa-map-marker-alt me-1"></i>
                                    ${event.location}
                                </p>
                                <p class="mb-2 text-muted">
                                    <span class="badge ${event.Status === 'Active' ? 'bg-success' : 'bg-secondary'}">${event.Status}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        } else {
            if (noEventsBox) noEventsBox.style.display = 'block';
        }
    } catch (error) {
        const noEventsBox = document.getElementById('noEventsBox');
        if (noEventsBox) noEventsBox.style.display = 'block';
    }
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
    const logoutBtn = document.getElementById('logoutBtn');
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
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            window.location.href = 'http://localhost/campus-connect/frontend/pages/login.html';
        });
    }
    loadStudentEvents();
}); 