import React, { useState, useEffect } from 'react';
import { CategoryService } from '../services/CategoryService';
import { ExpenseCategory } from '../types';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#000000');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const fetchedCategories = await CategoryService.getCategories();
    setCategories(fetchedCategories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await CategoryService.addCategory(newCategoryName, newCategoryColor);
    await loadCategories();
    setNewCategoryName('');
    setNewCategoryColor('#000000');
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Manage Categories</h3>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Category Name"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="color"
          value={newCategoryColor}
          onChange={(e) => setNewCategoryColor(e.target.value)}
          className="mr-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </form>

      <div className="grid grid-cols-2 gap-2">
  {categories.map(category => (
    <div 
      key={category.id} 
      className="p-2 rounded flex justify-between items-center"
      style={{ backgroundColor: category.color + '20' }}
    >
      <span>{category.name}</span>
      <div className="flex items-center">
        <div 
          className="w-4 h-4 rounded-full mr-2" 
          style={{ backgroundColor: category.color }}
        />
        <button
          onClick={async () => {
            await CategoryService.deleteCategory(category.id);
            await loadCategories();
          }}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
  );
};