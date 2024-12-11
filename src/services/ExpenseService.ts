import Parse from 'parse';
import { Expense } from '../types';

export class ExpenseService {
  static async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const ExpenseObject = Parse.Object.extend('Expense');
    const expenseObj = new ExpenseObject();

    expenseObj.set('amount', expense.amount);
    expenseObj.set('category', expense.category);
    expenseObj.set('description', expense.description);
    expenseObj.set('date', expense.date);
    const userPointer = Parse.User.createWithoutData(expense.userId);
    expenseObj.set('userId', userPointer);

    const savedExpense = await expenseObj.save();
    
    return {
        id: savedExpense.id,
        amount: savedExpense.get('amount'),
        category: savedExpense.get('category'),
        description: savedExpense.get('description'),
        date: savedExpense.get('date'),
        userId: savedExpense.get('userId').id
      };
  }

  static async getExpenses(userId: string): Promise<Expense[]> {
    const query = new Parse.Query('Expense');
    const userPointer = Parse.User.createWithoutData(userId);
    query.equalTo('userId', userPointer);
    query.descending('date');
    
    const results = await query.find();
    return results.map(expense => ({
      id: expense.id,
      amount: expense.get('amount'),
      category: expense.get('category'),
      description: expense.get('description'),
      date: expense.get('date'),
      userId: expense.get('userId').id
    }));
  }
  static async deleteExpense(id: string): Promise<void> {
    const query = new Parse.Query('Expense');
    const expense = await query.get(id);
    await expense.destroy();
  }
}