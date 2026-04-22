document.addEventListener('DOMContentLoaded', () => {
    fetchUsername();
    setupTabs();
    document.getElementById('packageStatus').addEventListener('change', fetchPackageStatus);
    document.getElementById('saveNote').addEventListener('click', updateNote);

    // Hide all tabs on load
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');

    // Remove active tab styling on load
    document.querySelectorAll('.tabs button').forEach(button => button.classList.remove('active'));
});

// Fetch PC Username
function fetchUsername() {
    fetch('/username')
        .then(response => response.json())
        .then(data => {
            document.getElementById('pcUsername').textContent = data.username;
        })
        .catch(error => console.error('Error fetching username:', error));
}

// Fetch package image
function fetchPackageStatus() {
    const status = document.getElementById('packageStatus').value;
    fetch(`/package-status?status=${status}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('packageImage').src = data.image;
        })
        .catch(error => console.error('Error fetching package status:', error));
}

// Fetch undone tasks
function fetchTasks() {
    fetch('/undone-tasks')
        .then(response => response.json())
        .then(tasks => {
            const table = document.getElementById('tasksTable');
            table.innerHTML = "<tr><th>ID</th><th>Task</th><th>Importance</th></tr>";
            tasks.forEach(task => {
                table.innerHTML += `<tr><td>${task.id}</td><td>${task.task}</td><td>${task.importance}</td></tr>`;
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// Update self-deprecating note
function updateNote() {
    const note = document.getElementById('noteInput').value;
    document.getElementById('noteDisplay').textContent = note || 'lol'; // Default to "lol" if empty
}

// Tab switching with active class
function setupTabs() {
    const tabs = document.querySelectorAll('.tabs button');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');

            // Show the selected tab content
            const targetTab = document.getElementById(tab.dataset.tab);
            if (targetTab) targetTab.style.display = 'block';

            // Remove active class from all buttons, then add to clicked one
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Fetch tasks only when the "tasks" tab is clicked
            if (tab.dataset.tab === 'tasks') fetchTasks();
        });
    });
}
