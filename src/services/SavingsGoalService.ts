import Parse from 'parse';
import { SavingsGoal } from '../types';
import { SavingsGoalManager } from '../components/SavingsGoalManager';

// Service class that handles all savings goal operations with the Parse backend
export class SavingsGoalService {
  // Creates a new savings goal and saves it to the database with user info
  static async addSavingsGoal(goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> {
    try {
      const SavingsGoalObject = Parse.Object.extend('SavingsGoal');
      const savingsGoal = new SavingsGoalObject();

      savingsGoal.set('name', goal.name);
      savingsGoal.set('targetAmount', goal.targetAmount);
      savingsGoal.set('currentAmount', goal.currentAmount);
      savingsGoal.set('deadline', goal.deadline);
      savingsGoal.set('milestones', goal.milestones);
      savingsGoal.set('category', goal.category);
      savingsGoal.set('createdAt', goal.createdAt);
      const userPointer = Parse.User.createWithoutData(goal.userId);
      savingsGoal.set('userId', userPointer);

      const savedGoal = await savingsGoal.save();
      
      return {
        id: savedGoal.id,
        name: savedGoal.get('name'),
        targetAmount: savedGoal.get('targetAmount'),
        currentAmount: savedGoal.get('currentAmount'),
        deadline: savedGoal.get('deadline'),
        milestones: savedGoal.get('milestones'),
        category: savedGoal.get('category'),
        createdAt: savedGoal.get('createdAt'),
        userId: savedGoal.get('userId').id
      };
    } catch (error) {
      console.error('Error adding savings goal:', error);
      throw error;
    }
  }

  // Retrieves all savings goals for a specific user, sorted by deadline
  static async getSavingsGoals(userId: string): Promise<SavingsGoal[]> {
    const query = new Parse.Query('SavingsGoal');
    const userPointer = Parse.User.createWithoutData(userId);
    query.equalTo('userId', userPointer);
    query.ascending('deadline');
    
    const results = await query.find();
    return results.map(goal => ({
      id: goal.id,
      name: goal.get('name'),
      targetAmount: goal.get('targetAmount'),
      currentAmount: goal.get('currentAmount'),
      deadline: goal.get('deadline'),
      milestones: goal.get('milestones'),
      category: goal.get('category'),
      createdAt: goal.get('createdAt'),
      userId: goal.get('userId').id
    }));
  }

  // Updates an existing savings goal's progress and milestone status
  static async updateSavingsGoal(goal: SavingsGoal): Promise<SavingsGoal> {
    try {
      const query = new Parse.Query('SavingsGoal');
      const savingsGoal = await query.get(goal.id);
      
      if (!savingsGoal) {
        throw new Error('Savings goal not found');
      }

      savingsGoal.set('currentAmount', goal.currentAmount);
      savingsGoal.set('milestones', goal.milestones);
      
      const updatedGoal = await savingsGoal.save();
      return {
        id: updatedGoal.id,
        name: updatedGoal.get('name'),
        targetAmount: updatedGoal.get('targetAmount'),
        currentAmount: updatedGoal.get('currentAmount'),
        deadline: updatedGoal.get('deadline'),
        milestones: updatedGoal.get('milestones'),
        category: goal.category,
        createdAt: updatedGoal.get('createdAt'),
        userId: updatedGoal.get('userId').id
      };
    } catch (error) {
      console.error('Error updating savings goal:', error);
      throw error;
    }
  }

  static async deleteSavingsGoal(id: string): Promise<void> {
    const query = new Parse.Query('SavingsGoal');
    const goal = await query.get(id);
    await goal.destroy();
  }
} 