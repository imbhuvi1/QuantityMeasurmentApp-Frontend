// Check if user is admin
requireAuth();

const user = getUser();
if (user) {
    document.getElementById('adminName').textContent = user.name;
}

// Initialize admin dashboard
init();

function init() {
    loadStats();
    showUsers();
}

// Navigation functions
function showUsers() {
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('users-section').style.display = 'block';
    loadUsers();
}

function showStats() {
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    loadStats();
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Load admin statistics
async function loadStats() {
    try {
        const res = await fetch(`${API_BASE}/api/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        const json = await res.json();
        
        if (json.success) {
            document.getElementById('totalUsers').textContent = json.data.totalUsers;
            document.getElementById('regularUsers').textContent = json.data.regularUsers;
            document.getElementById('adminUsers').textContent = json.data.adminUsers;
        } else {
            showError('Failed to load statistics: ' + json.message);
        }
    } catch (err) {
        showError('Error loading statistics');
    }
}

// Load all users
async function loadUsers() {
    const container = document.getElementById('users-table-container');
    container.innerHTML = '<p>Loading users...</p>';
    
    try {
        const res = await fetch(`${API_BASE}/api/admin/users`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        const json = await res.json();
        
        if (!json.success) {
            if (res.status === 403) {
                showError('Access denied. You need admin privileges.');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
                return;
            }
            container.innerHTML = `<p style="color:#DC2626">${json.message}</p>`;
            return;
        }
        
        const users = json.data;
        if (!users.length) {
            container.innerHTML = '<p>No users found.</p>';
            return;
        }
        
        let html = `<table>
            <thead><tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Provider</th><th>Phone</th><th>Action</th>
            </tr></thead><tbody>`;
        
        users.forEach(user => {
            html += `<tr>
                <td>${user.id}</td>
                <td>${user.name || '-'}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${user.role.toLowerCase()}">${user.role}</span></td>
                <td>${user.provider}</td>
                <td>${user.phone || '-'}</td>
                <td>
                    ${user.role !== 'ADMIN' ? 
                        `<button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id}, '${user.name}')">Delete</button>` : 
                        '<span style="color:#8B95A5">Protected</span>'
                    }
                </td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
        // Refresh stats after loading users
        loadStats();
        
    } catch (err) {
        container.innerHTML = '<p style="color:#DC2626">Failed to load users</p>';
    }
}

// Delete user function
async function deleteUser(userId, userName) {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) {
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        const json = await res.json();
        
        if (json.success) {
            showSuccess(`User "${userName}" deleted successfully`);
            loadUsers(); // Refresh the user list
        } else {
            showError('Error deleting user: ' + json.message);
        }
    } catch (err) {
        showError('Failed to delete user');
    }
}

// Utility functions for messages
function showSuccess(message) {
    const successEl = document.getElementById('admin-success');
    const errorEl = document.getElementById('admin-error');
    
    errorEl.classList.add('hidden');
    successEl.textContent = message;
    successEl.classList.remove('hidden');
    
    setTimeout(() => {
        successEl.classList.add('hidden');
    }, 3000);
}

function showError(message) {
    const successEl = document.getElementById('admin-success');
    const errorEl = document.getElementById('admin-error');
    
    successEl.classList.add('hidden');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    
    setTimeout(() => {
        errorEl.classList.add('hidden');
    }, 5000);
}