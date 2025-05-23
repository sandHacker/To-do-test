# Simple To-Do List Web App

## Description

This is a basic web application that allows users to create, manage, and track their to-do items. Users can add new tasks, mark tasks as completed (which visually styles them, e.g., with a line-through), and remove tasks from the list. The application also prevents users from adding empty or whitespace-only to-do items.

The application is built using HTML, CSS, and vanilla JavaScript.

## Running the Application

To run the application:
1.  Ensure you have all the project files: `index.html`, `style.css`, and `script.js`.
2.  Open the `index.html` file in your preferred web browser.

You can then interact with the to-do list:
- Type a task into the input field.
- Click the "Add To-Do" button or press Enter to add the task to the list.
- Click the "Complete" button next to a task to mark it as completed.
- Click the "Remove" button next to a task to delete it.

## Running the Tests

The application includes a suite of automated tests to verify its functionality. To run these tests:
1.  Ensure you have all the project files, including `tests.html` (and the core application files `index.html`, `style.css`, `script.js` as `tests.html` loads the application in an iframe).
2.  Open the `tests.html` file in your preferred web browser.
3.  The test results will be displayed directly on the page, and more detailed output (including `console.assert` messages) will be available in the browser's developer console.

The tests cover:
- Adding new to-do items.
- Marking items as complete.
- Removing items.
- Preventing the addition of empty items.