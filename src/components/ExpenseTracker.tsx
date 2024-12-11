import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';
import { ExpenseService } from '../services/ExpenseService';
import { CategoryService } from '../services/CategoryService';
import { Expense, ExpenseCategory } from '../types';
import { CategoryManager } from './CategoryManager';
import { BudgetLimitManager } from './BudgetLimitManager';

export const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      loadExpenses();
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    const fetchedCategories = await CategoryService.getCategories();
    setCategories(fetchedCategories);
  };

  const loadExpenses = async () => {
    if (user) {
      let userExpenses = await ExpenseService.getExpenses(user.id);
      
      // Apply date filters if set
      if (startDate) {
        userExpenses = userExpenses.filter(expense => 
          new Date(expense.date) >= new Date(startDate)
        );
      }
      if (endDate) {
        userExpenses = userExpenses.filter(expense => 
          new Date(expense.date) <= new Date(endDate)
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
        userId: user.id
      };

      await ExpenseService.addExpense(newExpense);
      await loadExpenses();
      setAmount('');
      setCategory('');
      setDescription('');
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#000000';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Expense Tracker</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Date Filters</h3>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mr-2 p-2 border rounded"
        />
        <button 
          onClick={loadExpenses}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
        <BudgetLimitManager />
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          className="mr-2 p-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mr-2 p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="mr-2 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Expense
        </button>
      </form>

      <CategoryManager />

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Recent Expenses</h3>
        <div className="grid gap-4">
          {expenses.map(expense => (
            <div 
              key={expense.id} 
              className="border p-4 rounded"
              style={{ borderLeftColor: getCategoryColor(expense.category), borderLeftWidth: '4px' }}
            >
              <div className="flex justify-between">
                <span className="font-medium">${expense.amount}</span>
                <span className="text-gray-600">{expense.category}</span>
              </div>
              <p className="text-gray-600">{expense.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};