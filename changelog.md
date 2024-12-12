## [0.4.0] - 2024-11-07
### Added
- Comprehensive expense tracking system with:
  - Add, view, and delete expenses
  - Category management with color coding
  - Budget limit management with period-based limits
  - Date-based filtering of expenses
  - Sorting capabilities by date, amount, and category
  - Expense statistics including totals, averages, and trends
- Budget warning system that alerts users when approaching limits
- Expense categorization with visual indicators
- Detailed expense statistics dashboard showing:
  - Total expenses
  - Average expense amount
  - Most used category
  - Highest single expense
- Interactive UI components:
  - Color-coded category management
  - Period-based budget limits (daily/weekly/monthly)
  - Date range filters
  - Sort controls for expense list
- Data visualization with color-coded categories and budget warnings

### Changed
- Updated application title to "BudgetBee"
- Added favicon and PNG image support for better branding
- Enhanced user interface with Tailwind CSS styling
- Improved data organization with Parse backend integration

## [0.3.0] - 2024-11-05
### Added
- Complete authentication system using Parse
- User signup functionality with email and password
- User login with credential verification
- Protected routes requiring authentication
- Dashboard component for authenticated users
- Redux state management for auth state
- AuthService class for handling Parse authentication
- Loading states and error handling for auth operations
- Session persistence using Parse User tokens
- Automatic redirection for authenticated/unauthenticated users
- Logout functionality with state cleanup

- 
## [0.2.0]
### Added
- Routing setup with React Router.
- Navigation bar with links to Home, Phone Book, and Address Book.
- `App` component with routes for Home, ParentComponent (Phone Book), and AddressList (Address Book).
- `ParseService` for fetching address data from Parse backend.
- Error handling and loading states for data fetching.

## [0.1.0] - 2024-10-18
### Added
- Initial project structure with components: `App`, `ParentComponent`, `ChildComponent`, and `anotherComponent`.
- Basic React setup using `useEffect` for fetching data from Parse.
- `address_parser.js` to initialize Parse and provide data-fetching logic.
- Routing with `react-router-dom` to switch between components.

### Changed
- Enhanced `ChildComponent` to render only name and numbers from the fetched data.

### Fixed
- Resolved missing data issue in `ParentComponent` by correctly passing fetched data to `ChildComponent`.

## [0.0.1] - 2024-10-17
### Added
- Initial setup with React, Parse, and component files.
- Project bootstrapped with necessary dependencies.
