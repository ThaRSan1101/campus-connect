document.addEventListener('DOMContentLoaded', () => {
    // Set admin name and email in navigation
    const adminName = localStorage.getItem('userName');
    const adminEmail = localStorage.getItem('userEmail');
    if (adminName) {
        document.querySelectorAll('.admin-name').forEach(el => el.textContent = adminName);
    }
    if (adminEmail) {
        document.querySelectorAll('.admin-email').forEach(el => el.textContent = adminEmail);
    }
    // Optionally, redirect if not admin
    const role = localStorage.getItem('userRole');
    if (!role || (role.toLowerCase() !== 'admin')) {
        window.location.href = 'admin-login.html';
    }
    // Load recent reports and activities
    loadRecentReports();
    loadRecentActivities();

    // Logout button listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'http://localhost/campus-connect/frontend/pages/login.html';
        });
    }
});

// Load admin data
function loadAdminData() {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
        const admin = JSON.parse(adminData);
        document.querySelectorAll('.admin-name').forEach(element => {
            element.textContent = admin.name;
        });
    } else {
        // Redirect to admin login if not logged in
        window.location.href = 'admin-login.html';
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    // TODO: Fetch real data from backend and update stats
    document.getElementById('totalUsers').textContent = '';
    document.getElementById('totalReports').textContent = '';
    document.getElementById('pendingReports').textContent = '';
    document.getElementById('totalEvents').textContent = '';
    document.getElementById('activeSessions').textContent = '';
}

async function loadRecentReports() {
    const container = document.getElementById('recentReportsContainer');
    try {
        const response = await fetch('/campus-connect/backend/get_recent_reports.php');
        const result = await response.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            // Only show the latest report
            const report = result.data[0];
            const imgHtml = report.image ? `<a href="/campus-connect/${report.image}" target="_blank"><img src="/campus-connect/${report.image}" alt="Report Image" style="width:48px;height:48px;object-fit:cover;border-radius:6px;display:block;margin:auto;"></a>` : '';
            container.innerHTML = `
                <div class="mb-2">
                    <strong>Location:</strong> ${report.Location}<br>
                    <strong>Type:</strong> ${report.type}<br>
                    <strong>Description:</strong> ${report.description}<br>
                    <strong>Submitted by:</strong> ${report.user_name}<br>
                    <strong>Date:</strong> ${report.submitted_date}<br>
                    ${imgHtml}
                </div>
            `;
        } else {
            container.innerHTML = '<p class="text-muted">No recent reports available.</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="text-danger">Error loading reports.</p>';
    }
}

async function loadRecentActivities() {
    const container = document.getElementById('activityContainer');
    try {
        const response = await fetch('/campus-connect/backend/get_activities.php');
        const result = await response.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            container.innerHTML = result.data.map(activity => `
                <div class="activity-item mb-2">
                    <div class="activity-content">
                        <strong>${activity.type === 'user' ? 'User Registration' : 'Report Submission'}</strong>:<br>
                        ${activity.description}<br>
                        <small class="text-muted">${activity.created_at}</small>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-muted">No recent activity.</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="text-danger">Error loading activity.</p>';
    }
}

// Get status badge class
function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
        case 'pending': return 'bg-warning';
        case 'in progress': return 'bg-primary';
        case 'resolved': return 'bg-success';
        case 'rejected': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
} 