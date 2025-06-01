// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Check if the app container is visible (meaning user is logged in)
    const appContainer = document.getElementById('app-container');
    if (!appContainer || appContainer.style.display === 'none') {
        // If app container is hidden (user not logged in), do not initialize to-do list logic.
        // auth.js is responsible for showing the correct container.
        console.log('User not logged in or app container not visible. To-Do list not initialized.');
        return;
    }

    // If we reach here, user is logged in and app container is visible.
    console.log('User logged in. Initializing To-Do list.');

    // const darkModeToggle = document.getElementById('darkModeToggle'); // Handled by auth.js
    // const body = document.body; // Handled by auth.js
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    const endDayBtn = document.getElementById('end-day-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyPage = document.getElementById('history-page');
    // const mainTodoListContainer = todoList.parentElement; // Not strictly needed if hiding individual elements
    const backToMainBtn = document.getElementById('back-to-main-btn');
    const datesList = document.getElementById('dates-list');
    const archivedTasksList = document.getElementById('archived-tasks-list');
    const selectedHistoryDateSpan = document.getElementById('selected-history-date');

    // Ensure all essential elements exist before proceeding
    if (!todoInput || !addTodoBtn || !todoList || !endDayBtn || !historyBtn || !historyPage || !backToMainBtn || !datesList || !archivedTasksList || !selectedHistoryDateSpan) {
        console.error('One or more essential to-do list elements are missing from the DOM.');
        return;
    }

    loadTodos();

    // --- History Page Logic ---
    function showMainPage() {
        if (historyPage) historyPage.style.display = 'none';
        // Show main app elements. Assumes they are children of appContainer which is already visible.
        if (document.getElementById('todo-input')) document.getElementById('todo-input').style.display = '';
        if (document.getElementById('add-todo-btn')) document.getElementById('add-todo-btn').style.display = '';
        if (document.getElementById('todo-list')) document.getElementById('todo-list').style.display = '';
        if (document.getElementById('end-day-btn')) document.getElementById('end-day-btn').style.display = '';
        if (document.getElementById('history-btn')) document.getElementById('history-btn').style.display = '';
        if (document.querySelector('h1')) document.querySelector('h1').style.display = ''; // Show the main H1 for the to-do list

        if (datesList) datesList.innerHTML = '';
        if (archivedTasksList) archivedTasksList.innerHTML = '';
        if (selectedHistoryDateSpan) selectedHistoryDateSpan.textContent = '';
    }

    function displayArchivedList(date) {
        if (!selectedHistoryDateSpan || !archivedTasksList) return;

        selectedHistoryDateSpan.textContent = date;
        archivedTasksList.innerHTML = '';

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
            li.textContent = task.text;
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
        if (historyPage) historyPage.style.display = 'block';
        // Hide main app elements
        if (document.getElementById('todo-input')) document.getElementById('todo-input').style.display = 'none';
        if (document.getElementById('add-todo-btn')) document.getElementById('add-todo-btn').style.display = 'none';
        if (document.getElementById('todo-list')) document.getElementById('todo-list').style.display = 'none';
        if (document.getElementById('end-day-btn')) document.getElementById('end-day-btn').style.display = 'none';
        if (document.getElementById('history-btn')) document.getElementById('history-btn').style.display = 'none';
         // Optionally hide the main H1 of the to-do list or change its text
        if (document.querySelector('h1')) document.querySelector('h1').style.display = 'none';


        if (!datesList) return;
        datesList.innerHTML = '';

        let historyFound = false;
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('history_')) {
                    historyFound = true;
                    const dateString = key.substring('history_'.length);
                    const dateLi = document.createElement('li');
                    dateLi.textContent = dateString;
                    dateLi.dataset.date = dateString;
                    dateLi.style.cursor = 'pointer';
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
            return;
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
        const month = String(today.getMonth() + 1).padStart(2, '0');
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
        }

        todoList.innerHTML = '';
        alert('Day ended. Your list has been archived.');
    }

    function addTodoItem() {
        const todoText = todoInput.value.trim();

        if (todoText === '') {
            alert('To-do item cannot be empty!');
            return;
        }

        const listItem = document.createElement('li');
        const textSpan = document.createElement('span');
        textSpan.textContent = todoText;
        listItem.appendChild(textSpan);

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete-btn');
        completeButton.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            let storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
            const todoIndex = storedTodos.findIndex(item => item.text === todoText);
            if (todoIndex > -1) {
                storedTodos[todoIndex].completed = listItem.classList.contains('completed');
                localStorage.setItem('todos', JSON.stringify(storedTodos));
            }
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        removeButton.addEventListener('click', () => {
            todoList.removeChild(listItem);
            let storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
            const updatedTodos = storedTodos.filter(item => item.text !== todoText);
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
        });

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.appendChild(completeButton);
        buttonsWrapper.appendChild(removeButton);
        listItem.appendChild(buttonsWrapper);

        todoList.appendChild(listItem);
        todoInput.value = '';

        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push({ text: todoText, completed: false });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        // const todoList = document.getElementById('todo-list'); // Already defined
        let todos = JSON.parse(localStorage.getItem('todos')) || [];

        if (todos.length === 0) {
            return;
        }

        todos.forEach((todo) => {
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
                let storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
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
                let storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
                const updatedTodos = storedTodos.filter(item => item.text !== todo.text);
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

    // Dark Mode Functionality is now primarily handled by auth.js
    // No need for redundant listeners or initial theme setting here.

    // Initial setup for the page
    showMainPage(); // Show the main to-do list part within the app-container by default
});
