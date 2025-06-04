# Dynamic Form Builder

A dynamic form builder application built with Angular that allows users to create, manage, and submit forms with different field types and validation rules.

## Features

- **Form Builder Interface**: Drag-and-drop interface for building forms with various field types
  - Text input (single-line and multi-line)
  - Dropdown select (with configurable options)
  - Checkbox groups
  - Date picker
  - Radio button groups
  - Configurable field properties (label, required/optional, help text, validation)

- **Form Management**:
  - List view of created form templates
  - Edit existing templates
  - Preview mode to test forms

- **Form Submission**:
  - Form filling interface for end-users
  - Validation based on configured rules
  - Submission to a mock API
  - Success/error handling
  - View submitted form data

- **Authorization**:
  - Two user roles: Admin and User
  - Admin: Can create, edit, and delete form templates
  - User: Can only view and fill out forms
  - Authorization check on all relevant actions
  - Login screen with role selection

## Technical Implementation

- Angular 18 with TypeScript
- Reactive Forms for form handling
- Local storage for data persistence (mock API)
- Drag and drop functionality using Angular CDK
- Responsive design
- Role-based authorization

## Getting Started

### Prerequisites

- Node.js (v18.19.1 or higher)
- npm (v8.0.0 or higher)
- Angular CLI (v18.2.0 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/dynamic-form-builder.git
cd dynamic-form-builder
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
ng serve
```

4. Navigate to `http://localhost:4200/` in your browser

## Usage

1. **Login**: Select a role (Admin or User) and enter a username
2. **Create Forms** (Admin only): Click "Create New Form" to build a form using the drag-and-drop interface
3. **Fill Forms**: Select a form from the list and fill it out
4. **View Submissions** (Admin only): See all submissions for a specific form

## Project Structure

- `src/app/components/`: Angular components
- `src/app/services/`: Services for authentication and form management
- `src/app/models/`: TypeScript interfaces and types
- `src/app/auth/`: Authentication guards and services
- `src/app/store/`: State management (NgRx)

## Testing

Run unit tests with:
```bash
ng test
```

## Future Improvements

- Backend integration with a real API
- More field types (file upload, signature, etc.)
- Form templates and themes
- Advanced validation rules
- User management system
- Form analytics and reporting