document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');

    function addTodoItem() {
        const todoText = todoInput.value.trim();

        if (todoText === '') {
            alert('To-do item cannot be empty!');
            return; // Do not add empty to-do items
        }

        const listItem = document.createElement('li');
        listItem.textContent = todoText;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete-btn'); // Add a class for styling if needed
        completeButton.addEventListener('click', () => {
            listItem.classList.toggle('completed');
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn'); // Add a class for styling if needed
        removeButton.addEventListener('click', () => {
            todoList.removeChild(listItem);
        });

        const buttonsWrapper = document.createElement('div'); // To group buttons
        buttonsWrapper.appendChild(completeButton);
        buttonsWrapper.appendChild(removeButton);
        listItem.appendChild(buttonsWrapper);

        todoList.appendChild(listItem);
        todoInput.value = ''; // Clear the input field
    }

    addTodoBtn.addEventListener('click', addTodoItem);

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
});
