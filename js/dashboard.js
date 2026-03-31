const UNITS = {
    LENGTH: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
    WEIGHT: ['MILLIGRAM', 'GRAM', 'KILOGRAM', 'POUND', 'TONNE'],
    VOLUME: ['LITRE', 'MILLILITRE', 'GALLON'],
    TEMPERATURE: ['CELSIUS', 'FAHRENHEIT', 'KELVIN']
};

const TABS = ['compare', 'convert', 'add', 'subtract', 'divide'];

requireAuth();

const user = getUser();
if (user) document.getElementById('userName').textContent = `👤 ${user.name}`;

function populateSelect(selectId, measurementType) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '';
    UNITS[measurementType].forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        select.appendChild(option);
    });
}

function syncUnits(tab) {
    const type = document.getElementById(`${tab}-type`).value;
    populateSelect(`${tab}-unit1`, type);
    if (document.getElementById(`${tab}-unit2`)) populateSelect(`${tab}-unit2`, type);
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
    ['compare','convert','add','subtract','divide'].forEach(t => hideResult(t));
}

function showResult(tab, message, isError = false) {
    const box = document.getElementById(`result-${tab}`);
    box.textContent = message;
    box.classList.remove('hidden', 'error');
    if (isError) box.classList.add('error');
}

function hideResult(tab) {
    const box = document.getElementById(`result-${tab}`);
    if (box) box.classList.add('hidden');
}

function buildQ(val, unitId, tab) {
    const type = document.getElementById(`${tab}-type`).value;
    return { value: parseFloat(val), unit: document.getElementById(unitId).value, measurementType: type };
}

async function handleResponse(tab, res, formatter) {
    const json = await res.json();
    if (!json.success) return showResult(tab, `Error: ${json.message}`, true);
    showResult(tab, formatter(json.data));
}

// Compare
async function doCompare() {
    const q1 = buildQ(document.getElementById('compare-val1').value, 'compare-unit1', 'compare');
    const q2 = buildQ(document.getElementById('compare-val2').value, 'compare-unit2', 'compare');
    const res = await compare(q1, q2);
    await handleResponse('compare', res, data => `${data === true ? 'Equal' : 'Not Equal'}`);
}

// Convert
async function doConvert() {
    const type = document.getElementById('convert-type').value;
    const q1 = buildQ(document.getElementById('convert-val1').value, 'convert-unit1', 'convert');
    const q2 = { value: 0, unit: document.getElementById('convert-unit2').value, measurementType: type };
    const res = await convert(q1, q2);
    await handleResponse('convert', res, data => `${data.value} ${data.unit}`);
}

// Add
async function doAdd() {
    const q1 = buildQ(document.getElementById('add-val1').value, 'add-unit1', 'add');
    const q2 = buildQ(document.getElementById('add-val2').value, 'add-unit2', 'add');
    const res = await add(q1, q2);
    await handleResponse('add', res, data => `${data.value} ${data.unit}`);
}

// Subtract
async function doSubtract() {
    const q1 = buildQ(document.getElementById('subtract-val1').value, 'subtract-unit1', 'subtract');
    const q2 = buildQ(document.getElementById('subtract-val2').value, 'subtract-unit2', 'subtract');
    const res = await subtract(q1, q2);
    await handleResponse('subtract', res, data => `${data.value} ${data.unit}`);
}

// Divide
async function doDivide() {
    const q1 = buildQ(document.getElementById('divide-val1').value, 'divide-unit1', 'divide');
    const q2 = buildQ(document.getElementById('divide-val2').value, 'divide-unit2', 'divide');
    const res = await divide(q1, q2);
    await handleResponse('divide', res, data => `${data}`);
}

// History
async function loadHistory() {
    const container = document.getElementById('history-table-container');
    container.innerHTML = '<p>Loading...</p>';
    const res = await getHistory();
    const json = await res.json();
    if (!json.success) { container.innerHTML = `<p style="color:red">${json.message}</p>`; return; }
    const data = json.data;
    if (!data.length) { container.innerHTML = '<p>No history found.</p>'; return; }
    let html = `<table>
        <thead><tr>
            <th>#</th><th>Operation</th><th>Input 1</th><th>Input 2</th><th>Result</th><th>Status</th><th>Action</th>
        </tr></thead><tbody>`;
    data.forEach((item, i) => {
        html += `<tr>
            <td>${i + 1}</td>
            <td>${item.operation}</td>
            <td>${item.thisValue} ${item.thisUnit}</td>
            <td>${item.thatValue != null ? item.thatValue + ' ' + item.thatUnit : '-'}</td>
            <td>${item.resultValue != null ? item.resultValue + ' ' + item.resultUnit : item.resultString || '-'}</td>
            <td>${item.error ? 'Error' : 'Success'}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteSingle(${item.id})">🗑</button></td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function deleteSingle(id) {
    if (!confirm('Delete this record?')) return;
    const res = await deleteById(id);
    const json = await res.json();
    if (!json.success) return alert('Error: ' + json.message);
    loadHistory();
}

async function deleteAllHistory() {
    if (!confirm('Delete ALL history? This cannot be undone.')) return;
    const res = await deleteAll();
    const json = await res.json();
    if (!json.success) return alert('Error: ' + json.message);
    loadHistory();
}

// Init all dropdowns on load
TABS.forEach(tab => syncUnits(tab));
