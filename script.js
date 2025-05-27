document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');

    // New elements for history and end-day functionality
    const endDayBtn = document.getElementById('end-day-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyPage = document.getElementById('history-page');
    // Assuming todo-list's parent is the main container for the to-do list section,
    // including the input and add button, which we might want to hide/show.
    // Let's define a more specific container if needed, or adjust as we build the show/hide logic.
    // For now, let's assume the h1, input, add button, and list are what we want to toggle
    // with the history page. We'll need a wrapper for that or hide them individually.
    // Let's get the direct parent of todoList for now as requested.
    const mainTodoListContainer = todoList.parentElement; 
    const backToMainBtn = document.getElementById('back-to-main-btn');
    const datesList = document.getElementById('dates-list'); // Ul element for dates
    const archivedTasksList = document.getElementById('archived-tasks-list'); // Ul element for tasks of a selected date
    const selectedHistoryDateSpan = document.getElementById('selected-history-date');

    loadTodos(); // Call loadTodos after todoList is defined

    // --- History Page Logic ---

    function showMainPage() {
        if (historyPage) historyPage.style.display = 'none';
        if (todoInput) todoInput.style.display = ''; // Default display
        if (addTodoBtn) addTodoBtn.style.display = ''; // Default display
        if (todoList) todoList.style.display = '';   // Default display

        // Clear any previously displayed archived tasks or dates
        if (datesList) datesList.innerHTML = '';
        if (archivedTasksList) archivedTasksList.innerHTML = '';
        if (selectedHistoryDateSpan) selectedHistoryDateSpan.textContent = '';
    }

    function displayArchivedList(date) {
        if (!selectedHistoryDateSpan || !archivedTasksList) return;

        selectedHistoryDateSpan.textContent = date;
        archivedTasksList.innerHTML = ''; // Clear previous tasks

        let tasks;
        try {
            tasks = JSON.parse(localStorage.getItem(`history_${date}`)) || [];
        } catch (e) {
            console.error('Error reading history from localStorage:', e);
            const errorLi = document.createElement('li');
            errorLi.textContent = 'Error loading tasks.';
            errorLi.style.color = 'red';
            archivedTasksList.appendChild(errorLi);
            return;
        }

        if (tasks.length === 0) {
            const noTasksLi = document.createElement('li');
            noTasksLi.textContent = 'No tasks for this date.';
            archivedTasksList.appendChild(noTasksLi);
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text; // Set task text first
            if (task.completed) {
                li.classList.add('completed-task-history');
                li.textContent += ' ✔';
            } else {
                li.classList.add('incomplete-task-history');
                li.textContent += ' ❌';
            }
            archivedTasksList.appendChild(li);
        });
    }

    function showHistoryPage() {
        if (historyPage) historyPage.style.display = 'block'; // Or 'flex' if using flexbox
        if (todoInput) todoInput.style.display = 'none';
        if (addTodoBtn) addTodoBtn.style.display = 'none';
        if (todoList) todoList.style.display = 'none';

        if (!datesList) return;
        datesList.innerHTML = ''; // Clear previous dates

        let historyFound = false;
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('history_')) {
                    historyFound = true;
                    const dateString = key.substring('history_'.length);
                    const dateLi = document.createElement('li');
                    dateLi.textContent = dateString;
                    dateLi.dataset.date = dateString; // Store date for easy access
                    dateLi.style.cursor = 'pointer'; // Indicate it's clickable
                    dateLi.addEventListener('click', () => displayArchivedList(dateString));
                    datesList.appendChild(dateLi);
                }
            }
        } catch (e) {
            console.error('Error iterating localStorage for history:', e);
            const errorLi = document.createElement('li');
            errorLi.textContent = 'Error loading history dates.';
            errorLi.style.color = 'red';
            datesList.appendChild(errorLi);
            return; // Stop further processing if localStorage access fails
        }
        

        if (!historyFound) {
            const noHistoryLi = document.createElement('li');
            noHistoryLi.textContent = 'No history found.';
            datesList.appendChild(noHistoryLi);
        }
    }

    // --- End of History Page Logic ---

    function endDay() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        let currentTodos;
        try {
            currentTodos = JSON.parse(localStorage.getItem('todos')) || [];
        } catch (e) {
            console.error('Error reading todos from localStorage:', e);
            alert('Error reading your tasks. Please try again.');
            return;
        }

        if (currentTodos.length > 0) {
            try {
                localStorage.setItem(`history_${dateString}`, JSON.stringify(currentTodos));
            } catch (e) {
                console.error('Error saving history to localStorage:', e);
                alert('Error saving history. Your current list might not be archived.');
                return;
            }
        }

        try {
            localStorage.setItem('todos', JSON.stringify([]));
        } catch (e) {
            console.error('Error clearing current todos in localStorage:', e);
            alert('Error clearing current tasks. Please manually clear if issues persist.');
            // Not returning here, will still attempt to clear UI
        }

        todoList.innerHTML = ''; // Clear the UI
        alert('Day ended. Your list has been archived.');
    }

    function addTodoItem() {
        const todoText = todoInput.value.trim();

        if (todoText === '') {
            alert('To-do item cannot be empty!');
            return; // Do not add empty to-do items
        }

        const listItem = document.createElement('li');

        const textSpan = document.createElement('span');
        textSpan.textContent = todoText;
        listItem.appendChild(textSpan);

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete-btn'); // Add a class for styling if needed
        completeButton.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            // Update localStorage
            let storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
            const todoIndex = storedTodos.findIndex(item => item.text === todoText); // todoText is from the outer scope
            if (todoIndex > -1) {
                storedTodos[todoIndex].completed = listItem.classList.contains('completed');
                localStorage.setItem('todos', JSON.stringify(storedTodos));
            }
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn'); // Add a class for styling if needed
        removeButton.addEventListener('click', () => {
            todoList.removeChild(listItem);
            // Update localStorage
            let storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
            // todoText is from the outer scope of addTodoItem
            const updatedTodos = storedTodos.filter(item => item.text !== todoText);
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
        });

        const buttonsWrapper = document.createElement('div'); // To group buttons
        buttonsWrapper.appendChild(completeButton);
        buttonsWrapper.appendChild(removeButton);
        listItem.appendChild(buttonsWrapper);

        todoList.appendChild(listItem);
        todoInput.value = ''; // Clear the input field

    // Save to localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({ text: todoText, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const todoList = document.getElementById('todo-list'); // Ensure todoList is accessible
        let todos = JSON.parse(localStorage.getItem('todos')) || [];

        if (todos.length === 0) {
            return;
        }

        todos.forEach((todo, index) => { // Added index for potential use
            const listItem = document.createElement('li');
            if (todo.completed) {
                listItem.classList.add('completed');
            }

            const textSpan = document.createElement('span');
            textSpan.textContent = todo.text;
            listItem.appendChild(textSpan);

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('complete-btn');
            completeButton.addEventListener('click', () => {
                listItem.classList.toggle('completed');
                // Update localStorage
                let storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
                // Find the todo item by text. This is not robust for duplicate texts.
                // A better approach would be to assign unique IDs.
                const todoIndex = storedTodos.findIndex(item => item.text === todo.text);
                if (todoIndex > -1) {
                    storedTodos[todoIndex].completed = !storedTodos[todoIndex].completed;
                    localStorage.setItem('todos', JSON.stringify(storedTodos));
                }
            });

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-btn');
            removeButton.addEventListener('click', () => {
                todoList.removeChild(listItem);
                // Update localStorage
                let storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
                // Find the todo item by text and remove it.
                const updatedTodos = storedTodos.filter(item => item.text !== todo.text); // This might remove multiple items if text is not unique
                localStorage.setItem('todos', JSON.stringify(updatedTodos));
            });

            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.appendChild(completeButton);
            buttonsWrapper.appendChild(removeButton);
            listItem.appendChild(buttonsWrapper);

            todoList.appendChild(listItem);
        });
    }

    addTodoBtn.addEventListener('click', addTodoItem);
    if (endDayBtn) endDayBtn.addEventListener('click', endDay);
    if (historyBtn) historyBtn.addEventListener('click', showHistoryPage);
    if (backToMainBtn) backToMainBtn.addEventListener('click', showMainPage);

    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodoItem();
        }
    });

    // Dark Mode Functionality
    function toggleDarkMode() {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            darkModeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    }

    if (darkModeToggle) { // Ensure the toggle element exists
        darkModeToggle.addEventListener('click', toggleDarkMode);

        // Initialize theme based on localStorage
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        } else {
            // Default to light mode if no theme or 'light' is stored
            body.classList.remove('dark-mode'); 
            darkModeToggle.textContent = '🌙';
        }
    }

    // Initial setup
    showMainPage(); // Show the main page by default
});
