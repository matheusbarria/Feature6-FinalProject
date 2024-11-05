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
