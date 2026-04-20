import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private expenseService = inject(ExpenseService);
  private storageKey = 'expense_tracker_data';

  expenses = signal<Expense[]>([]);
  filterDate = signal<string>('');

  name = signal('');
  amount = signal(0);
  description = signal('');
  paymentMode = signal('Cash');

  saveMessage = signal('');

  paymentModes = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

  filteredExpenses = computed(() => {
    const date = this.filterDate();
    if (!date) return this.expenses();
    return this.expenses().filter(e => {
      const expDate = new Date(e.timestamp).toISOString().split('T')[0];
      return expDate === date;
    });
  });

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      this.expenses.set(JSON.parse(stored));
    }
  }

  addExpense() {
    if (!this.name() || this.amount() <= 0) return;

    const text = `${this.name()} ${this.description()}`;
    const category = this.categorize(text);

    const expense: Expense = {
      id: crypto.randomUUID(),
      name: this.name(),
      amount: this.amount(),
      description: this.description(),
      paymentMode: this.paymentMode(),
      category: category,
      timestamp: new Date().toISOString()
    };

    const updated = [expense, ...this.expenses()];
    this.expenses.set(updated);
    this.saveToStorage(updated);
    this.showMessage('Expense added!');
    this.resetForm();
  }

  deleteExpense(id: string) {
    const updated = this.expenses().filter(e => e.id !== id);
    this.expenses.set(updated);
    this.saveToStorage(updated);
    this.showMessage('Expense deleted!');
  }

  exportJson() {
    const json = JSON.stringify(this.expenses(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.json';
    a.click();
    URL.revokeObjectURL(url);
    this.showMessage('Exported to expenses.json');
  }

  importJson(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (Array.isArray(data)) {
          this.expenses.set(data);
          this.saveToStorage(data);
          this.showMessage('Imported successfully!');
        }
      } catch {
        this.showMessage('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  clearFilter() {
    this.filterDate.set('');
  }

  private saveToStorage(expenses: Expense[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(expenses));
  }

  private showMessage(msg: string) {
    this.saveMessage.set(msg);
    setTimeout(() => this.saveMessage.set(''), 3000);
  }

  private resetForm() {
    this.name.set('');
    this.amount.set(0);
    this.description.set('');
    this.paymentMode.set('Cash');
  }

  private categorize(text: string): string {
    const lower = text.toLowerCase();
    const keywords: Record<string, string[]> = {
      'Food': ['food', 'meal', 'lunch', 'dinner', 'breakfast', 'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'snack', 'grocery', 'supermarket'],
      'Transport': ['uber', 'lyft', 'taxi', 'bus', 'metro', 'train', 'fuel', 'gas', 'petrol', 'parking', 'toll', 'car', 'bike', 'auto'],
      'Shopping': ['amazon', 'flipkart', 'shop', 'store', 'mall', 'clothing', 'shoes', 'dress', 'electronics', 'gift'],
      'Entertainment': ['movie', 'netflix', 'spotify', 'game', 'concert', 'theatre', 'park', 'entertainment', 'subscription'],
      'Bills': ['electricity', 'water', 'internet', 'phone', 'bill', 'rent', 'utility', 'wifi', 'mobile', ' recharge'],
      'Health': ['doctor', 'medicine', 'hospital', 'pharmacy', 'health', 'gym', 'fitness', 'medical', 'dental'],
      'Salary': ['salary', 'income', 'bonus', 'payment received', 'freelance', 'invoice']
    };
    for (const [category, kws] of Object.entries(keywords)) {
      if (kws.some(kw => lower.includes(kw))) {
        return category;
      }
    }
    return 'Other';
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }
}