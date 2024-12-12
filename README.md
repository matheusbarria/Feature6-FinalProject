# BudgetBee - Expense Tracking Application

## Overview
BudgetBee is a comprehensive expense tracking application built with React, TypeScript, and Parse backend. It helps users manage their expenses, set budget limits, and track spending patterns across different categories.

## Features

### Authentication & Security
- Secure user authentication system
- Protected routes for authenticated users
- Session persistence
- Email-based user registration and login

### Expense Management
- Add, view, and delete expenses
- Categorize expenses with custom categories
- Add descriptions and dates to expenses
- Sort expenses by date, amount, or category
- Filter expenses by date range
- Delete individual expense entries

### Budget Control
- Set budget limits for different categories
- Configure limits on daily, weekly, or monthly basis
- Real-time budget warnings when approaching limits
- Visual indicators for over-budget categories

### Category Management
- Create custom expense categories
- Assign colors to categories for visual organization
- Delete unused categories
- Color-coded expense display

### Statistics & Analytics
- Total expense calculations
- Average expense tracking
- Most used category identification
- Highest expense tracking
- Visual representation of spending patterns

### User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout for all devices
- Intuitive navigation
- Color-coded visual feedback
- Sort and filter controls

## Technology Stack
- React 18.2.0
- TypeScript 4.4.4
- Parse Backend (Back4App)
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling

## Getting Started

### Prerequisites
- Node.js (latest stable version)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
`npm install`

3. Star the development server:
`npm start`

### Environment Setup
Configure your Parse backend credentials in `App.tsx`: