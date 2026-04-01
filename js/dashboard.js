requireAuth();

// Block browser back navigation
history.pushState(null, '', location.href);
window.addEventListener('popstate', () => history.pushState(null, '', location.href));

const user = getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('welcome-msg').textContent = `Welcome, ${user.name}!`;
    
    // Add role-based navigation
    addRoleBasedNavigation(user.role);
}

function startCalculations() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('calculation-interface').classList.remove('hidden');
    const user = getUser();
    if (user) {
        document.getElementById('welcome-msg-small').textContent = `Welcome, ${user.name}!`;
    }
}

const UNITS = {
    LENGTH: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
    WEIGHT: ['MILLIGRAM', 'GRAM', 'KILOGRAM', 'POUND', 'TONNE'],
    VOLUME: ['LITRE', 'MILLILITRE', 'GALLON'],
    TEMPERATURE: ['CELSIUS', 'FAHRENHEIT', 'KELVIN']
};

let currentOperation = 'compare';
let currentMeasurementType = 'LENGTH';

const OPERATION_TITLES = {
    'compare': 'Compare Two Quantities',
    'convert': 'Convert a Quantity',
    'add': 'Add Two Quantities',
    'subtract': 'Subtract Two Quantities',
    'divide': 'Divide Two Quantities'
};

// Initialize
function init() {
    populateAllUnits();
}

function switchOperation(operation) {
    currentOperation = operation;
    
    // Show calculation interface if hidden
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('calculation-interface').classList.remove('hidden');
    const user = getUser();
    if (user) {
        document.getElementById('welcome-msg-small').textContent = `Welcome, ${user.name}!`;
    }
    
    // Update sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update title
    document.getElementById('operation-title').textContent = OPERATION_TITLES[operation];
    
    // Show calculation section, hide others
    document.getElementById('calculation-section').classList.remove('hidden');
    document.getElementById('tab-history').classList.add('hidden');
    document.getElementById('tab-profile').classList.add('hidden');
    
    // Switch operation content
    document.querySelectorAll('.operation-content').forEach(op => op.classList.remove('active'));
    document.getElementById(`operation-${operation}`).classList.add('active');
    
    // Hide all results
    hideAllResults();
}

function switchTab(tabName) {
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('calculation-section').classList.add('hidden');
    document.getElementById('tab-history').classList.add('hidden');
    document.getElementById('tab-profile').classList.add('hidden');
    
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    
    if (tabName === 'profile') loadProfile();
    if (tabName === 'history') loadHistory();
}

function selectMeasurementType(type) {
    currentMeasurementType = type;
    
    // Update pills
    document.querySelectorAll('.type-pill').forEach(pill => pill.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update units for current operation
    populateUnitsForOperation(currentOperation);
    
    // Hide results
    hideAllResults();
}

function populateAllUnits() {
    ['compare', 'convert', 'add', 'subtract', 'divide'].forEach(op => {
        populateUnitsForOperation(op);
    });
}

function populateUnitsForOperation(operation) {
    const units = UNITS[currentMeasurementType];
    
    if (operation === 'convert') {
        populateSelect('convert-from', units);
        populateSelect('convert-to', units);
    } else if (operation === 'compare') {
        populateSelect('compare-unit1', units);
        populateSelect('compare-unit2', units);
    } else if (operation === 'add') {
        populateSelect('add-unit1', units);
        populateSelect('add-unit2', units);
    } else if (operation === 'subtract') {
        populateSelect('subtract-unit1', units);
        populateSelect('subtract-unit2', units);
    } else if (operation === 'divide') {
        populateSelect('divide-unit1', units);
        populateSelect('divide-unit2', units);
    }
}

function populateSelect(id, units) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = '';
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        select.appendChild(option);
    });
}

function hideAllResults() {
    ['compare', 'convert', 'add', 'subtract', 'divide'].forEach(op => {
        const resultBox = document.getElementById(`result-${op}`);
        if (resultBox) resultBox.classList.add('hidden');
    });
}

