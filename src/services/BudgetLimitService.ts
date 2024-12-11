import Parse from 'parse';
import { BudgetLimit } from '../types';

export class BudgetLimitService {
  static async setBudgetLimit(limit: Omit<BudgetLimit, 'id'>): Promise<BudgetLimit> {
    const BudgetLimitObject = Parse.Object.extend('BudgetLimit');
    const budgetLimit = new BudgetLimitObject();

    budgetLimit.set('category', limit.category);
    budgetLimit.set('amount', limit.amount);
    budgetLimit.set('period', limit.period);
    const userPointer = Parse.User.createWithoutData(limit.userId);
    budgetLimit.set('userId', userPointer);

    const savedLimit = await budgetLimit.save();
    
    return {
      id: savedLimit.id,
      category: savedLimit.get('category'),
      amount: savedLimit.get('amount'),
      period: savedLimit.get('period'),
      userId: savedLimit.get('userId').id
    };
  }

  static async getBudgetLimits(userId: string): Promise<BudgetLimit[]> {
    const query = new Parse.Query('BudgetLimit');
    const userPointer = Parse.User.createWithoutData(userId);
    query.equalTo('userId', userPointer);
    
    const results = await query.find();
    return results.map(limit => ({
      id: limit.id,
      category: limit.get('category'),
      amount: limit.get('amount'),
      period: limit.get('period'),
      userId: limit.get('userId').id
    }));
  }
  static async deleteBudgetLimit(id: string): Promise<void> {
    const query = new Parse.Query('BudgetLimit');
    const budgetLimit = await query.get(id);
    await budgetLimit.destroy();
  }
}