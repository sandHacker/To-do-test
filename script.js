document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');

    loadTodos(); // Call loadTodos after todoList is defined

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
