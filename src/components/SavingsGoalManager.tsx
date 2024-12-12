import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';
import { SavingsGoalService } from '../services/SavingsGoalService';
import { SavingsGoal } from '../types';

const PRESET_CATEGORIES = [
  'Financial Goals',
  'Education',
  'Travel',
  'Home Improvement',
  'Health and Wellness',
  'Retirement',
  'Emergency Fund',
  'Major Purchase',
  'Debt Repayment',
  'Other'
];
// Main component for managing savings goals - allows users to create, track, and delete savings targets
export const SavingsGoalManager: React.FC = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      loadSavingsGoals();
    }
  }, [user]);

  const loadSavingsGoals = async () => {
    if (user) {
      const goals = await SavingsGoalService.getSavingsGoals(user.id);
      setSavingsGoals(goals);
    }
  };

  // Creates a new savings goal with automatic milestone calculations at 25%, 50%, and 75%
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const milestones = [25, 50, 75].map(percentage => ({
        amount: (parseFloat(targetAmount) * percentage) / 100,
        reached: false
      }));

      const newGoal = {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        deadline: new Date(deadline),
        milestones,
        category,
        createdAt: new Date(),
        userId: user.id
      };

      await SavingsGoalService.addSavingsGoal(newGoal);
      await loadSavingsGoals();
      setName('');
      setTargetAmount('');
      setDeadline('');
      setCategory('');
    }
  };

  // Handles updating the progress of a savings goal when user clicks contribution buttons
  const updateProgress = async (goalId: string, addAmount: number) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedGoal = {
      ...goal,
      currentAmount: Number(goal.currentAmount) + Number(addAmount),
      milestones: goal.milestones.map(milestone => ({
        ...milestone,
        reached: (Number(goal.currentAmount) + Number(addAmount)) >= milestone.amount
      }))
    };

    try {
      await SavingsGoalService.updateSavingsGoal(updatedGoal);
      await loadSavingsGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleDelete = async (goalId: string) => {
    try {
      await SavingsGoalService.deleteSavingsGoal(goalId);
      await loadSavingsGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h3 className="text-lg font-semibold mb-4">Savings Goals</h3>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            id="goalName"
            name="goalName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Goal Name"
            className="p-2 border rounded"
            required
          />
          <input
            id="targetAmount"
            name="targetAmount"
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="Target Amount"
            className="p-2 border rounded"
            required
          />
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {PRESET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Savings Goal
        </button>
      </form>

      <div className="grid gap-4 mt-6">
        {savingsGoals.map(goal => (
          <div key={goal.id} className="bg-white p-4 rounded-lg shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{goal.name}</h3>
              <span className="text-sm text-gray-500">Category: {goal.category || 'Uncategorized'}</span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress: ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 text-center">
                {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% Complete
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {[10, 20, 50, 100, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => updateProgress(goal.id, amount)}
                  className="bg-green-500 text-white px-3 py-1.5 rounded text-sm hover:bg-green-600 transition-colors duration-200"
                >
                  +${amount}
                </button>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
              <div className="mt-2">
                <p className="font-medium mb-1">Milestones:</p>
                {goal.milestones.map((milestone, index) => (
                  <p key={index} className={`flex items-center gap-2 ${milestone.reached ? 'text-green-600' : ''}`}>
                    {milestone.reached ? '✓' : '○'} ${milestone.amount.toFixed(2)}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => handleDelete(goal.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete Goal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};