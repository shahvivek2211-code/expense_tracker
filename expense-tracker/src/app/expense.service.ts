import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from './expense.model';
import { Observable, tap, of } from 'rxjs';

const categoryKeywords: Record<string, string[]> = {
  'Food': ['food', 'meal', 'lunch', 'dinner', 'breakfast', 'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'snack', 'grocery', 'supermarket'],
  'Transport': ['uber', 'lyft', 'taxi', 'bus', 'metro', 'train', 'fuel', 'gas', 'petrol', 'parking', 'toll', 'car', 'bike', 'auto'],
  'Shopping': ['amazon', 'flipkart', 'shop', 'store', 'mall', 'clothing', 'shoes', 'dress', 'electronics', 'gift'],
  'Entertainment': ['movie', 'netflix', 'spotify', 'game', 'concert', 'theatre', 'park', 'entertainment', 'subscription'],
  'Bills': ['electricity', 'water', 'internet', 'phone', 'bill', 'rent', 'utility', 'wifi', 'mobile', ' recharge'],
  'Health': ['doctor', 'medicine', 'hospital', 'pharmacy', 'health', 'gym', 'fitness', 'medical', 'dental'],
  'Salary': ['salary', 'income', 'bonus', 'payment received', 'freelance', 'invoice']
};

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private http = inject(HttpClient);
  private jsonUrl = 'assets/expenses.json';

  private categorize(text: string): string {
    const lower = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => lower.includes(kw))) {
        return category;
      }
    }
    return 'Other';
  }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.jsonUrl);
  }

  saveExpenses(expenses: Expense[]): void {
    const json = JSON.stringify(expenses, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  addExpense(name: string, amount: number, description: string, paymentMode: string, currentExpenses: Expense[]): Expense {
    const text = `${name} ${description}`;
    const category = this.categorize(text);
    
    const expense: Expense = {
      id: crypto.randomUUID(),
      name,
      amount,
      description,
      paymentMode,
      category,
      timestamp: new Date().toISOString()
    };

    return expense;
  }

  deleteExpense(id: string, currentExpenses: Expense[]): Expense[] {
    return currentExpenses.filter(e => e.id !== id);
  }
}