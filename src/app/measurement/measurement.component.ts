import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MeasurementService } from '../services/measurement.service';

@Component({
  selector: 'app-measurement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-wrapper">
      <div class="glass-panel calc-card">
        <h2>Quantity Calculator</h2>
        <p class="subtitle">Select an operation and two quantities</p>

        <form [formGroup]="calcForm" (ngSubmit)="onSubmit()">
          
          <div class="flex-row">
            <div class="input-group" style="flex: 1;">
              <label>Measurement Type</label>
              <select formControlName="measurementType">
                <option *ngFor="let type of measurementTypes" [value]="type">{{ type }}</option>
              </select>
            </div>

            <div class="input-group" style="flex: 1;">
              <label>Mode of Operation</label>
              <select formControlName="operation">
                <option *ngFor="let op of operations" [value]="op">{{ op }}</option>
              </select>
            </div>
          </div>

          <div class="flex-row">
            <!-- Quantity 1 -->
            <div class="quantity-box glass-panel-inner">
              <h3>Quantity A</h3>
              <div class="input-group">
                <input type="number" formControlName="q1Value" step="any" placeholder="0">
              </div>
              <div class="input-group">
                <select formControlName="q1Unit">
                  <option *ngFor="let u of availableUnits" [value]="u">{{ u }}</option>
                </select>
              </div>
            </div>

            <!-- Quantity 2 -->
            <div class="quantity-box glass-panel-inner">
              <h3>Quantity B</h3>
              <div class="input-group">
                <input type="number" formControlName="q2Value" step="any" placeholder="0">
              </div>
              <div class="input-group">
                <select formControlName="q2Unit">
                  <option *ngFor="let u of availableUnits" [value]="u">{{ u }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="input-group target-unit-box" *ngIf="calcForm.get('operation')?.value === 'ADD' || calcForm.get('operation')?.value === 'SUBTRACT'">
            <label>Target Unit (Result Unit)</label>
            <select formControlName="targetUnit">
              <option *ngFor="let u of availableUnits" [value]="u">{{ u }}</option>
            </select>
          </div>

          <button type="submit" [disabled]="calcForm.invalid" class="calc-btn">Calculate</button>
        </form>

        <!-- Result Card -->
        <div class="result-box glass-panel-inner" *ngIf="result !== null">
          <h3>Result</h3>
          <p class="result-text">{{ result }}</p>
        </div>
        
        <div class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
    .calc-card {
      width: 600px;
      padding: 30px;
    }
    h2 { margin-top: 0; color: var(--primary-accent); text-align: center; }
    .subtitle { color: var(--text-muted); text-align: center; margin-bottom: 25px; }
    
    .flex-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .quantity-box {
      flex: 1;
      padding: 15px;
      border-radius: 12px;
      background: rgba(0,0,0,0.15);
      border: 1px solid var(--glass-border);
    }
    
    .quantity-box h3 {
      font-size: 1rem;
      margin-top: 0;
      color: var(--text-light);
      text-align: center;
    }

    .input-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-size: 0.85rem; color: var(--text-muted); }
    
    input, select {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(0,0,0,0.2);
      color: var(--text-light);
      font-family: var(--font-family);
      font-size: 1rem;
    }
    
    input:focus, select:focus { outline: none; border-color: var(--primary-accent); }
    
    select option { background: var(--bg-color-main); color: white; }

    .target-unit-box {
      background: rgba(0,0,0,0.15);
      padding: 15px;
      border-radius: 12px;
      border: 1px dashed var(--glass-border);
    }

    .calc-btn {
      width: 100%;
      padding: 14px;
      border-radius: 8px;
      border: none;
      background: linear-gradient(135deg, var(--primary-accent), #00D4FF);
      color: white;
      font-weight: 800;
      font-size: 1.1rem;
      margin-top: 10px;
      transition: opacity 0.3s ease;
    }
    .calc-btn:hover { opacity: 0.8; }
    
    .result-box {
      margin-top: 25px;
      padding: 20px;
      text-align: center;
      background: rgba(108, 92, 231, 0.2);
      border: 1px solid var(--primary-accent);
      border-radius: 12px;
      animation: fadeIn 0.4s ease;
    }
    .result-box h3 { margin: 0 0 10px 0; color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; }
    .result-text { margin: 0; font-size: 2rem; font-weight: 800; color: #00D4FF; }
    
    .error-msg { margin-top: 15px; color: #ff6b6b; text-align: center; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class MeasurementComponent implements OnInit {
  operations = ['COMPARE', 'CONVERT', 'ADD', 'SUBTRACT', 'DIVIDE'];
  measurementTypes = ['LENGTH', 'VOLUME', 'WEIGHT', 'TEMPERATURE'];
  
  unitMapping: { [key: string]: string[] } = {
    'LENGTH': ['INCHES', 'FEET', 'YARDS', 'CENTIMETERS'],
    'VOLUME': ['GALLON', 'LITRE', 'MILLILITRE'],
    'WEIGHT': ['MILLIGRAM', 'GRAM', 'KILOGRAM', 'POUND', 'TONNE'],
    'TEMPERATURE': ['FAHRENHEIT', 'CELSIUS', 'KELVIN']
  };

  private fb = inject(FormBuilder);
  private ms = inject(MeasurementService);
  private cdr = inject(ChangeDetectorRef);

  calcForm = this.fb.group({
    measurementType: ['LENGTH', Validators.required],
    operation: ['COMPARE', Validators.required],
    q1Value: [0, Validators.required],
    q1Unit: ['INCHES', Validators.required],
    q2Value: [0, Validators.required],
    q2Unit: ['INCHES', Validators.required],
    targetUnit: ['INCHES'] 
  });

  result: any = null;
  errorMessage = '';

  get availableUnits(): string[] {
    const type = this.calcForm.get('measurementType')?.value || 'LENGTH';
    return this.unitMapping[type] || [];
  }

  ngOnInit() {
    this.calcForm.get('measurementType')?.valueChanges.subscribe(type => {
      if (type) {
        const units = this.unitMapping[type];
        if (units && units.length > 0) {
          // Reset the selected units whenever the dimension type changes
          this.calcForm.patchValue({
            q1Unit: units[0],
            q2Unit: units[0],
            targetUnit: units[0]
          });
        }
      }
    });
  }

  onSubmit() {
    if (this.calcForm.invalid) return;

    this.errorMessage = '';
    this.result = null;

    const f = this.calcForm.value;
    const mType = f.measurementType || 'LENGTH';
    
    const payload = {
      q1: { value: f.q1Value, unit: f.q1Unit, measurementType: mType },
      q2: { value: f.q2Value, unit: f.q2Unit, measurementType: mType },
      targetUnit: (f.operation === 'ADD' || f.operation === 'SUBTRACT') 
          ? { value: 0, unit: f.targetUnit, measurementType: mType }
          : null
    };

    const handleSuccess = (res: any) => {
      console.log('API Response:', res);
      const data = res.data !== undefined ? res.data : res;

      if (typeof data === 'boolean') {
        this.result = data ? 'Equal / True' : 'Not Equal / False';
      } else if (typeof data === 'number') {
        this.result = Number.isInteger(data) ? data.toString() : data.toFixed(2);
      } else if (data && data.value !== undefined && data.unit) {
        this.result = `${Number.isInteger(data.value) ? data.value : data.value.toFixed(2)} ${data.unit}`;
      } else {
        this.result = JSON.stringify(data);
      }
      this.cdr.detectChanges(); 
    };

    const handleError = (err: any) => {
      this.errorMessage = 'An error occurred during calculation. Please check your inputs and try again.';
      console.error(err);
      this.cdr.detectChanges(); 
    };

    switch (f.operation) {
      case 'COMPARE':
        this.ms.compare(payload).subscribe({ next: handleSuccess, error: handleError });
        break;
      case 'CONVERT':
        this.ms.convert(payload).subscribe({ next: handleSuccess, error: handleError });
        break;
      case 'ADD':
        this.ms.add(payload).subscribe({ next: handleSuccess, error: handleError });
        break;
      case 'SUBTRACT':
        this.ms.subtract(payload).subscribe({ next: handleSuccess, error: handleError });
        break;
      case 'DIVIDE':
        this.ms.divide(payload).subscribe({ next: handleSuccess, error: handleError });
        break;
    }
  }
}
