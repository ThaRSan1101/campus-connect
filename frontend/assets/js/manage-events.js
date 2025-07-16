let allEvents = [];
let filteredEvents = [];

// Load events when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

// Load events from API
async function loadEvents() {
    try {
        const response = await fetch('/campus-connect/backend/get_events.php');
        const result = await response.json();
        
        if (result.success) {
            allEvents = result.data;
            filteredEvents = [...allEvents];
            renderEventTable();
        } else {
            showNoEventsMessage();
        }
    } catch (error) {
        console.error('Failed to load events:', error);
        showNoEventsMessage();
    }
}

// Render events
function renderEvents() {
    const container = document.getElementById('eventsContainer');
    
    if (filteredEvents.length === 0) {
        showNoEventsMessage();
        return;
    }

    const html = filteredEvents.map(event => `
        <div class="col-lg-6 col-xl-4 mb-4">
            <div class="event-card">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 class="event-title">${event.title}</h5>
                        <div class="event-date">
                            <i class="fas fa-calendar me-1"></i>
                            ${formatDate(event.event_date)}
                            ${event.event_time ? ` at ${event.event_time}` : ''}
                        </div>
                    </div>
                    <span class="badge ${getStatusBadgeClass(event)}">${getStatusText(event)}</span>
                </div>
                
                <div class="event-location mb-3">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    ${event.location || 'Location TBD'}
                </div>
                
                <p class="event-description mb-3">${event.description}</p>
                
                <div class="d-flex justify-content-between align-items-center">
                    <div class="event-participants">
                        <small class="text-muted">
                            <i class="fas fa-users me-1"></i>
                            ${event.current_participants} / ${event.max_participants || '\u221e'} participants
                        </small>
                    </div>
                    <button class="btn ${event.is_signed_up ? 'btn-success' : 'btn-primary'} join-event-btn" 
                            data-event-id="${event.id}" 
                            ${event.is_signed_up || (event.max_participants && event.current_participants >= event.max_participants) ? 'disabled' : ''}>
                        ${event.is_signed_up ? 'Joined' : (event.max_participants && event.current_participants >= event.max_participants ? 'Full' : 'Join Event')}
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// Render events in admin table
function renderEventTable() {
    const eventTable = document.querySelector('.table');
    if (!eventTable) return;
    const tbody = eventTable.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!allEvents.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">No events found. If you just created an event, try refreshing the page.</td></tr>';
        return;
    }
    allEvents.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.ID}</td>
            <td>${event.title}</td>
            <td>${event.date}</td>
            <td>${event.location}</td>
            <td><span class="badge ${event.Status === 'Active' ? 'bg-success' : 'bg-secondary'}">${event.Status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-warning me-1"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Get status badge class
function getStatusBadgeClass(event) {
    if (event.is_signed_up) return 'bg-success';
    if (event.max_participants && event.current_participants >= event.max_participants) return 'bg-danger';
    return 'bg-primary';
}

// Get status text
function getStatusText(event) {
    if (event.is_signed_up) return 'Joined';
    if (event.max_participants && event.current_participants >= event.max_participants) return 'Full';
    return 'Available';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Toggle filters section
function toggleFilters() {
    const filtersSection = document.getElementById('filtersSection');
    filtersSection.style.display = filtersSection.style.display === 'none' ? 'block' : 'none';
}

// Apply filters
function applyFilters() {
    const dateFilter = document.getElementById('dateFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();

    filteredEvents = allEvents.filter(event => {
        // Date filter
        if (dateFilter) {
            const eventDate = new Date(event.event_date);
            const today = new Date();
            
            switch (dateFilter) {
                case 'today':
                    if (eventDate.toDateString() !== today.toDateString()) return false;
                    break;
                case 'week':
                    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                    if (eventDate < today || eventDate > weekFromNow) return false;
                    break;
                case 'month':
                    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                    if (eventDate < today || eventDate > monthFromNow) return false;
                    break;
            }
        }

        // Status filter
        if (statusFilter) {
            switch (statusFilter) {
                case 'available':
                    if (event.is_signed_up || (event.max_participants && event.current_participants >= event.max_participants)) return false;
                    break;
                case 'full':
                    if (!event.max_participants || event.current_participants < event.max_participants) return false;
                    break;
                case 'joined':
                    if (!event.is_signed_up) return false;
                    break;
            }
        }

        // Search filter
        if (searchFilter) {
            if (!event.title.toLowerCase().includes(searchFilter) && 
                !event.description.toLowerCase().includes(searchFilter) &&
                !event.location.toLowerCase().includes(searchFilter)) {
                return false;
            }
        }

        return true;
    });

    renderEvents();
}

// Clear filters
function clearFilters() {
    document.getElementById('dateFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('searchFilter').value = '';
    
    filteredEvents = [...allEvents];
    renderEvents();
}

// Refresh events
function refreshEvents() {
    loadEvents();
}

// Show no events message
function showNoEventsMessage() {
    document.getElementById('eventsContainer').style.display = 'none';
    document.getElementById('noEventsMessage').style.display = 'block';
}

// Hide no events message
function hideNoEventsMessage() {
    document.getElementById('eventsContainer').style.display = 'block';
    document.getElementById('noEventsMessage').style.display = 'none';
} 

document.addEventListener('DOMContentLoaded', function () {
    // Admin event table logic
    const eventTable = document.querySelector('.table');
    const editEventModal = document.getElementById('editEventModal');
    let editingRow = null;

    // Table actions
    if (eventTable) {
        eventTable.addEventListener('click', function (e) {
            const editBtn = e.target.closest('.btn-outline-warning');
            const deleteBtn = e.target.closest('.btn-outline-danger');
            const row = e.target.closest('tr');
            if (!row) return;
            // Edit
            if (editBtn) {
                editingRow = row;
                document.getElementById('editEventTitle').value = row.children[1].textContent;
                document.getElementById('editEventDate').value = row.children[2].textContent;
                document.getElementById('editEventLocation').value = row.children[3].textContent;
                // Get status from badge text
                const badge = row.children[4].querySelector('.badge');
                document.getElementById('editEventStatus').value = badge ? badge.textContent.trim() : row.children[4].textContent.trim();
                bootstrap.Modal.getOrCreateInstance(editEventModal).show();
            }
            // Delete
            else if (deleteBtn) {
                const eventId = row.children[0].textContent;
                if (confirm('Are you sure you want to delete this event?')) {
                    fetch('/campus-connect/backend/delete_event.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `event_id=${encodeURIComponent(eventId)}`
                    })
                    .then(res => res.json())
                    .then(result => {
                        if (result.success) {
                            row.remove();
                        } else {
                            alert(result.message || 'Failed to delete event.');
                        }
                    })
                    .catch(() => alert('Failed to delete event.'));
                }
            }
        });
    }
    // Edit Event Save
    const editEventForm = document.getElementById('editEventForm');
    if (editEventForm) {
        editEventForm.onsubmit = function (e) {
            e.preventDefault();
            if (!editingRow) return;
            const eventId = editingRow.children[0].textContent;
            const title = document.getElementById('editEventTitle').value.trim();
            const date = document.getElementById('editEventDate').value;
            const location = document.getElementById('editEventLocation').value.trim();
            const status = document.getElementById('editEventStatus').value;
            // API call to update event
            fetch('/campus-connect/backend/update_event.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `event_id=${encodeURIComponent(eventId)}&title=${encodeURIComponent(title)}&date=${encodeURIComponent(date)}&location=${encodeURIComponent(location)}&status=${encodeURIComponent(status)}`
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    editingRow.children[1].textContent = title;
                    editingRow.children[2].textContent = date;
                    editingRow.children[3].textContent = location;
                    editingRow.children[4].innerHTML = `<span class="badge ${status === 'Active' ? 'bg-success' : 'bg-secondary'}">${status}</span>`;
                    bootstrap.Modal.getOrCreateInstance(editEventModal).hide();
                } else {
                    alert(result.message || 'Failed to update event.');
                }
            })
            .catch(() => alert('Failed to update event.'));
        };
    }

    // Add Event Modal logic
    const addEventBtn = document.getElementById('addEventBtn');
    const addEventModal = document.getElementById('addEventModal');
    const addEventForm = document.getElementById('addEventForm');

    if (addEventBtn && addEventModal) {
        addEventBtn.addEventListener('click', function () {
            addEventForm.reset();
            bootstrap.Modal.getOrCreateInstance(addEventModal).show();
        });
    }

    if (addEventForm && eventTable) {
        addEventForm.onsubmit = async function (e) {
            e.preventDefault();
            const title = document.getElementById('addEventTitle').value.trim();
            const date = document.getElementById('addEventDate').value;
            const location = document.getElementById('addEventLocation').value.trim();
            const status = document.getElementById('addEventStatus').value;

            // Send to backend
            try {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('date', date);
                formData.append('location', location);
                formData.append('status', status);

                const response = await fetch('/campus-connect/backend/create_event.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    bootstrap.Modal.getOrCreateInstance(addEventModal).hide();
                    loadEvents(); // Reload events from backend
                } else {
                    alert(result.message || 'Failed to create event.');
                }
            } catch (error) {
                alert('Error creating event: ' + error);
            }
        };
    }

    // Admin logout logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'http://localhost/campus-connect/frontend/pages/login.html';
        });
    }
}); 