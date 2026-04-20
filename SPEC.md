# Expense Tracker - Angular Application Specification

## 1. Project Overview
- **Project Name**: expense-tracker
- **Type**: Single Page Web Application (Angular)
- **Core Functionality**: Allow users to log expenses with name, amount, description, and payment mode; display expenses in a list; filter by date
- **Target Users**: Individuals tracking personal expenses

## 2. UI/UX Specification

### Layout Structure
- **Header**: App title "Expense Tracker" with centered alignment
- **Main Content**:
  - Left/Top: Expense form (add new expense)
  - Right/Bottom: Expense list with date filter
- **Responsive**: Single column on mobile (<768px), two columns on desktop

### Visual Design
- **Color Palette**:
  - Primary: #2563eb (blue)
  - Secondary: #1e293b (slate dark)
  - Accent: #10b981 (emerald green for success)
  - Background: #f8fafc (light gray)
  - Card Background: #ffffff
  - Text Primary: #1e293b
  - Text Secondary: #64748b
  - Border: #e2e8f0
- **Typography**:
  - Font Family: 'Inter', system-ui, sans-serif
  - Headings: 24px bold
  - Body: 14px regular
- **Spacing**: 16px base unit
- **Visual Effects**:
  - Card shadow: 0 1px 3px rgba(0,0,0,0.1)
  - Border radius: 8px
  - Hover transitions: 0.2s ease

### Components
1. **Expense Form**:
   - Input: Name (text, required)
   - Input: Amount (number, required, min 0)
   - Input: Description (textarea, optional)
   - Select: Payment Mode (Cash, Credit Card, Debit Card, UPI, Bank Transfer)
   - Button: "Add Expense" (primary style)

2. **Date Filter**:
   - Input: Date picker (filter by specific date)
   - Button: Clear filter

3. **Expense List**:
   - Table or card list showing: Name, Amount, Description, Payment Mode, Date/Time
   - Each expense shows timestamp when added
   - Delete button per expense

## 3. Functionality Specification

### Core Features
1. **Add Expense**: User fills form, clicks add, expense saved to JSON with auto-generated timestamp
2. **View Expenses**: All expenses displayed in list, sorted by date (newest first)
3. **Filter by Date**: Date picker filters expenses to show only those from selected date
4. **Delete Expense**: Remove expense from list and JSON file

### Data Model
```typescript
interface Expense {
  id: string;
  name: string;
  amount: number;
  description: string;
  paymentMode: string;
  timestamp: string; // ISO date string
}
```

### Data Storage
- Store expenses in `src/assets/expenses.json`
- Use Angular HttpClient to read/write JSON file

### Edge Cases
- Empty list: Show "No expenses recorded" message
- Invalid form: Show validation errors
- JSON file missing: Create with empty array

## 4. Acceptance Criteria
- [ ] Form validates required fields (name, amount)
- [ ] Expense added with current timestamp
- [ ] Expenses persist in JSON file and reload on page refresh
- [ ] Date filter shows only expenses from selected date
- [ ] Clear filter shows all expenses
- [ ] Delete removes expense from list and JSON
- [ ] Responsive layout works on mobile and desktop
