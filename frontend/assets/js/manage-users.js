// Handle Edit, Delete, and Disable actions for Manage Users page

document.addEventListener('DOMContentLoaded', async function () {
    // Delegate click events for action buttons
    const userTable = document.querySelector('.table');
    const tbody = userTable ? userTable.querySelector('tbody') : null;
    if (tbody) {
        // Fetch users from backend
        try {
            const response = await fetch('/campus-connect/backend/get_users.php');
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                tbody.innerHTML = '';
                result.data.forEach(user => {
                    const badgeClass = user.role.toLowerCase() === 'admin' ? 'bg-warning text-dark' : 'bg-primary';
                    const row = document.createElement('tr');
                    row.setAttribute('data-user-id', user.User_ID);
                    row.setAttribute('data-user-active', user.is_active ? 'true' : 'false');
                    row.innerHTML = `
                        <td>${user.User_ID}</td>
                        <td>${user.Name}</td>
                        <td>${user.Email}</td>
                        <td>${user.register_date}</td>
                        <td><span class="badge ${badgeClass}">${user.role}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-warning me-1" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-outline-info me-1" title="Disable" data-user-active="${user.is_active ? 'true' : 'false'}"><i class="fas fa-user-slash"></i></button>
                            <button class="btn btn-sm btn-outline-danger" title="Delete"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No users found.</td></tr>';
            }
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Failed to load users.</td></tr>';
        }
    }
    if (!userTable) return;

    userTable.addEventListener('click', function (e) {
        const editBtn = e.target.closest('.btn-outline-warning');
        const deleteBtn = e.target.closest('.btn-outline-danger');
        const disableBtn = e.target.closest('.btn-outline-info');
        const row = e.target.closest('tr');
        if (!row) return;

        // Edit
        if (editBtn) {
            handleEdit(row);
        }
        // Delete
        else if (deleteBtn) {
            handleDelete(row);
        }
        // Disable
        else if (disableBtn) {
            handleDisable(row);
        }
    });

    var profileBtn = document.getElementById('adminProfileBtn');
    var logoutPopup = document.getElementById('adminLogoutPopup');
    var logoutBtn = document.getElementById('adminLogoutBtn');
    function hidePopup(e) {
        if (logoutPopup.style.display === 'block' && (!logoutPopup.contains(e.target) && e.target !== profileBtn)) {
            logoutPopup.style.display = 'none';
        }
    }
    if (profileBtn && logoutPopup) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var rect = profileBtn.getBoundingClientRect();
            logoutPopup.style.top = (window.scrollY + rect.bottom + 8) + 'px';
            logoutPopup.style.right = (window.innerWidth - rect.right) + 'px';
            logoutPopup.style.display = (logoutPopup.style.display === 'block') ? 'none' : 'block';
        });
        document.addEventListener('click', hidePopup);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'http://localhost/campus-connect/frontend/pages/login.html';
        });
    }
});

function handleEdit(row) {
    // Get current values
    const nameCell = row.children[1];
    const emailCell = row.children[2];
    const currentName = nameCell.textContent.trim();
    const currentEmail = emailCell.textContent.trim();
    const userId = row.getAttribute('data-user-id');

    // Create modal
    let modal = document.getElementById('editUserModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editUserModal';
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editUserForm">
                        <div class="mb-3">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-control" id="editUserName" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="editUserEmail" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>`;
        document.body.appendChild(modal);
    }
    // Set current values
    modal.querySelector('#editUserName').value = currentName;
    modal.querySelector('#editUserEmail').value = currentEmail;

    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Handle form submit
    const form = modal.querySelector('#editUserForm');
    form.onsubmit = async function (e) {
        e.preventDefault();
        const newName = modal.querySelector('#editUserName').value.trim();
        const newEmail = modal.querySelector('#editUserEmail').value.trim();
        if (!userId) return;
        // Make API call to update user in backend
        try {
            const response = await fetch('/campus-connect/backend/update_user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `user_id=${encodeURIComponent(userId)}&name=${encodeURIComponent(newName)}&email=${encodeURIComponent(newEmail)}`
            });
            const result = await response.json();
            if (result.success) {
                nameCell.textContent = newName;
                emailCell.textContent = newEmail;
                bsModal.hide();
            } else {
                alert(result.message || 'Failed to update user.');
            }
        } catch (err) {
            alert('Failed to update user.');
        }
    };
}

function handleDelete(row) {
    const userId = row.getAttribute('data-user-id');
    if (!userId) return;
    if (confirm('Are you sure you want to delete this user?')) {
        // Make API call to delete user in backend
        fetch('/campus-connect/backend/delete_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `user_id=${encodeURIComponent(userId)}`
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                row.remove();
            } else {
                alert(result.message || 'Failed to delete user.');
            }
        })
        .catch(() => alert('Failed to delete user.'));
    }
}

function handleDisable(row) {
    const disableBtn = row.querySelector('.btn-outline-info');
    const userId = row.getAttribute('data-user-id');
    let isActive = row.getAttribute('data-user-active') === 'true';
    if (!userId) return;
    if (isActive) {
        if (!confirm('Disable this user? They will not be able to log in.')) return;
        // Make API call to backend to disable user
        fetch('/campus-connect/backend/set_user_active.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `user_id=${encodeURIComponent(userId)}&is_active=0`
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                row.classList.add('table-secondary');
                row.setAttribute('data-user-active', 'false');
                disableBtn.setAttribute('data-user-active', 'false');
                disableBtn.title = 'Enable';
                const icon = disableBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-user-slash');
                    icon.classList.add('fa-user-check');
                }
            } else {
                alert(result.message || 'Failed to disable user.');
            }
        })
        .catch(() => alert('Failed to disable user.'));
    } else {
        if (!confirm('Enable this user? They will be able to log in again.')) return;
        // Make API call to backend to enable user
        fetch('/campus-connect/backend/set_user_active.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `user_id=${encodeURIComponent(userId)}&is_active=1`
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                row.classList.remove('table-secondary');
                row.setAttribute('data-user-active', 'true');
                disableBtn.setAttribute('data-user-active', 'true');
                disableBtn.title = 'Disable';
                const icon = disableBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-user-check');
                    icon.classList.add('fa-user-slash');
                }
            } else {
                alert(result.message || 'Failed to enable user.');
            }
        })
        .catch(() => alert('Failed to enable user.'));
    }
} 