import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';
import { ExpenseService } from '../services/ExpenseService';
import { CategoryService } from '../services/CategoryService';
import { BudgetLimitService } from '../services/BudgetLimitService';
import { CategoryManager } from './CategoryManager';
import { BudgetLimitManager } from './BudgetLimitManager';
import { checkBudgetLimits } from '../utils/budgetUtils';
import { Expense, ExpenseCategory, BudgetLimit } from '../types';

export const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>([]);
  const [budgetWarnings, setBudgetWarnings] = useState<{
    category: string;
    current: number;
    limit: number;
    period: string;
  }[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useAppSelector((state) => state.auth);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getSortedExpenses = () => {
    return [...expenses].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'amount') {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      if (sortBy === 'category') {
        return sortOrder === 'desc' 
          ? b.category.localeCompare(a.category)
          : a.category.localeCompare(b.category);
      }
      return 0;
    });
  };
  const getExpenseStats = () => {
    if (expenses.length === 0) return null;
    
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const average = total / expenses.length;
    
    const categoryCount: Record<string, number> = {};
    expenses.forEach(exp => {
      categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
    });
    
    const mostUsedCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0][0];
      
    const highestExpense = Math.max(...expenses.map(exp => exp.amount));
    
    return { total, average, mostUsedCategory, highestExpense };
  };
  useEffect(() => {
    if (user) {
      loadExpenses();
      loadCategories();
      loadBudgetLimits();
    }
  }, [user]);

  useEffect(() => {
    // Check budget limits whenever expenses or limits change
    const warnings = checkBudgetLimits(expenses, budgetLimits);
    setBudgetWarnings(warnings);
  }, [expenses, budgetLimits]);

  const loadBudgetLimits = async () => {
    if (user) {
      const limits = await BudgetLimitService.getBudgetLimits(user.id);
      setBudgetLimits(limits);
    }
  };

  const loadCategories = async () => {
    const fetchedCategories = await CategoryService.getCategories();
    setCategories(fetchedCategories);
  };

  const loadExpenses = async () => {
    if (user) {
      let userExpenses = await ExpenseService.getExpenses(user.id);

      // Apply date filters if set
      if (startDate) {
        userExpenses = userExpenses.filter(
          (expense) => new Date(expense.date) >= new Date(startDate)
        );
      }
      if (endDate) {
        userExpenses = userExpenses.filter(
          (expense) => new Date(expense.date) <= new Date(endDate)
        );
      }

      setExpenses(userExpenses);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const newExpense = {
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(),
        userId: user.id,
      };

      await ExpenseService.addExpense(newExpense);
      await loadExpenses();
      setAmount('');
      setCategory('');
      setDescription('');
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || '#000000';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Expense Tracker</h2>

      {/* Budget Warnings */}
      {budgetWarnings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-red-600 mb-3">Budget Warnings</h3>
          <div className="bg-red-50 border border-red-200 rounded p-4 space-y-2">
            {budgetWarnings.map((warning, index) => (
              <div key={index} className="text-red-700">
                <strong>{warning.category}:</strong> Spent $
                {warning.current.toFixed(2)} of ${warning.limit.toFixed(2)}{' '}
                {warning.period} budget
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date Filters */}
      <div className="mb-8 bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Filter by Date</h3>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={loadExpenses}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="mb-8 bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Expense</h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Add Expense
          </button>
        </form>
      </div>

      {/* Category and Budget Managers */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white p-4 rounded shadow-sm">
          <CategoryManager />
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <BudgetLimitManager onLimitsChange={loadBudgetLimits} />
        </div>
      </div>
      
      <div className="mb-4 flex items-center gap-4">
  <select 
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
    className="p-2 border rounded"
  >
    <option value="date">Sort by Date</option>
    <option value="amount">Sort by Amount</option>
    <option value="category">Sort by Category</option>
  </select>
  <button
    onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
    className="p-2 border rounded"
  >
    {sortOrder === 'asc' ? '↑' : '↓'}
  </button>
</div>
{getExpenseStats() && (
  <div className="mb-8 bg-white p-4 rounded shadow-sm">
    <h3 className="text-lg font-semibold mb-4">Expense Statistics</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-gray-600">Total Expenses</p>
        <p className="text-xl font-bold">${getExpenseStats()?.total.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-gray-600">Average Expense</p>
        <p className="text-xl font-bold">${getExpenseStats()?.average.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-gray-600">Most Used Category</p>
        <p className="text-xl font-bold">{getExpenseStats()?.mostUsedCategory}</p>
      </div>
      <div>
        <p className="text-gray-600">Highest Expense</p>
        <p className="text-xl font-bold">${getExpenseStats()?.highestExpense.toFixed(2)}</p>
      </div>
    </div>
  </div>
)}

      {/* Recent Expenses */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Expenses</h3>
        {expenses.length > 0 ? (
          <div className="space-y-2">
            {getSortedExpenses().map((expense) => {
              const isOverBudget = budgetWarnings.some((w) => w.category === expense.category);
              return (
                <div
                  key={expense.id}
                  className={`flex items-center justify-between p-3 rounded ${
                    isOverBudget ? 'bg-red-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    />
                    <span className="font-medium text-gray-800">${expense.amount} </span>
                    <span className={`${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                      {expense.category}
                    </span>
                    <span className="text-gray-600 mr-10"> {expense.description}</span>
                    <span className="text-sm text-gray-500 ml-4">
                        {new Date(expense.date).toLocaleDateString('en-US',{
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      } )} 
                    </span>
                    <button
                    onClick={async () => {
                      await ExpenseService.deleteExpense(expense.id);
                      await loadExpenses();
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">No expenses found. Try adjusting your filters or add a new expense.</p>
        )}
      </div>
    </div>
  );
};
