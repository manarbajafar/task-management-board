# Task Management Board

A modern, responsive task management application built with React, TypeScript, and Ant Design. Features drag-and-drop functionality, real-time filtering, and a clean, intuitive interface.

## Live Demo

[Live Demo Link](https://rakaya-task-management-board.netlify.app/)

## Features

### Core Requirements 
- **Four-column board**: Backlog, To Do, In Progress, Need Review
- **Full CRUD operations**: Create, read, update, and delete tasks
- **Drag & Drop**: Move tasks between columns using @dnd-kit
- **Task Properties**: Title, description, priority, assignee, tags, due dates
- **Search functionality**: Filter tasks by title, description, or tags
- **Advanced filtering**: Filter by priority and assignee
- **Responsive design**: Works seamlessly on desktop, tablet, and mobile
- **State management**: React Context API with useReducer

### Additional Features 
- **User Management**: Add and assign team members
- **Due Date Tracking**: Set and monitor task deadlines
- **Tag System**: Categorize tasks with custom tags
- **Dark/Light Theme**: Toggle between themes
- **Internationalization**: English and Arabic language support
- **Local Storage**: Persist data across browser sessions

## Tech Stack

- **Frontend**: React, TypeScript
- **Build Tool**: Vite
- **UI Framework**: Ant Design 5.26
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Drag & Drop**: @dnd-kit (core, utilities)
- **State Management**: React Context API + useReducer
- **Storage**: Local Storage with custom service layer
- **Internationalization**: react-i18next
- **Icons**: Ant Design Icons

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, MainLayout
├── features/
│   ├── board/           #  Kanban board (Board, BoardFilters, Column)
│   ├── tasks/           # Task management (TaskCard, TaskFormModal, Context)
│   └── project-info/    # Project metadata (ProjectInfo, DatePicker, Tags, Users)
├── services/            #  StorageService for data persistence
├── types/               # TypeScript type definitions
└── i18n/                # Translation files (en.json, ar.json)
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/manarbajafar/task-management-board.git]
   cd taskboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (Vite default port)

### Build for Production

```bash
npm run build
# or
yarn build
```


##  Usage Guide

### Managing Tasks

1. **Create a Task**
   - Click the "Add Task" button in any column
   - Fill in task details (title, description, priority, assignee)
   - Add tags

2. **Edit Tasks**
   - Hover over any task card
   - Click the edit icon to modify task details

3. **Move Tasks**
   - Drag and drop tasks between columns
   - Or use the edit modal to change task status

4. **Delete Tasks**
   - Hover over a task card
   - Click the delete icon and confirm

### Filtering & Search

- **Search**: Use the search bar to find tasks by title, description, or tags
- **Priority Filter**: Filter tasks by Low, Medium, or High priority
- **Assignee Filter**: Show tasks assigned to specific team members
- **Clear Filters**: Reset all active filters

### Project Management

- **Add Team Members**: Click the "+" button in the project header
- **Set Due Dates**: Click on the date field to set project deadlines
- **Manage Tags**: Add project-wide tags for better organization

## Data Persistence

The application uses Local Storage to persist data across browser sessions:

- **Tasks**: Stored with full task details and relationships
- **Users**: Team member information and assignments
- **Projects**: Project metadata and settings
- **Preferences**: Theme, language, and UI preferences

## Theming & Customization

### Theme System
- **CSS Variables**: Consistent color system across light/dark themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Toggle**: Switch between light and dark modes

## Internationalization

The app supports multiple languages with full RTL support:
- **English** (LTR - Left to Right)
- **Arabic** (RTL - Right to Left)

Translation files:
- English: `/public/locales/en/translation.json`
- Arabic: `/public/locales/ar/translation.json`

## Author

**Manar Bajafar**
- GitHub: [@manarbajafar](https://github.com/manarbajafar)
- LinkedIn: [manarbajafar](https://linkedin.com/in/manarbajafar)
- Email: manar.bajafar@gmail.com

---
