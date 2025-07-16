document.addEventListener('DOMContentLoaded', () => {
    // Set user name in navigation and welcome
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.querySelectorAll('.user-name').forEach(el => el.textContent = userName);
    }
    // Set up profile popup
    const popupUserName = document.getElementById('popupUserName');
    const popupUserEmail = document.getElementById('popupUserEmail');
    if (popupUserName) popupUserName.textContent = userName || 'User Name';
    if (popupUserEmail) popupUserEmail.textContent = localStorage.getItem('userEmail') || 'user@email.com';
    // Show/hide profile popup
    const trigger = document.getElementById('userProfileTrigger');
    const popup = document.getElementById('userProfilePopup');
    if (trigger && popup) {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const rect = trigger.getBoundingClientRect();
            popup.style.display = 'block';
            popup.style.position = 'absolute';
            popup.style.top = (window.scrollY + rect.bottom + 8) + 'px';
            popup.style.left = (rect.left) + 'px';
            popup.style.zIndex = 2000;
        });
        document.addEventListener('click', function(e) {
            if (!popup.contains(e.target) && e.target !== trigger) {
                popup.style.display = 'none';
            }
        });
    }

    // Update stats with placeholders or fetch real data if you want
    document.getElementById('reportsCount').textContent = '';
    document.getElementById('eventsJoined').textContent = '';
    document.getElementById('pendingReports').textContent = '';
    document.getElementById('notificationsCount').textContent = '';

    // Robust logout handler using event delegation
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logoutBtn') {
            localStorage.clear();
            // Hide the popup if visible
            const popup = document.getElementById('userProfilePopup');
            if (popup) popup.style.display = 'none';
            window.location.href = '/campus-connect/frontend/pages/login.html';
        }
        });
}); 