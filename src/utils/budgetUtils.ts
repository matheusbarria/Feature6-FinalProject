import { Expense, BudgetLimit } from '../types';

export const checkBudgetLimits = (
  expenses: Expense[],
  budgetLimits: BudgetLimit[]
): { category: string; current: number; limit: number; period: string }[] => {
  const warnings: { category: string; current: number; limit: number; period: string }[] = [];

  budgetLimits.forEach(limit => {
    const now = new Date();
    let startDate = new Date();

    // Set start date based on period
    switch (limit.period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    // Calculate total expenses for this category and period
    const periodExpenses = expenses.filter(expense => 
      expense.category === limit.category &&
      new Date(expense.date) >= startDate
    );

    const totalSpent = periodExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    if (totalSpent >= limit.amount) {
      warnings.push({
        category: limit.category,
        current: totalSpent,
        limit: limit.amount,
        period: limit.period
      });
    }
  });

  return warnings;
};