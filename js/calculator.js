// Anonymous calculator - no authentication required
// History is NOT saved for anonymous users

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
    
    // Update operation pills
    document.querySelectorAll('.operation-pill').forEach(pill => pill.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update title
    document.getElementById('operation-title').textContent = OPERATION_TITLES[operation];
    
    // Switch operation content
    document.querySelectorAll('.operation-content').forEach(op => op.classList.remove('active'));
    document.getElementById(`operation-${operation}`).classList.add('active');
    
    // Hide all results
    hideAllResults();
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

// Operations - Anonymous (no history saving)
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
        // Call API without authentication (anonymous)
        const res = await fetch(`${API_BASE}/api/quantity/compare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity1: q1, quantity2: q2 })
        });
        
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
        alert('Operation failed. Make sure backend is running.');
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
        const res = await fetch(`${API_BASE}/api/quantity/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity1: q1, quantity2: q2 })
        });
        
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
        const res = await fetch(`${API_BASE}/api/quantity/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity1: q1, quantity2: q2 })
        });
        
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
        const res = await fetch(`${API_BASE}/api/quantity/subtract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity1: q1, quantity2: q2 })
        });
        
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
        const res = await fetch(`${API_BASE}/api/quantity/divide`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity1: q1, quantity2: q2 })
        });
        
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

// Initialize on load
init();