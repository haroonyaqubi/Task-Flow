import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

function TaskList({ isAdmin = false }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ✅ Updated API base to match Django router
    const apiBase = 'http://127.0.0.1:8000/api/tasks/';

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(apiBase);
            setTasks(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        try {
            await axiosInstance.post(apiBase, { task: newTask, done: false });
            setNewTask('');
            fetchTasks();
        } catch (err) {
            console.error(err);
            setError('Failed to add task.');
        }
    };

    const startEditing = (task) => {
        setEditingTask(task);
        setEditTaskText(task.task);
    };

    const cancelEditing = () => {
        setEditingTask(null);
        setEditTaskText('');
    };

    const saveEdit = async () => {
        if (!editTaskText.trim()) return;
        try {
            await axiosInstance.put(`${apiBase}${editingTask.id}/`, {
                task: editTaskText,
                done: editingTask.done
            });
            setEditingTask(null);
            setEditTaskText('');
            fetchTasks();
        } catch (err) {
            console.error(err);
            setError('Failed to update task.');
        }
    };

    const toggleStatus = async (task) => {
        try {
            await axiosInstance.patch(`${apiBase}${task.id}/`, { done: !task.done });
            fetchTasks();
        } catch (err) {
            console.error(err);
            setError('Failed to update status.');
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await axiosInstance.delete(`${apiBase}${taskId}/`);
            fetchTasks();
        } catch (err) {
            console.error(err);
            setError('Failed to delete task.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Add New Task */}
            <form onSubmit={handleAddTask} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nouvelle tâche"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        required
                    />
                    <button className="btn btn-primary" type="submit">Ajouter</button>
                </div>
            </form>

            {/* Task List */}
            <ul className="list-group">
                {tasks.map((task) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {editingTask && editingTask.id === task.id ? (
                            <input
                                type="text"
                                className="form-control me-3"
                                value={editTaskText}
                                onChange={(e) => setEditTaskText(e.target.value)}
                            />
                        ) : (
                            <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                                {task.task} {task.done && <span className="badge bg-success ms-2">Done</span>}
                            </span>
                        )}

                        <div>
                            {editingTask && editingTask.id === task.id ? (
                                <>
                                    <button className="btn btn-sm btn-success me-2" onClick={saveEdit}>Save</button>
                                    <button className="btn btn-sm btn-secondary me-2" onClick={cancelEditing}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className={`btn btn-sm me-2 ${task.done ? 'btn-warning' : 'btn-success'}`}
                                        onClick={() => toggleStatus(task)}
                                    >
                                        {task.done ? 'Pending' : 'Complete'}
                                    </button>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => startEditing(task)}>Edit</button>
                                    {isAdmin && (
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                                    )}
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;
