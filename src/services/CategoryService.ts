import Parse from 'parse';
import { ExpenseCategory } from '../types';

export class CategoryService {
  static async addCategory(name: string, color: string): Promise<ExpenseCategory> {
    const CategoryObject = Parse.Object.extend('ExpenseCategory');
    const category = new CategoryObject();
    
    category.set('name', name);
    category.set('color', color);
    category.set('userId', Parse.User.current());

    const savedCategory = await category.save();
    return {
      id: savedCategory.id,
      name: savedCategory.get('name'),
      color: savedCategory.get('color')
    };
  }

  static async getCategories(): Promise<ExpenseCategory[]> {
    const query = new Parse.Query('ExpenseCategory');
    query.equalTo('userId', Parse.User.current());
    
    const results = await query.find();
    return results.map(category => ({
      id: category.id,
      name: category.get('name'),
      color: category.get('color')
    }));
  }
  static async deleteCategory(id: string): Promise<void> {
    const query = new Parse.Query('ExpenseCategory');
    const category = await query.get(id);
    await category.destroy();
  }
}