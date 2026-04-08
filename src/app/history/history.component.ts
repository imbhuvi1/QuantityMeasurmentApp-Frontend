import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementService } from '../services/measurement.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-wrapper">
      <div class="glass-panel history-card">
        <div class="header-action">
          <h2>Measurement History</h2>
          <button class="danger-btn" *ngIf="history.length > 0" (click)="clearAll()">Clear All</button>
        </div>

        <div class="empty-state" *ngIf="history.length === 0">
          <p>No measurement history found. Go calculate something!</p>
        </div>

        <div class="history-list" *ngIf="history.length > 0">
          <div class="history-item glass-panel-inner" *ngFor="let item of history">
            <div class="item-content">
              <!-- Using exact properties returned by QuantityMeasurementEntity -->
              <div class="op-badge">{{ item.operation }}</div>
              <div class="details">
                <span class="qty">{{ item.thisValue }} {{ item.thisUnit }}</span>
                <span class="op" *ngIf="item.thatValue != null"> ↔ </span>
                <span class="qty" *ngIf="item.thatValue != null">{{ item.thatValue }} {{ item.thatUnit }}</span>
                <span class="result-label">RESULT:</span>
                <span class="result-val">{{ item.resultString ? item.resultString : (item.resultValue + ' ' + (item.resultUnit ? item.resultUnit : '')) }}</span>
              </div>
            </div>
            <button class="delete-icon" (click)="deleteItem(item.id)">🗑</button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { display: flex; justify-content: center; padding-top: 20px; }
    .history-card { width: 800px; padding: 30px; }
    .header-action { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    h2 { margin: 0; color: var(--primary-accent); }
    
    .danger-btn {
      background: rgba(255, 107, 107, 0.2);
      border: 1px solid #ff6b6b;
      color: #ff6b6b;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .danger-btn:hover { background: #ff6b6b; color: white; }

    .empty-state { text-align: center; color: var(--text-muted); padding: 40px; background: rgba(0,0,0,0.15); border-radius: 12px; }

    .history-list { display: flex; flex-direction: column; gap: 15px; }
    
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: rgba(0,0,0,0.15);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      transition: transform 0.2s;
    }
    .history-item:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.3); }

    .item-content { display: flex; align-items: center; gap: 20px; }
    .op-badge {
      background: var(--primary-accent);
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
    }
    
    .details { display: flex; align-items: center; gap: 10px; color: var(--text-light); }
    .qty { font-weight: 600; font-family: monospace; }
    .op { color: var(--text-muted); }
    .result-label { font-size: 0.8rem; color: var(--text-muted); margin-left: 10px; }
    .result-val { font-weight: 800; color: #00D4FF; }

    .delete-icon {
      background: none; border: none; font-size: 1.2rem; cursor: pointer;
      opacity: 0.5; transition: opacity 0.2s; padding: 5px;
    }
    .delete-icon:hover { opacity: 1; color: #ff6b6b; }
  `]
})
export class HistoryComponent implements OnInit {
  private ms = inject(MeasurementService);
  private cdr = inject(ChangeDetectorRef);
  
  history: any[] = [];

  ngOnInit() {
    this.fetchHistory();
  }

  fetchHistory() {
    this.ms.getHistory().subscribe({
      next: (res: any) => {
        if(res && res.data) {
          this.history = res.data.reverse(); // Newest first
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error("Could not fetch history, are you logged in?", err)
    });
  }

  deleteItem(id: number) {
    if(!id) return;
    this.ms.deleteById(id).subscribe(() => this.fetchHistory());
  }

  clearAll() {
    this.ms.deleteAll().subscribe(() => this.history = []);
  }
}
