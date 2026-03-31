requireAuth();

// Block browser back navigation
history.pushState(null, '', location.href);
window.addEventListener('popstate', () => history.pushState(null, '', location.href));

const user = getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('welcome-msg').textContent = `Welcome, ${user.name.split(' ')[0]}!`;
}

const MEASUREMENT_TYPES = {
    'length': 'LENGTH',
    'weight': 'WEIGHT',
    'volume': 'VOLUME',
    'temperature': 'TEMPERATURE'
};

function switchTab(tabName) {
    document.querySelectorAll('.sidebar-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    const sidebarBtn = document.querySelector(`.sidebar-item[onclick="switchTab('${tabName}')"]`);
    if (sidebarBtn) sidebarBtn.classList.add('active');
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    if (tabName === 'profile') loadProfile();
    if (tabName === 'history') loadHistory();
}

async function doConversion(type) {
    const value = parseFloat(document.getElementById(`${type}-value`).value);
    const fromUnit = document.getElementById(`${type}-from`).value;
    const toUnit = document.getElementById(`${type}-to`).value;
    
    if (!value || isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    const measurementType = MEASUREMENT_TYPES[type];
    
    const q1 = { value, unit: fromUnit, measurementType };
    const q2 = { value: 0, unit: toUnit, measurementType };
    
    try {
        const res = await convert(q1, q2);
        const json = await res.json();
        
        if (json.success) {
            const resultBox = document.getElementById(`result-${type}`);
            const resultValue = document.getElementById(`result-${type}-value`);
            const resultExp = document.getElementById(`result-${type}-exp`);
            
            resultValue.textContent = `${json.data.value} ${json.data.unit}`;
            resultExp.textContent = `${value} ${fromUnit} = ${json.data.value} ${json.data.unit}`;
            resultBox.classList.remove('hidden');
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) {
        alert('Conversion failed. Please try again.');
    }
}

// History
async function loadHistory() {
    const container = document.getElementById('history-table-container');
    container.innerHTML = '<p>Loading...</p>';
    
    try {
        const res = await getHistory();
        const json = await res.json();
        
        if (!json.success) {
            container.innerHTML = `<p style="color:#DC2626">${json.message}</p>`;
            return;
        }
        
        const data = json.data;
        if (!data.length) {
            container.innerHTML = '<p>No history found.</p>';
            return;
        }
        
        let html = `<table>
            <thead><tr>
                <th>#</th><th>Operation</th><th>Input</th><th>Output</th><th>Result</th><th>Action</th>
            </tr></thead><tbody>`;
        
        data.forEach((item, i) => {
            html += `<tr>
                <td>${i + 1}</td>
                <td>${item.operation}</td>
                <td>${item.thisValue} ${item.thisUnit}</td>
                <td>${item.thatValue != null ? item.thatValue + ' ' + item.thatUnit : '-'}</td>
                <td>${item.resultValue != null ? item.resultValue + ' ' + item.resultUnit : item.resultString || '-'}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteSingle(${item.id})">Delete</button></td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = '<p style="color:#DC2626">Failed to load history</p>';
    }
}

async function deleteSingle(id) {
    if (!confirm('Delete this record?')) return;
    
    try {
        const res = await deleteById(id);
        const json = await res.json();
        if (json.success) loadHistory();
        else alert('Error: ' + json.message);
    } catch (err) {
        alert('Delete failed');
    }
}

async function deleteAllHistory() {
    if (!confirm('Delete ALL history? This cannot be undone.')) return;
    
    try {
        const res = await deleteAll();
        const json = await res.json();
        if (json.success) loadHistory();
        else alert('Error: ' + json.message);
    } catch (err) {
        alert('Delete failed');
    }
}

// Profile
async function loadProfile() {
    try {
        const res = await getProfile();
        const json = await res.json();
        
        if (!json.success) return;
        
        const d = json.data;
        document.getElementById('profile-name').value = d.name || '';
        document.getElementById('profile-email').value = d.email || '';
        document.getElementById('profile-phone').value = d.phone || '';
        document.getElementById('profile-bio').value = d.bio || '';
        document.getElementById('profile-provider').value = d.provider || '';
        document.getElementById('profile-avatar').textContent = d.name ? d.name.charAt(0).toUpperCase() : '?';
    } catch (err) {
        console.error('Failed to load profile');
    }
}

async function saveProfile() {
    const successEl = document.getElementById('profile-success');
    const errorEl = document.getElementById('profile-error');
    successEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    
    try {
        const res = await updateProfile({
            name: document.getElementById('profile-name').value,
            phone: document.getElementById('profile-phone').value,
            bio: document.getElementById('profile-bio').value
        });
        
        const json = await res.json();
        
        if (!json.success) {
            errorEl.textContent = json.message;
            errorEl.classList.remove('hidden');
            return;
        }
        
        successEl.textContent = 'Profile updated successfully!';
        successEl.classList.remove('hidden');
        
        const newName = document.getElementById('profile-name').value;
        document.getElementById('profile-avatar').textContent = newName.charAt(0).toUpperCase();
        document.getElementById('userName').textContent = newName;
        
        const u = getUser();
        if (u) localStorage.setItem('user', JSON.stringify({ ...u, name: newName }));
    } catch (err) {
        errorEl.textContent = 'Failed to update profile';
        errorEl.classList.remove('hidden');
    }
}
