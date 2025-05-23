document.addEventListener('DOMContentLoaded', () => {
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
});
