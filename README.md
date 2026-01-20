# Assignment Tracker

A modern, feature-rich web application for tracking academic assignments across multiple classes.

**Live Demo:** [https://jschwartz1313.github.io/Assignment-Tracker/](https://jschwartz1313.github.io/Assignment-Tracker/)

## Features

### Two View Modes
- **List View**: See all your assignments in a detailed, sortable list
- **Calendar View**: Visualize assignments on an interactive monthly calendar

### Assignment Management
- Add assignments with title, class, due date, priority level, and optional description
- Mark assignments as complete/incomplete
- Delete assignments
- Color-coded class badges for easy identification
- Priority indicators (High, Medium, Low)
- Visual warnings for overdue and due-soon assignments

### Classes Supported
- INLS 992 (Purple)
- INLS 776 (Pink)
- ENEC 543 (Orange)
- DATA 545 (Blue)
- INLS 642 (Green)

### Advanced Filtering & Sorting
- Filter by class
- Filter by priority level
- Filter by completion status
- Sort by due date, priority, class name, or assignment title

### Calendar Features
- Interactive monthly calendar with navigation
- Visual indicators for dates with assignments
- Click any date to see assignments due that day
- Current date highlighting
- Assignment count badges on calendar dates

### Statistics Dashboard
- Total assignments count
- Incomplete assignments count
- Assignments due within the next 7 days

### Data Persistence
- All assignments are automatically saved to browser local storage
- Your data persists between sessions
- No server or database required

## How to Use

1. Open `index.html` in any modern web browser
2. Fill out the form to add a new assignment:
   - Enter the assignment title
   - Select the class
   - Choose the due date and time
   - Set the priority level
   - Optionally add a description
3. Click "Add Assignment" to save
4. Use the filters and sort options to organize your view
5. Toggle between List View and Calendar View using the buttons at the top
6. Mark assignments as complete or delete them as needed

## Design Features

- Modern dark theme with gradient accents
- Fully responsive design (works on mobile and desktop)
- Smooth animations and transitions
- Intuitive user interface
- No installation required - runs entirely in the browser

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks required)
- Client-side only - no server needed
- Uses browser localStorage API for data persistence
- Responsive grid layout with CSS Grid and Flexbox
- Cross-browser compatible

## Files

- `index.html` - Main HTML structure
- `styles.css` - Complete styling with CSS variables for theming
- `script.js` - Full application logic and interactivity
