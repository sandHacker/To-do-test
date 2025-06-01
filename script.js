// script.js
document.addEventListener('DOMContentLoaded', () => {

    const appContainer = document.getElementById('app-container');
    if (!appContainer || appContainer.style.display === 'none') {
        console.log('User not logged in or app container not visible. To-Do list not initialized.');
        return;
    }
    console.log('User logged in. Initializing To-Do list.');


    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    const endDayBtn = document.getElementById('end-day-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyPage = document.getElementById('history-page');

    const backToMainBtn = document.getElementById('back-to-main-btn');
    const datesList = document.getElementById('dates-list');
    const archivedTasksList = document.getElementById('archived-tasks-list');
    const selectedHistoryDateSpan = document.getElementById('selected-history-date');


    let draggedItem = null; // To store the item being dragged

    if (!todoInput || !addTodoBtn || !todoList || !endDayBtn || !historyBtn || !historyPage || !backToMainBtn || !datesList || !archivedTasksList || !selectedHistoryDateSpan) {
        console.error('One or more essential to-do list elements are missing from the DOM.');
        return;
    }

    // Helper functions for storage
    function getTodosFromStorage() {
        return JSON.parse(localStorage.getItem('todos')) || [];
    }

    function saveTodosToStorage(todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Update functions for complete/remove to use ID
    function updateTodoStatus(todoId, isCompleted) {
        let todos = getTodosFromStorage();
        const todoIndex = todos.findIndex(item => item.id === todoId);
        if (todoIndex > -1) {
            todos[todoIndex].completed = isCompleted;
            saveTodosToStorage(todos);
        }
    }

    function removeTodoItem(todoId, listItemElement) {
        if (listItemElement && listItemElement.parentNode === todoList) {
            todoList.removeChild(listItemElement);
        } else {
            // Fallback if listItemElement is not correct, though it should be.
            const itemToRemove = todoList.querySelector(`[data-id="${todoId}"]`);
            if (itemToRemove) {
                todoList.removeChild(itemToRemove);
            }
        }
        let todos = getTodosFromStorage();
        todos = todos.filter(item => item.id !== todoId);
        saveTodosToStorage(todos);
    }

    // Common logic for creating a list item
    function createTodoListItem(todo) {
        const listItem = document.createElement('li');
        listItem.draggable = true;
        listItem.dataset.id = todo.id;

        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        listItem.appendChild(textSpan);

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete-btn');
        completeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            listItem.classList.toggle('completed');
            updateTodoStatus(todo.id, listItem.classList.contains('completed'));
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removeTodoItem(todo.id, listItem);
        });

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.appendChild(completeButton);
        buttonsWrapper.appendChild(removeButton);
        listItem.appendChild(buttonsWrapper);

        if (todo.completed) {
            listItem.classList.add('completed');
        }

        // Event Listeners for Drag & Drop
        listItem.addEventListener('dragstart', handleDragStart);
        listItem.addEventListener('dragover', handleDragOver);
        listItem.addEventListener('dragenter', handleDragEnter);
        listItem.addEventListener('dragleave', handleDragLeave);
        listItem.addEventListener('drop', handleDrop);
        listItem.addEventListener('dragend', handleDragEnd);

        return listItem;
    }

    // Modify addTodoItem to use createTodoListItem
    function addTodoItem() {
        const todoText = todoInput.value.trim();
        if (todoText === '') {
            alert('To-do item cannot be empty!');
            return;
        }

        const newTodo = {
            text: todoText,
            completed: false,
            id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };

        const listItem = createTodoListItem(newTodo);
        todoList.appendChild(listItem);

        let todos = getTodosFromStorage();
        todos.push(newTodo);
        saveTodosToStorage(todos);

        todoInput.value = '';
    }

    // Modify loadTodos to use createTodoListItem
    function loadTodos() {
        let todos = getTodosFromStorage(); // Make sure to get mutable copy if needed for ID assignment
        todoList.innerHTML = '';
        let updated = false;
        todos.forEach(todo => {
            if (!todo.id) {
                todo.id = 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + todos.indexOf(todo);
                updated = true; // Mark that an ID was generated
            }
            const listItem = createTodoListItem(todo);
            todoList.appendChild(listItem);
        });
        if(updated) {
            saveTodosToStorage(todos);
        }
    }

    // Drag-and-Drop Handler Functions
    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        // Firefox requires dataTransfer to be set for drag to work
        e.dataTransfer.setData('text/plain', this.dataset.id);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (this !== draggedItem) {
            this.classList.add('drag-over');
        }
    }

    function handleDragEnter(e) {
        e.preventDefault();
        if (this !== draggedItem) {
            this.classList.add('drag-over');
        }
    }

    function handleDragLeave(e) {
        // Do not remove 'drag-over' if leaving to enter a child of this element
        if (e.relatedTarget && this.contains(e.relatedTarget)) {
            return;
        }
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        this.classList.remove('drag-over');
        if (draggedItem === null || this === draggedItem) {
            // Clean up classes on draggedItem if it exists (e.g. if dropped on itself or invalid target)
            if(draggedItem) draggedItem.classList.remove('dragging');
            draggedItem = null;
            return;
        }

        const draggedItemId = draggedItem.dataset.id;
        const targetItemId = this.dataset.id;

        let todos = getTodosFromStorage();
        const draggedItemIndex = todos.findIndex(todo => todo.id === draggedItemId);
        const targetItemIndex = todos.findIndex(todo => todo.id === targetItemId);

        if (draggedItemIndex === -1 || targetItemIndex === -1) {
            console.error("Could not find dragged or target item in todos array.");
            if(draggedItem) draggedItem.classList.remove('dragging');
            draggedItem = null;
            return;
        }

        const [reorderedItem] = todos.splice(draggedItemIndex, 1);
        todos.splice(targetItemIndex, 0, reorderedItem);

        saveTodosToStorage(todos);
        // Instead of full loadTodos(), which rebuilds all DOM, manipulate DOM directly for smoother UX
        // todoList.insertBefore(draggedItem, this.nextSibling === draggedItem ? this : this.nextSibling);
        // For simplicity and data integrity with localStorage as source of truth, full reload is safer for now.
        loadTodos();

        // Ensure dragging class is removed from the original item after drop
        // This is handled in handleDragEnd, but good to be sure.
        // The original draggedItem DOM element is destroyed by loadTodos(), so no need to remove class from it.
        draggedItem = null; // Reset draggedItem
    }

    function handleDragEnd(e) {
        // This event fires on the source element after drag is complete.
        // The 'dragging' class should be removed from the original dragged item if it still exists.
        // However, if loadTodos() is called in handleDrop, the original DOM element is gone.
        // If loadTodos() is NOT called, then this is important:
        // if (draggedItem) { // draggedItem here refers to the original DOM element
        //    draggedItem.classList.remove('dragging');
        // }

        // Clean up 'drag-over' from all items
        document.querySelectorAll('#todo-list li').forEach(item => {
            item.classList.remove('drag-over');
        });
        // Clean up 'dragging' from any item that might still have it (e.g., if drop failed or was on invalid target)
        const stillDragging = document.querySelector('.dragging');
        if (stillDragging) {
            stillDragging.classList.remove('dragging');
        }
        draggedItem = null; // Reset in all cases
    }

    // --- History Page Logic ---
    function showMainPage() {
        if (historyPage) historyPage.style.display = 'none';

        if (document.getElementById('todo-input')) document.getElementById('todo-input').style.display = '';
        if (document.getElementById('add-todo-btn')) document.getElementById('add-todo-btn').style.display = '';
        if (document.getElementById('todo-list')) document.getElementById('todo-list').style.display = '';
        if (document.getElementById('end-day-btn')) document.getElementById('end-day-btn').style.display = '';
        if (document.getElementById('history-btn')) document.getElementById('history-btn').style.display = '';

        const mainH1 = document.querySelector('#app-container > h1'); // More specific selector for the main H1
        if (mainH1) mainH1.style.display = '';



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

        if (document.getElementById('todo-input')) document.getElementById('todo-input').style.display = 'none';
        if (document.getElementById('add-todo-btn')) document.getElementById('add-todo-btn').style.display = 'none';
        if (document.getElementById('todo-list')) document.getElementById('todo-list').style.display = 'none';
        if (document.getElementById('end-day-btn')) document.getElementById('end-day-btn').style.display = 'none';
        if (document.getElementById('history-btn')) document.getElementById('history-btn').style.display = 'none';

        const mainH1 = document.querySelector('#app-container > h1'); // More specific selector for the main H1
        if (mainH1) mainH1.style.display = 'none';



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
        let currentTodos = getTodosFromStorage();
        if (currentTodos.length > 0) {
            try {
                localStorage.setItem(`history_${dateString}`, JSON.stringify(currentTodos));
            } catch (e) {
                console.error('Error saving history to localStorage:', e);
                alert('Error saving history. Your current list might not be archived.');
                return;
            }
        }

        saveTodosToStorage([]); // Clear current todos

        todoList.innerHTML = '';
        alert('Day ended. Your list has been archived.');
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


    // Initial setup
    loadTodos(); // Load existing todos
    showMainPage(); // Show the main to-do list part by default

});
