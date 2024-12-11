import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';
import { BudgetLimitService } from '../services/BudgetLimitService';
import { BudgetLimit } from '../types';

export const BudgetLimitManager: React.FC = () => {
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      loadBudgetLimits();
    }
  }, [user]);

  const loadBudgetLimits = async () => {
    if (user) {
      const limits = await BudgetLimitService.getBudgetLimits(user.id);
      setBudgetLimits(limits);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const newLimit = {
        category,
        amount: parseFloat(amount),
        period,
        userId: user.id
      };

      await BudgetLimitService.setBudgetLimit(newLimit);
      await loadBudgetLimits();
      setCategory('');
      setAmount('');
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Budget Limits</h3>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="mr-2 p-2 border rounded"
          required
        />
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
          className="mr-2 p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Set Limit
        </button>
      </form>

      <div className="grid gap-2">
        {budgetLimits.map(limit => (
          <div key={limit.id} className="border p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium">{limit.category}</span>
              <span>${limit.amount} ({limit.period})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};