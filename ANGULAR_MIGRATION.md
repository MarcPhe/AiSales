# Frontend Migration: React to AngularJS

## Overview
The frontend has been successfully migrated from React with Vite to AngularJS (v1.8.2). This document outlines the changes made and how to use the new Angular-based application.

## Project Structure

```
frontend/
├── src/
│   ├── js/
│   │   ├── app.js                          # Main AngularJS app initialization
│   │   ├── services/
│   │   │   ├── authService.js              # Authentication management
│   │   │   └── apiService.js               # HTTP API calls
│   │   └── controllers/
│   │       ├── landingController.js        # Landing page logic
│   │       ├── loginController.js          # Login form handling
│   │       ├── registerController.js       # Registration form handling
│   │       ├── dashboardController.js      # Dashboard logic
│   │       ├── businessProfileController.js
│   │       └── widgetMetricsController.js
│   ├── templates/
│   │   ├── landing.html                    # Landing page view
│   │   ├── login.html                      # Login form view
│   │   ├── register.html                   # Registration form view
│   │   ├── dashboard.html                  # Dashboard view
│   │   ├── business-profile.html           # Business profile form
│   │   └── widget-metrics.html             # Analytics view
│   ├── styles/                             # CSS files (unchanged)
│   ├── App.css
│   └── style.css
├── index.html                              # Main HTML file with AngularJS setup
├── package.json                            # Dependencies (updated)
└── vite.config.js                         # No longer used (kept for reference)
```

## Key Changes

### 1. Dependencies (package.json)
- **Removed**: React, React DOM, Vite, related build tools
- **Added**: AngularJS 1.8.2, angular-route, angular-animate, http-server

### 2. Architecture

#### Services
- **AuthService**: Handles user authentication and session management
  - `login(userData, token)`: Store user and token
  - `logout()`: Clear authentication
  - `isLoggedIn()`: Check authentication status
  - `requireLogin()`: Route guard

- **ApiService**: Handles all HTTP communication
  - `login(email, password)`: User login
  - `register(email, password, businessName)`: User registration
  - `updateBusinessProfile(profileData)`: Save business profile
  - `getWidgetMetrics()`: Fetch analytics data
  - `getConversations(limit, offset)`: Fetch communications
  - `getBusinessProfile()`: Fetch business profile
  - `getWidgetMetricsTimeseries()`: Fetch time-series metrics

#### Controllers
Each page now has a corresponding controller:
- `LandingController`: Navigation and demo booking
- `LoginController`: Login form submission
- `RegisterController`: Registration form submission
- `DashboardController`: Main dashboard with communications
- `BusinessProfileController`: Business profile management
- `WidgetMetricsController`: Analytics and metrics display

#### Templates
All React components converted to AngularJS HTML templates:
- Uses `ng-model` for two-way data binding
- Uses `ng-click` for event handling
- Uses `{{ }}` for expression binding
- Uses `ng-repeat` for list rendering
- Uses `ng-if`/`ng-class` for conditional rendering

### 3. Routing
The application uses AngularJS routing with the following routes:
- `/` → Landing page
- `/login` → Login form
- `/register` → Registration form
- `/dashboard` → Main dashboard (protected)
- `/business-profile` → Profile management (protected)
- `/widget-metrics` → Analytics (protected)

Protected routes require authentication via `AuthService.requireLogin()`.

## Installation and Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:8080`

### 3. Build
```bash
npm run build
```

## Migration Notes

### From React to AngularJS
1. **State Management**: React's `useState` → AngularJS `$scope` properties
2. **Side Effects**: React's `useEffect` → AngularJS `$scope.$watch` or direct initialization
3. **Routing**: React Router → AngularJS `$routeProvider`
4. **API Calls**: Axios in components → ApiService factory
5. **Event Handling**: React callbacks → AngularJS `ng-click` and methods on `$scope`

### AngularJS 1.x Specifics
- **Two-way binding**: `ng-model` automatically syncs data between view and controller
- **Directives**: `ng-repeat`, `ng-if`, `ng-class`, `ng-show`, `ng-hide`, etc.
- **Filters**: `date`, `currency`, `uppercase`, `lowercase`, etc.
- **Services**: Singletons for sharing data between controllers
- **Dependency Injection**: Constructor or array notation for dependencies

## API Integration

All API calls go through the `ApiService`. The service expects:
- API routes (Vercel): `/api/*` (example: `/api/auth/login`)
- Authorization header: `Bearer {token}`
- Responses in JSON format

Example API call:
```javascript
ApiService.login(email, password)
  .then(function(response) {
    // Handle success
  })
  .catch(function(error) {
    // Handle error
  });
```

## CSS and Styling

All existing CSS files have been preserved and work with the new AngularJS templates:
- `App.css`: Main application styles
- `style.css`: Additional styles
- `styles/Auth.css`: Authentication pages
- `styles/Dashboard.css`: Dashboard layout
- `styles/Landing.css`: Landing page
- Other component-specific CSS files

## Common Tasks

### Adding a New Route
1. Define route in `src/js/app.js`
2. Create controller in `src/js/controllers/`
3. Create template in `src/templates/`

### Adding a New API Service Method
1. Add method to `ApiService` in `src/js/services/apiService.js`
2. Use in controllers via dependency injection

### Two-Way Data Binding
Use `ng-model` in templates:
```html
<input type="text" ng-model="profile.company_name" />
```
Then access in controller:
```javascript
$scope.profile.company_name
```

## Troubleshooting

### Page Blank After Startup
- Check browser console for errors
- Ensure API routes are reachable (Vercel: `/api/*`)
- Clear browser cache

### Routing Not Working
- Verify `ngRoute` module is included in `index.html`
- Check route definition in `app.js`
- Ensure `ng-view` is in `index.html`

### API Calls Failing
- Check Authorization header is being sent
- Verify backend endpoints exist and match API service
- Check CORS settings on backend if needed

## Future Improvements

1. **Authentication**: Add JWT refresh token logic
2. **Error Handling**: Add global error handler
3. **Loading States**: Add loading indicators
4. **Validation**: Add form validation
5. **Testing**: Add unit and integration tests
6. **Performance**: Minify and optimize bundle
7. **Chart Library**: Integrate chart library for metrics visualization

## Files to Delete (Optional)

The following files are no longer needed and can be deleted:
- `vite.config.js`
- `src/main.js`
- `src/*.jsx` files (replaced by templates)
- `src/components/` directory

## Support

For issues or questions about the migration, refer to:
- AngularJS documentation: https://docs.angularjs.org
- AngularJS Best Practices: https://docs.angularjs.org/guide/production
