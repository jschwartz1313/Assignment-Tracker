// Assignment Tracker Application
class AssignmentTracker {
    constructor() {
        this.assignments = this.loadAssignments();
        this.currentView = 'list';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.selectedDate = null;
        this.theme = this.loadTheme();
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.renderAssignments();
        this.updateStats();
        this.renderCalendar();
    }

    // Local Storage
    loadAssignments() {
        const stored = localStorage.getItem('assignments');
        return stored ? JSON.parse(stored) : [];
    }

    saveAssignments() {
        localStorage.setItem('assignments', JSON.stringify(this.assignments));
    }

    // Event Listeners
    setupEventListeners() {
        // Form submission
        document.getElementById('assignmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAssignment();
        });

        // View toggle
        document.getElementById('listViewBtn').addEventListener('click', () => this.switchView('list'));
        document.getElementById('calendarViewBtn').addEventListener('click', () => this.switchView('calendar'));

        // Filters and sorting
        document.getElementById('filterClass').addEventListener('change', () => this.renderAssignments());
        document.getElementById('filterPriority').addEventListener('change', () => this.renderAssignments());
        document.getElementById('filterStatus').addEventListener('change', () => this.renderAssignments());
        document.getElementById('sortBy').addEventListener('change', () => this.renderAssignments());

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Edit modal
        document.getElementById('editAssignmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditedAssignment();
        });
        document.getElementById('closeModal').addEventListener('click', () => this.closeEditModal());
        document.getElementById('cancelEdit').addEventListener('click', () => this.closeEditModal());

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });
    }

    // View Management
    switchView(view) {
        this.currentView = view;

        // Update buttons
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        if (view === 'list') {
            document.getElementById('listViewBtn').classList.add('active');
            document.getElementById('listView').classList.add('active');
            document.getElementById('calendarView').classList.remove('active');
        } else {
            document.getElementById('calendarViewBtn').classList.add('active');
            document.getElementById('calendarView').classList.add('active');
            document.getElementById('listView').classList.remove('active');
            this.renderCalendar();
        }
    }

    // Assignment Management
    addAssignment() {
        const title = document.getElementById('assignmentTitle').value.trim();
        const className = document.getElementById('assignmentClass').value;
        const dueDate = document.getElementById('assignmentDueDate').value;
        const priority = document.getElementById('assignmentPriority').value;
        const description = document.getElementById('assignmentDescription').value.trim();

        const assignment = {
            id: Date.now(),
            title,
            class: className,
            dueDate: new Date(dueDate),
            priority,
            description,
            completed: false,
            createdAt: new Date()
        };

        this.assignments.push(assignment);
        this.saveAssignments();
        this.renderAssignments();
        this.updateStats();
        this.renderCalendar();

        // Reset form
        document.getElementById('assignmentForm').reset();
    }

    deleteAssignment(id) {
        if (confirm('Are you sure you want to delete this assignment?')) {
            this.assignments = this.assignments.filter(a => a.id !== id);
            this.saveAssignments();
            this.renderAssignments();
            this.updateStats();
            this.renderCalendar();
        }
    }

    toggleComplete(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (assignment) {
            assignment.completed = !assignment.completed;
            this.saveAssignments();
            this.renderAssignments();
            this.updateStats();
        }
    }

    editAssignment(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (!assignment) return;

        // Populate the edit form
        document.getElementById('editAssignmentId').value = assignment.id;
        document.getElementById('editAssignmentTitle').value = assignment.title;
        document.getElementById('editAssignmentClass').value = assignment.class;

        // Format date for datetime-local input
        const dueDate = new Date(assignment.dueDate);
        const formattedDate = this.formatDateTimeLocal(dueDate);
        document.getElementById('editAssignmentDueDate').value = formattedDate;

        document.getElementById('editAssignmentPriority').value = assignment.priority;
        document.getElementById('editAssignmentDescription').value = assignment.description || '';

        // Show the modal
        document.getElementById('editModal').classList.add('active');
    }

    saveEditedAssignment() {
        const id = parseInt(document.getElementById('editAssignmentId').value);
        const assignment = this.assignments.find(a => a.id === id);

        if (!assignment) return;

        // Update assignment with form values
        assignment.title = document.getElementById('editAssignmentTitle').value.trim();
        assignment.class = document.getElementById('editAssignmentClass').value;
        assignment.dueDate = new Date(document.getElementById('editAssignmentDueDate').value);
        assignment.priority = document.getElementById('editAssignmentPriority').value;
        assignment.description = document.getElementById('editAssignmentDescription').value.trim();

        this.saveAssignments();
        this.renderAssignments();
        this.updateStats();
        this.renderCalendar();
        this.closeEditModal();
    }

    closeEditModal() {
        document.getElementById('editModal').classList.remove('active');
    }

    // Filtering and Sorting
    getFilteredAndSortedAssignments() {
        let filtered = [...this.assignments];

        // Apply filters
        const classFilter = document.getElementById('filterClass').value;
        if (classFilter !== 'all') {
            filtered = filtered.filter(a => a.class === classFilter);
        }

        const priorityFilter = document.getElementById('filterPriority').value;
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(a => a.priority === priorityFilter);
        }

        const statusFilter = document.getElementById('filterStatus').value;
        if (statusFilter === 'complete') {
            filtered = filtered.filter(a => a.completed);
        } else if (statusFilter === 'incomplete') {
            filtered = filtered.filter(a => !a.completed);
        }

        // Apply sorting
        const sortBy = document.getElementById('sortBy').value;
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'class':
                    return a.class.localeCompare(b.class);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return filtered;
    }

    // Rendering
    renderAssignments() {
        const container = document.getElementById('assignmentsList');
        const filtered = this.getFilteredAndSortedAssignments();

        if (filtered.length === 0) {
            container.innerHTML = '<p class="empty-state">No assignments match your filters.</p>';
            return;
        }

        container.innerHTML = filtered.map(assignment => this.createAssignmentCard(assignment)).join('');

        // Add event listeners to buttons
        filtered.forEach(assignment => {
            document.getElementById(`complete-${assignment.id}`).addEventListener('click', () =>
                this.toggleComplete(assignment.id)
            );
            document.getElementById(`edit-${assignment.id}`).addEventListener('click', () =>
                this.editAssignment(assignment.id)
            );
            document.getElementById(`delete-${assignment.id}`).addEventListener('click', () =>
                this.deleteAssignment(assignment.id)
            );
        });
    }

    createAssignmentCard(assignment) {
        const dueDate = new Date(assignment.dueDate);
        const now = new Date();
        const isOverdue = dueDate < now && !assignment.completed;
        const isDueSoon = dueDate - now < 86400000 * 3 && dueDate > now && !assignment.completed; // 3 days

        const classSlug = assignment.class.toLowerCase().replace(' ', '-');
        const dueDateStr = this.formatDateTime(dueDate);
        const timeUntil = this.getTimeUntil(dueDate);

        let dueDateClass = 'due-date';
        if (isOverdue) dueDateClass += ' overdue';
        else if (isDueSoon) dueDateClass += ' due-soon';

        let cardClass = 'assignment-card';
        if (assignment.completed) cardClass += ' completed';
        else if (isOverdue) cardClass += ' overdue';

        return `
            <div class="${cardClass}">
                <div class="assignment-info">
                    <div class="assignment-header">
                        <h3 class="assignment-title ${assignment.completed ? 'completed' : ''}">${this.escapeHtml(assignment.title)}</h3>
                        <span class="class-badge ${classSlug}">${assignment.class}</span>
                        <span class="priority-badge ${assignment.priority}">${assignment.priority.toUpperCase()}</span>
                    </div>
                    <div class="assignment-meta">
                        <div class="assignment-meta-item">
                            <span class="${dueDateClass}">📅 ${dueDateStr}</span>
                        </div>
                        <div class="assignment-meta-item">
                            <span>${timeUntil}</span>
                        </div>
                    </div>
                    ${assignment.description ? `<p class="assignment-description">${this.escapeHtml(assignment.description)}</p>` : ''}
                </div>
                <div class="assignment-actions">
                    <button id="complete-${assignment.id}" class="action-btn ${assignment.completed ? 'incomplete-btn' : 'complete-btn'}">
                        ${assignment.completed ? 'Mark Incomplete' : 'Complete'}
                    </button>
                    <button id="edit-${assignment.id}" class="action-btn edit-btn">Edit</button>
                    <button id="delete-${assignment.id}" class="action-btn delete-btn">Delete</button>
                </div>
            </div>
        `;
    }

    // Calendar Rendering
    renderCalendar() {
        this.updateCalendarHeader();
        const calendar = document.getElementById('calendar');

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);

        const firstDayIndex = firstDay.getDay();
        const lastDayDate = lastDay.getDate();
        const prevLastDayDate = prevLastDay.getDate();

        let datesHTML = '<div class="calendar-days">';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            datesHTML += `<div class="calendar-day-header">${day}</div>`;
        });
        datesHTML += '</div><div class="calendar-dates">';

        // Previous month days
        for (let x = firstDayIndex; x > 0; x--) {
            const date = prevLastDayDate - x + 1;
            datesHTML += `<div class="calendar-date other-month">${date}</div>`;
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= lastDayDate; i++) {
            const currentDate = new Date(this.currentYear, this.currentMonth, i);
            const assignmentsOnDate = this.getAssignmentsOnDate(currentDate);

            let classes = 'calendar-date';
            if (this.isToday(currentDate)) classes += ' today';
            if (this.selectedDate && this.isSameDay(currentDate, this.selectedDate)) classes += ' selected';
            if (assignmentsOnDate.length > 0) classes += ' has-assignments';

            datesHTML += `
                <div class="${classes}" data-date="${currentDate.toISOString()}">
                    <span>${i}</span>
                    ${assignmentsOnDate.length > 0 ? `<span class="assignment-count">${assignmentsOnDate.length}</span>` : ''}
                </div>
            `;
        }

        // Next month days
        const remainingDays = 42 - (firstDayIndex + lastDayDate);
        for (let i = 1; i <= remainingDays; i++) {
            datesHTML += `<div class="calendar-date other-month">${i}</div>`;
        }

        datesHTML += '</div>';
        calendar.innerHTML = datesHTML;

        // Add click events
        document.querySelectorAll('.calendar-date:not(.other-month)').forEach(dateEl => {
            dateEl.addEventListener('click', (e) => {
                const dateStr = e.currentTarget.dataset.date;
                if (dateStr) {
                    this.selectedDate = new Date(dateStr);
                    this.renderCalendar();
                    this.showDateAssignments(this.selectedDate);
                }
            });
        });
    }

    updateCalendarHeader() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('calendarMonthYear').textContent =
            `${monthNames[this.currentMonth]} ${this.currentYear}`;
    }

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    }

    showDateAssignments(date) {
        const container = document.getElementById('selectedDateAssignments');
        const assignments = this.getAssignmentsOnDate(date);

        if (assignments.length === 0) {
            container.innerHTML = `<p class="empty-state">No assignments on ${this.formatDate(date)}</p>`;
            return;
        }

        container.innerHTML = `
            <h4 style="margin-bottom: 1rem; color: var(--text-secondary);">${this.formatDate(date)}</h4>
            ${assignments.map(a => this.createAssignmentCard(a)).join('')}
        `;

        // Add event listeners
        assignments.forEach(assignment => {
            document.getElementById(`complete-${assignment.id}`).addEventListener('click', () => {
                this.toggleComplete(assignment.id);
                this.showDateAssignments(date);
            });
            document.getElementById(`edit-${assignment.id}`).addEventListener('click', () => {
                this.editAssignment(assignment.id);
            });
            document.getElementById(`delete-${assignment.id}`).addEventListener('click', () => {
                this.deleteAssignment(assignment.id);
                this.showDateAssignments(date);
            });
        });
    }

    getAssignmentsOnDate(date) {
        return this.assignments.filter(a => {
            const dueDate = new Date(a.dueDate);
            return this.isSameDay(dueDate, date);
        });
    }

    // Statistics
    updateStats() {
        const total = this.assignments.length;
        const incomplete = this.assignments.filter(a => !a.completed).length;
        const now = new Date();
        const dueSoon = this.assignments.filter(a => {
            const dueDate = new Date(a.dueDate);
            return !a.completed && dueDate > now && dueDate - now < 86400000 * 7; // 7 days
        }).length;

        document.getElementById('totalAssignments').textContent = total;
        document.getElementById('incompleteAssignments').textContent = incomplete;
        document.getElementById('dueSoon').textContent = dueSoon;
    }

    // Theme Management
    loadTheme() {
        const stored = localStorage.getItem('theme');
        return stored || 'light';
    }

    saveTheme() {
        localStorage.setItem('theme', this.theme);
    }

    applyTheme() {
        document.body.className = this.theme === 'dark' ? 'dark-theme' : '';
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.saveTheme();
        this.applyTheme();
    }

    // Utility Functions
    formatDateTime(date) {
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[d.getMonth()];
        const day = d.getDate();
        const year = d.getFullYear();
        const hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        return `${month} ${day}, ${year} at ${displayHours}:${minutes} ${ampm}`;
    }

    formatDate(date) {
        const d = new Date(date);
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }

    formatDateTimeLocal(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    getTimeUntil(date) {
        const now = new Date();
        const diff = new Date(date) - now;

        if (diff < 0) return '⏰ Overdue';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `⏱️ ${days} day${days !== 1 ? 's' : ''} remaining`;
        if (hours > 0) return `⏱️ ${hours} hour${hours !== 1 ? 's' : ''} remaining`;
        return '⏱️ Due very soon';
    }

    isToday(date) {
        const today = new Date();
        return this.isSameDay(date, today);
    }

    isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new AssignmentTracker();
});
