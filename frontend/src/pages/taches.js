import React, { useEffect, useState } from "react";
import axios from "axios";

function Taches() {
    const [tasks, setTasks] = useState([]);              // only array of tasks
    const [newTask, setNewTask] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskText, setEditTaskText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // pagination data coming from DRF
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);
    const [count, setCount] = useState(0);

    const API_BASE = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("access");

    // --------------------------------------------------------------------------
    // Load tasks (defaults to first page)
    // --------------------------------------------------------------------------
    const fetchTasks = async (url = `${API_BASE}/tasks/`) => {
        if (!token) return;
        try {
            setLoading(true);
            setError("");
            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(data.results || []);       // protect against undefined
            setNextUrl(data.next);
            setPrevUrl(data.previous);
            setCount(data.count);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger les tâches.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTasks();
    }, [token]);

    // --------------------------------------------------------------------------
    // CRUD
    // --------------------------------------------------------------------------
    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            setLoading(true);
            setError("");
            const { data } = await axios.post(
                `${API_BASE}/tasks/`,
                { task: newTask },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // refresh list from first page so pagination stays in sync
            await fetchTasks();
            setNewTask("");
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l’ajout.");
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
        try {
            await axios.delete(`${API_BASE}/tasks/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTasks();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la suppression.");
        }
    };

    const startEditing = (task) => {
        setEditingTask(task);
        setEditTaskText(task.task);
    };

    const cancelEditing = () => {
        setEditingTask(null);
        setEditTaskText("");
    };

    const saveEdit = async () => {
        if (!editTaskText.trim()) return;
        try {
            await axios.put(
                `${API_BASE}/tasks/${editingTask.id}/`,
                { task: editTaskText, done: editingTask.done },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
            cancelEditing();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la modification.");
        }
    };

    const toggleDone = async (task) => {
        try {
            const url = task.done
                ? `${API_BASE}/tasks/${task.id}/mark_pending/`
                : `${API_BASE}/tasks/${task.id}/mark_complete/`;

            await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchTasks();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la mise à jour du statut.");
        }
    };

    // --------------------------------------------------------------------------
    // RENDER
    // --------------------------------------------------------------------------
    if (!token) return <p>Vous devez être connecté pour voir vos tâches.</p>;

    return (
        <div className="container mt-5">
            <h3 className="mb-3">Mes Tâches</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <p>Chargement...</p>}

            {/* add new */}
            <form onSubmit={addTask} className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Nouvelle tâche"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#7C3AED", color: "white" }}
                >
                    Ajouter
                </button>
            </form>

            {/* tasks */}
            <ul className="list-group">
                {Array.isArray(tasks) &&
                    tasks.map((task) => (
                        <li
                            key={task.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {editingTask?.id === task.id ? (
                                <input
                                    type="text"
                                    className="form-control me-3"
                                    value={editTaskText}
                                    onChange={(e) => setEditTaskText(e.target.value)}
                                />
                            ) : (
                                <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
                  {task.task}{" "}
                                    {task.done && <span className="badge bg-success ms-2">Terminée</span>}
                </span>
                            )}

                            <div>
                                {editingTask?.id === task.id ? (
                                    <>
                                        <button className="btn btn-sm btn-success me-2" onClick={saveEdit}>
                                            Sauvegarder
                                        </button>
                                        <button className="btn btn-sm btn-secondary me-2" onClick={cancelEditing}>
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={`btn btn-sm me-2 ${task.done ? "btn-warning" : "btn-success"}`}
                                            onClick={() => toggleDone(task)}
                                        >
                                            {task.done ? "En attente" : "Terminer"}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => startEditing(task)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
            </ul>

            {/* pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                <button
                    className="btn"
                    style={{ backgroundColor: "#7C3AED", color: "white" }}
                    onClick={() => prevUrl && fetchTasks(prevUrl)}
                    disabled={!prevUrl}
                >
                    Précédent
                </button>
                <span>{count} tâches au total</span>
                <button
                    className="btn"
                    style={{ backgroundColor: "#7C3AED", color: "white" }}
                    onClick={() => nextUrl && fetchTasks(nextUrl)}
                    disabled={!nextUrl}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}

export default Taches;