// Operations
async function doCompare() {
    const val1 = parseFloat(document.getElementById('compare-val1').value);
    const val2 = parseFloat(document.getElementById('compare-val2').value);
    const unit1 = document.getElementById('compare-unit1').value;
    const unit2 = document.getElementById('compare-unit2').value;
    
    if (!val1 || !val2 || isNaN(val1) || isNaN(val2)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const q1 = { value: val1, unit: unit1, measurementType: currentMeasurementType };
    const q2 = { value: val2, unit: unit2, measurementType: currentMeasurementType };
    
    try {
        const res = await compare(q1, q2);
        const json = await res.json();
        
        if (json.success) {
            const resultBox = document.getElementById('result-compare');
            const resultValue = document.getElementById('result-compare-value');
            resultValue.textContent = json.data === true ? 'Equal ✓' : 'Not Equal ✗';
            resultBox.classList.remove('hidden');
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) {
        alert('Operation failed');
    }
}

async function doConvert() {
    const val = parseFloat(document.getElementById('convert-val').value);
    const fromUnit = document.getElementById('convert-from').value;
    const toUnit = document.getElementById('convert-to').value;
    
    if (!val || isNaN(val)) {
        alert('Please enter a valid number');
        return;
    }
    
    const q1 = { value: val, unit: fromUnit, measurementType: currentMeasurementType };
    const q2 = { value: 0, unit: toUnit, measurementType: currentMeasurementType };
    
    try {
        const res = await convert(q1, q2);
        const json = await res.json();
        
        if (json.success) {
            const resultBox = document.getElementById('result-convert');
            const resultValue = document.getElementById('result-convert-value');
            const resultExp = document.getElementById('result-convert-exp');
            
            resultValue.textContent = `${json.data.value} ${json.data.unit}`;
            resultExp.textContent = `${val} ${fromUnit} = ${json.data.value} ${json.data.unit}`;
            resultBox.classList.remove('hidden');
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) {
        alert('Conversion failed');
    }
}

async function doAdd() {
    const val1 = parseFloat(document.getElementById('add-val1').value);
    const val2 = parseFloat(document.getElementById('add-val2').value);
    const unit1 = document.getElementById('add-unit1').value;
    const unit2 = document.getElementById('add-unit2').value;
    
    if (!val1 || !val2 || isNaN(val1) || isNaN(val2)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const q1 = { value: val1, unit: unit1, measurementType: currentMeasurementType };
    const q2 = { value: val2, unit: unit2, measurementType: currentMeasurementType };
    
    try {
        const res = await add(q1, q2);
        const json = await res.json();
        
        if (json.success) {
            const resultBox = document.getElementById('result-add');
            const resultValue = document.getElementById('result-add-value');
            resultValue.textContent = `${json.data.value} ${json.data.unit}`;
            resultBox.classList.remove('hidden');
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) {
        alert('Operation failed');
    }
}

async function doSubtract() {
    const val1 = parseFloat(document.getElementById('subtract-val1').value);
    const val2 = parseFloat(document.getElementById('subtract-val2').value);
    const unit1 = document.getElementById('subtract-unit1').value;
    const unit2 = document.getElementById('subtract-unit2').value;
    
    if (!val1 || !val2 || isNaN(val1) || isNaN(val2)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const q1 = { value: val1, unit: unit1, measurementType: currentMeasurementType };
    const q2 = { value: val2, unit: unit2, measurementType: currentMeasurementType };
    
    try {
        const res = await subtract(q1, q2);
        const json = await res.json();
        
        if (json.success) {
            const resultBox = document.getElementById('result-subtract');
            const resultValue = document.getElementById('result-subtract-value');
            resultValue.textContent = `${json.data.value} ${json.data.unit}`;
            resultBox.classList.remove('hidden');
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) {
        alert('Operation failed');
    }
}

async function doDivide() {
    const val1 = parseFloat(document.getElementById('divide-val1').value);
    const val2 = parseFloat(document.getElementById('divide-val2').value);
    const unit1 = document.getElementById('divide-unit1').value;
    const unit2 = document.getElementById('divide-unit2').value;
    
    if (!val1 || !val2 || isNaN(val1) || isNaN(val2)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const q1 = { value: val1, unit: unit1, measurementType: currentMeasurementType };
    const q2 = { value: val2, unit: unit2, measurementType: currentMeasurementType };
    
    try {
        const res = await divide(q1, q2);
        const json = await res.json();
        
        if (json.success) {
            const resultBox = document.getElementById('result-divide');
            const resultValue = document.getElementById('result-divide-value');
            resultValue.textContent = json.data;
            resultBox.classList.remove('hidden');
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) {
        alert('Operation failed');
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

// Initialize on load
init();

// Add role-based navigation
function addRoleBasedNavigation(userRole) {
    if (userRole === 'ADMIN') {
        // Add admin panel button
        const sidebar = document.querySelector('.sidebar');
        const adminButton = document.createElement('button');
        adminButton.className = 'sidebar-item';
        adminButton.textContent = '👑 Admin Panel';
        adminButton.onclick = () => window.location.href = 'admin.html';
        
        // Add after divider
        const divider = document.querySelector('.sidebar-divider');
        divider.parentNode.insertBefore(adminButton, divider.nextSibling);
        
        // Add role badge to navbar
        const navRight = document.querySelector('.dashboard-nav-right');
        const roleBadge = document.createElement('span');
        roleBadge.className = 'role-badge admin';
        roleBadge.textContent = 'ADMIN';
        roleBadge.style.marginRight = '16px';
        navRight.insertBefore(roleBadge, navRight.firstChild);
    } else {
        // Add user badge
        const navRight = document.querySelector('.dashboard-nav-right');
        const roleBadge = document.createElement('span');
        roleBadge.className = 'role-badge user';
        roleBadge.textContent = 'USER';
        roleBadge.style.marginRight = '16px';
        navRight.insertBefore(roleBadge, navRight.firstChild);
    }
}

// Check if user has admin access (legacy function - keeping for compatibility)
async function checkAdminAccess() {
    const user = getUser();
    if (user && user.role === 'ADMIN') {
        addRoleBasedNavigation('ADMIN');
    }
}
