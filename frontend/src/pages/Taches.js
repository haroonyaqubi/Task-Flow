import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import useTaskFilter from "../hooks/useTaskFilter";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";

function Taches({ isAdmin = false }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //USE CUSTOM HOOK: Filter tasks
  const { filter, setFilter, filteredTasks } = useTaskFilter(tasks);

  // Get token from localStorage
  const token = localStorage.getItem("access");

  // Fetch tasks from backend
  const fetchTasks = async (url = "tasks/") => {
    if (!token) return;
    try {
      setLoading(true);
      setError("");
      const { data } = await axiosInstance.get(url);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les tâches.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when component loads
  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  // Add a new task (ONLY for regular users, not admin)
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      //Create task on server
      const response = await axiosInstance.post("tasks/", { task: newTask });
      const newTaskObj = response.data;

      setTasks(prev => {
        const updated = [newTaskObj, ...prev];
        console.log("Updated tasks list:", updated);
        return updated;
      });

      //Clear input
      setNewTask("");

      //removed: No fetchTasks call here!

    } catch (err) {
      console.error("Error:", err.response?.data || err);
      setError(err.response?.data?.task?.[0] || "Erreur lors de l'ajout.");
    }
  };

  // Delete a task (available for both users and admin)
  const deleteTask = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
    try {
      await axiosInstance.delete(`tasks/${id}/`);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression.");
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
    setEditTaskText(task.task);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTask(null);
    setEditTaskText("");
  };

  // Save edited task
  const saveEdit = async () => {
    if (!editTaskText.trim() || !editingTask) return;
    try {
      await axiosInstance.put(`tasks/${editingTask.id}/`, {
        task: editTaskText,
        done: editingTask.done,
      });
      cancelEditing();
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification.");
    }
  };

  // Toggle task completion status
  const toggleDone = async (task) => {
    try {
      await axiosInstance.patch(`tasks/${task.id}/`, { done: !task.done });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du statut.");
    }
  };

  // Show message if not logged in
  if (!token) return <p className="text-center mt-5">Vous devez être connecté pour voir vos tâches.</p>;

  return (
    <div className="container mt-5">
      <h3 className="mb-3">{isAdmin ? "Tâches Administrateur" : "Mes Tâches"}</h3>

      {/* Admin information message */}
      {isAdmin && (
        <div className="alert alert-info mb-3">
          <strong>Mode Administrateur :</strong> Vous pouvez voir toutes les tâches des utilisateurs.
          Seuls les utilisateurs peuvent ajouter de nouvelles tâches.
        </div>
      )}

      {error && <ErrorDisplay error={error} onClose={() => setError("")} />}

      {loading && <LoadingSpinner text="Chargement des tâches..." />}

      {/* Add task form - only show for normal user not admin */}
      {!isAdmin && (
        <form onSubmit={addTask} className="d-flex mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Nouvelle tâche"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: "#7C3AED", color: "white" }}
            disabled={loading}
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </form>
      )}

      {/* Filter buttons */}
      <div className="btn-group mb-3" role="group">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('all')}
          disabled={loading}
        >
          Toutes
        </button>
        <button
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('pending')}
          disabled={loading}
        >
          En attente
        </button>
        <button
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('completed')}
          disabled={loading}
        >
          Terminées
        </button>
      </div>

      {/* Show message if no tasks */}
      {!loading && tasks.length === 0 && (
        <div className="alert alert-info">
          {isAdmin ? "Aucune tâche trouvée dans le système." : "Aucune tâche trouvée. Ajoutez votre première tâche !"}
        </div>
      )}

      {/* Tasks list - use filteredTasks from custom hook */}
      <ul className="list-group">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {/* Task content - shows edit field if editing */}
            {editingTask?.id === task.id ? (
              <input
                type="text"
                className="form-control me-3"
                value={editTaskText}
                onChange={(e) => setEditTaskText(e.target.value)}
                disabled={loading}
              />
            ) : (
              <div className="d-flex align-items-center">
                <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
                  {task.task}
                </span>
                {/* Show status badge */}
                {task.done && <span className="badge bg-success ms-2">Terminée</span>}
                {!task.done && <span className="badge bg-warning ms-2 text-dark">En attente</span>}
              </div>
            )}

            {/* Task actions */}
            <div>
              {editingTask?.id === task.id ? (
                // Editing mode buttons
                <>
                  <button className="btn btn-sm btn-success me-2" onClick={saveEdit} disabled={loading}>
                    Sauvegarder
                  </button>
                  <button className="btn btn-sm btn-secondary me-2" onClick={cancelEditing} disabled={loading}>
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  {/* Toggle done/pending button */}
                  <button
                    className={`btn btn-sm me-2 ${task.done ? "btn-warning" : "btn-success"}`}
                    onClick={() => toggleDone(task)}
                    disabled={loading}
                  >
                    {task.done ? "En attente" : "Terminer"}
                  </button>

                  {/* Edit button - only for regular users */}
                  {!isAdmin && (
                    <button className="btn btn-sm btn-primary me-2" onClick={() => startEditing(task)} disabled={loading}>
                      Modifier
                    </button>
                  )}

                  {/* Delete button - for BOTH users and admin */}
                  <button
                    className={`btn btn-sm ${isAdmin ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => deleteTask(task.id)}
                    disabled={loading}
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Taches;