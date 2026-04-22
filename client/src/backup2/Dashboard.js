import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const [selectedTab, setSelectedTab] = useState(null);
    const [packageImage, setPackageImage] = useState('');
    const [packageStatus, setPackageStatus] = useState(''); // Default: no selection
    const [tasks, setTasks] = useState([]);
    const [note, setNote] = useState('lol'); // Default message before input

    // Fetch PC Username
    useEffect(() => {
        fetch('/username')
            .then(response => response.json())
            .then(data => setUsername(data.username))
            .catch(error => console.error('Error fetching username:', error));
    }, []);

    // Fetch Package Image when packageStatus changes
    useEffect(() => {
        if (packageStatus) {
            fetch(`/package-status?status=${packageStatus}`)
                .then(response => response.json())
                .then(data => setPackageImage(data.image))
                .catch(error => console.error('Error fetching package status:', error));
        }
    }, [packageStatus]);

    // Fetch Undone Tasks
    const fetchTasks = () => {
        fetch('/undone-tasks')
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error fetching tasks:', error));
    };

    // Handle Tab Switching
    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        if (tab === 'tasks') fetchTasks();
    };

    return (
        <div className="dashboard">
            <h2>Welcome, {username}!</h2>

            {/* Tabs Navigation */}
            <div className="tabs">
                <button onClick={() => handleTabClick('packages')}>Packages</button>
                <button onClick={() => handleTabClick('tasks')}>Tasks</button>
                <button onClick={() => handleTabClick('notes')}>Notes</button>
            </div>

            {/* Packages Tab */}
            {selectedTab === 'packages' && (
                <div id="packages" className="tab-content">
                    <select onChange={(e) => setPackageStatus(e.target.value)}>
                        <option value="">Select status</option>
                        <option value="arrived">Arrived (yay!!!!)</option>
                        <option value="notArrived">Not arrived (??)</option>
                    </select>
                    <div className="result">
                        <img src={packageImage || '/image/default.png'} alt="Package status" />
                    </div>
                </div>
            )}

            {/* Tasks Tab */}
            {selectedTab === 'tasks' && (
                <div id="tasks" className="tab-content">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Task</th>
                                <th>Importance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.id}</td>
                                    <td>{task.task}</td>
                                    <td>{task.importance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Notes Tab */}
            {selectedTab === 'notes' && (
                <div id="notes" className="tab-content">
                    <input
                        type="text"
                        placeholder="Write a note..."
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <p>
                        <b>Here's the note of the day:</b> <span>{note}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
