import React, { useState, useEffect } from "react";

const FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  INCOMPLETE: "incomplete",
};

const PRIORITIES = {
  ALTA: "alta",
  MEDIA: "media",
  BAJA: "baja",
};

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskCategories, setNewTaskCategories] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState(PRIORITIES.MEDIA);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskText.trim() === "") return;
    const categoriesArray = newTaskCategories
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTaskText.trim(),
        dueDate: newTaskDate || null,
        categories: categoriesArray,
        priority: newTaskPriority,
        completed: false,
      },
    ]);
    setNewTaskText("");
    setNewTaskDate("");
    setNewTaskCategories("");
    setNewTaskPriority(PRIORITIES.MEDIA);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleCompleted = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filtro + búsqueda
  const filteredTasks = tasks.filter((task) => {
    if (filter === FILTERS.COMPLETED && !task.completed) return false;
    if (filter === FILTERS.INCOMPLETE && task.completed) return false;
    if (
      searchTerm &&
      !task.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  // Color segun prioridad para la tarjeta
  const getPriorityClass = (priority) => {
    switch (priority) {
      case PRIORITIES.ALTA:
        return "prioridad-alta";
      case PRIORITIES.MEDIA:
        return "prioridad-media";
      case PRIORITIES.BAJA:
        return "prioridad-baja";
      default:
        return "";
    }
  };

  return (
    <div className="App">
      <h1>Administrador de Tareas</h1>

      <input
        type="text"
        placeholder="Buscar tarea..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <input
        type="text"
        placeholder="Nueva tarea..."
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") addTask();
        }}
      />

      <label>
        Fecha de vencimiento:
        <input
          type="date"
          value={newTaskDate}
          onChange={(e) => setNewTaskDate(e.target.value)}
        />
      </label>

      <label>
        Categorías / etiquetas (separadas por coma):
        <input
          type="text"
          value={newTaskCategories}
          onChange={(e) => setNewTaskCategories(e.target.value)}
          placeholder="Ej: trabajo, urgente, casa"
        />
      </label>

      <label>
        Prioridad:
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
        >
          <option value={PRIORITIES.ALTA}>Alta</option>
          <option value={PRIORITIES.MEDIA}>Media</option>
          <option value={PRIORITIES.BAJA}>Baja</option>
        </select>
      </label>

      <button onClick={addTask} className="btn-agregar">
        Agregar
      </button>

      <div className="filter-buttons">
        <button
          className={filter === FILTERS.ALL ? "active" : ""}
          onClick={() => setFilter(FILTERS.ALL)}
        >
          Todas
        </button>
        <button
          className={filter === FILTERS.INCOMPLETE ? "active" : ""}
          onClick={() => setFilter(FILTERS.INCOMPLETE)}
        >
          Incompletas
        </button>
        <button
          className={filter === FILTERS.COMPLETED ? "active" : ""}
          onClick={() => setFilter(FILTERS.COMPLETED)}
        >
          Completadas
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No hay tareas para mostrar.</p>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`todo-item ${getPriorityClass(task.priority)}`}
          >
            <div className="todo-item-header">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompleted(task.id)}
              />
              <strong
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.text}
              </strong>
              <button onClick={() => deleteTask(task.id)}>Eliminar</button>
            </div>
            {task.dueDate && (
              <small>Vence: {new Date(task.dueDate).toLocaleDateString()}</small>
            )}
            {task.categories.length > 0 && (
              <div className="labels">
                {task.categories.map((cat, i) => (
                  <span key={i}>{cat}</span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
