import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminTaches() {
    const [taches, setTaches] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskText, setEditTaskText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // pagination state from API
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    const API_BASE = "http://127.0.0.1:8000/api";
    const PAGE_SIZE = 10; // keep in sync with Django PAGE_SIZE

    // ---- Verify admin and load page 1 ----
    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) return navigate("/login");

        const checkAdmin = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_BASE}/user/me/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // The backend returns "est_admin" in MeView
                if (!data.est_admin) return navigate("/taches");
                await fetchTasks(1);
            } catch (err) {
                console.error(err);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    // ---- Fetch one page from the API ----
    const fetchTasks = async (page = 1) => {
        const token = localStorage.getItem("access");
        if (!token) return;
        try {
            setLoading(true);
            setError("");
            const { data } = await axios.get(`${API_BASE}/tasks/?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // DRF pagination format
            setTaches(data.results || []);
            setCurrentPage(page);
            setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE) || 1);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger les tâches.");
        } finally {
            setLoading(false);
        }
    };

    // ---- Add task (then reload page 1 so the newest shows first) ----
    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const token = localStorage.getItem("access");

        try {
            setLoading(true);
            setError("");
            await axios.post(
                `${API_BASE}/tasks/`,
                { task: newTask, done: false },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewTask("");
            // Your queryset is ordered by -created_at for admins, so new task is on page 1
            fetchTasks(1);
        } catch (err) {
            console.error(err);
            setError("Échec de l’ajout de la tâche.");
        } finally {
            setLoading(false);
        }
    };

    // ---- Edit flow ----
    const startEditing = (task) => {
        setEditingTask(task);
        setEditTaskText(task.task);
    };
    const cancelEditing = () => {
        setEditingTask(null);
        setEditTaskText("");
    };
    const saveEdit = async () => {
        if (!editTaskText.trim() || !editingTask) return;
        const token = localStorage.getItem("access");

        try {
            setLoading(true);
            await axios.put(
                `${API_BASE}/tasks/${editingTask.id}/`,
                { task: editTaskText, done: editingTask.done },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingTask(null);
            setEditTaskText("");
            fetchTasks(currentPage); // stay on the same page
        } catch (err) {
            console.error(err);
            setError("Échec de la modification.");
        } finally {
            setLoading(false);
        }
    };

    // ---- Delete (handle empty-last-page edge case) ----
    const deleteTask = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
        const token = localStorage.getItem("access");

        try {
            setLoading(true);
            setError("");
            await axios.delete(`${API_BASE}/tasks/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // If we deleted the last item on the page and not on page 1, go back a page
            const nextPage =
                taches.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            fetchTasks(nextPage);
        } catch (err) {
            console.error(err);
            setError("Échec de la suppression.");
            fetchTasks(currentPage);
        } finally {
            setLoading(false);
        }
    };

    // ---- Toggle status (optimistic) ----
    const toggleStatus = async (task) => {
        const token = localStorage.getItem("access");
        const updated = !task.done;

        // optimistic UI
        setTaches((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, done: updated } : t))
        );

        try {
            await axios.patch(
                `${API_BASE}/tasks/${task.id}/`,
                { done: updated },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error(err);
            setError("Échec de la mise à jour du statut.");
            fetchTasks(currentPage); // rollback by refetch
        }
    };

    // ---- Pagination controls ----
    const nextPage = () => {
        if (currentPage < totalPages) fetchTasks(currentPage + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) fetchTasks(currentPage - 1);
    };
    const goToPage = (page) => fetchTasks(page);

    if (loading && taches.length === 0) {
        return <div className="container mt-5">Chargement…</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Admin – Gestion Des Tâches</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* --- New Task Form --- */}
            <form onSubmit={addTask} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nouvelle tâche"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        className="btn text-white"
                        style={{ backgroundColor: "#7C3AED" }}
                        type="submit"
                        disabled={loading}
                    >
                        Ajouter
                    </button>
                </div>
            </form>

            {/* --- Task List --- */}
            <ul className="list-group">
                {taches.map((tache) => (
                    <li
                        key={tache.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        {editingTask && editingTask.id === tache.id ? (
                            <input
                                type="text"
                                className="form-control me-3"
                                value={editTaskText}
                                onChange={(e) => setEditTaskText(e.target.value)}
                            />
                        ) : (
                            <span style={{ textDecoration: tache.done ? "line-through" : "none" }}>
                {tache.task}{" "}
                                {tache.done && <span className="badge bg-success ms-2">Terminée</span>}
              </span>
                        )}

                        <div>
                            {editingTask && editingTask.id === tache.id ? (
                                <>
                                    <button className="btn btn-sm btn-success me-2" onClick={saveEdit}>
                                        Sauvegarder
                                    </button>
                                    <button className="btn btn-sm btn-secondary me-2" onClick={cancelEditing}>
                                        Annuler
                                    </button>
                                </>
                            ) : (
                                <div className="d-flex flex-wrap gap-1">
                                    <button
                                        className="btn btn-sm text-white"
                                        style={{ backgroundColor: "#22C55E", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                                        onClick={() => toggleStatus(tache)}
                                    >
                                        {tache.done ? "En attente" : "Terminer"}
                                    </button>

                                    <button
                                        className="btn btn-sm text-white"
                                        style={{ backgroundColor: "#3B82F6", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                                        onClick={() => startEditing(tache)}
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        className="btn btn-sm text-white"
                                        style={{ backgroundColor: "#EF4444", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                                        onClick={() => deleteTask(tache.id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* --- Pagination --- */}
            <nav className="mt-4">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link text-white"
                            style={{ backgroundColor: "#7C3AED", borderColor: "#7C3AED" }}
                            onClick={prevPage}
                        >
                            Précédent
                        </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                            <button
                                className="page-link text-white"
                                style={{
                                    backgroundColor: currentPage === page ? "#5B21B6" : "#7C3AED",
                                    borderColor: "#7C3AED",
                                }}
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                            className="page-link text-white"
                            style={{ backgroundColor: "#7C3AED", borderColor: "#7C3AED" }}
                            onClick={nextPage}
                        >
                            Suivant
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default AdminTaches;
