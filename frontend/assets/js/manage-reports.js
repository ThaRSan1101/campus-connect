// Handle Edit Status, Delete, and View Details actions for Manage Reports page

document.addEventListener('DOMContentLoaded', async function () {
    const reportTable = document.querySelector('.table');
    const tbody = reportTable ? reportTable.querySelector('tbody') : null;
    if (tbody) {
        // Fetch reports from backend
        try {
            const response = await fetch('/campus-connect/backend/get_reports.php');
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                tbody.innerHTML = '';
                result.data.forEach(report => {
                    const imgHtml = report.image
                      ? `<a href="/campus-connect/${report.image}" target="_blank"><img src="/campus-connect/${report.image}" alt="Report Image" style="width:48px;height:48px;object-fit:cover;border-radius:6px;display:block;margin:auto;"></a>`
                      : '';
                    const badgeClass = report.Status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark';
                    const row = document.createElement('tr');
                    row.setAttribute('data-report-id', report.ID);
                    row.setAttribute('data-status', report.Status);
                    row.innerHTML = `
                        <td>${report.ID}</td>
                        <td>${report.Location}</td>
                        <td>${report.description}</td>
                        <td>${report.type}</td>
                        <td style="vertical-align:middle;">${imgHtml}</td>
                        <td>${report.issue_address_date || ''}</td>
                        <td>${report.submitted_date}</td>
                        <td>${report.phone || ''}</td>
                        <td><span class="badge ${badgeClass}">${report.Status}</span></td>
                        <td style="white-space:nowrap;vertical-align:middle;">
                            <button class="btn btn-sm btn-outline-warning me-1" title="Edit Status"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-outline-danger me-1" title="Delete"><i class="fas fa-trash"></i></button>
                            <button class="btn btn-sm btn-outline-primary" title="View Details"><i class="fas fa-eye"></i></button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">No reports found.</td></tr>';
            }
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center text-danger">Failed to load reports.</td></tr>';
        }
    }
    if (!reportTable) return;

    reportTable.addEventListener('click', function (e) {
        const editBtn = e.target.closest('.btn-outline-warning');
        const deleteBtn = e.target.closest('.btn-outline-danger');
        const viewBtn = e.target.closest('.btn-outline-primary');
        const row = e.target.closest('tr');
        if (!row) return;

        // Edit Status
        if (editBtn) {
            handleEditStatus(row);
        }
        // Delete
        else if (deleteBtn) {
            handleDelete(row);
        }
        // View Details
        else if (viewBtn) {
            handleViewDetails(row);
        }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'http://localhost/campus-connect/frontend/pages/login.html';
        });
    }
});

function handleEditStatus(row) {
    const statusCell = row.querySelector('td:nth-last-child(2) .badge');
    let currentStatus = row.getAttribute('data-status');
    let newStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
    if (!confirm(`Change status to ${newStatus}?`)) return;
    const reportId = row.getAttribute('data-report-id');
    // API call to update status
    fetch('/campus-connect/backend/set_report_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `report_id=${encodeURIComponent(reportId)}&status=${encodeURIComponent(newStatus)}`
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            statusCell.textContent = newStatus;
            statusCell.className = 'badge ' + (newStatus === 'Resolved' ? 'bg-success' : 'bg-warning text-dark');
            row.setAttribute('data-status', newStatus);
        } else {
            alert(result.message || 'Failed to update status.');
        }
    })
    .catch(() => alert('Failed to update status.'));
}

function handleDelete(row) {
    const reportId = row.getAttribute('data-report-id');
    if (confirm('Are you sure you want to delete this report?')) {
        fetch('/campus-connect/backend/delete_report.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `report_id=${encodeURIComponent(reportId)}`
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                row.remove();
            } else {
                alert(result.message || 'Failed to delete report.');
            }
        })
        .catch(() => alert('Failed to delete report.'));
    }
}

function handleViewDetails(row) {
    // Get all cell values
    const cells = row.children;
    document.getElementById('modalLocation').textContent = cells[1].textContent;
    document.getElementById('modalDetails').textContent = cells[2].textContent;
    document.getElementById('modalType').textContent = cells[3].textContent;
    document.getElementById('modalReportImage').src = cells[4].querySelector('img').src;
    document.getElementById('modalAddressDate').textContent = cells[5].textContent;
    document.getElementById('modalSubmittedDate').textContent = cells[6].textContent;
    document.getElementById('modalPhone').textContent = cells[7].textContent;
    document.getElementById('modalStatus').textContent = cells[8].textContent;
    // Show modal
    var modalEl = document.getElementById('reportDetailsModal');
    if (modalEl) {
        var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
} 