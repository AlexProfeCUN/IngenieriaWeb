import React, { useEffect, useState } from "react";

const STORAGE_KEY = "codeflow-classroom-tasks";

const starterTasks = [
  {
    id: 12,
    title: "Diseñar la pantalla de bienvenida",
    description: "Crear una primera propuesta para presentar el proyecto.",
    branch: "feat/pantalla-bienvenida",
    label: "Diseño",
    status: "todo",
  },
  {
    id: 13,
    title: "Crear el componente de tarjeta",
    description: "Mostrar título, descripción y estado de cada actividad.",
    branch: "feat/task-card",
    label: "Frontend",
    status: "doing",
  },
  {
    id: 14,
    title: "Agregar guía de contribución",
    description: "Explicar cómo crear una rama y abrir un pull request.",
    branch: "docs/contributing",
    label: "Documentación",
    status: "review",
  },
  {
    id: 15,
    title: "Publicar la primera versión",
    description: "Integrar los cambios revisados en la rama principal.",
    branch: "release/v1",
    label: "Entrega",
    status: "done",
  },
];

const columns = [
  { id: "todo", title: "Por hacer", icon: "○", tone: "slate" },
  { id: "doing", title: "En desarrollo", icon: "◒", tone: "blue" },
  { id: "review", title: "En revisión", icon: "◷", tone: "violet" },
  { id: "done", title: "Completado", icon: "✓", tone: "green" },
];

const workflow = [
  { number: "01", title: "Issue", detail: "Define el trabajo" },
  { number: "02", title: "Rama", detail: "Aísla tus cambios" },
  { number: "03", title: "Pull request", detail: "Pide una revisión" },
  { number: "04", title: "Merge", detail: "Integra el cambio" },
];

function loadTasks() {
  const savedTasks = window.localStorage.getItem(STORAGE_KEY);
  if (!savedTasks) return starterTasks;

  try {
    const parsedTasks = JSON.parse(savedTasks);
    return Array.isArray(parsedTasks) ? parsedTasks : starterTasks;
  } catch {
    return starterTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      setNotice("No se pudieron guardar los cambios en este navegador.");
    }
  }, [tasks]);

  const completedTasks = tasks.filter((task) => task.status === "done").length;

  function moveTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) return task;
        const currentIndex = columns.findIndex(
          (column) => column.id === task.status,
        );
        const nextColumn = columns[currentIndex + 1];
        return nextColumn ? { ...task, status: nextColumn.id } : task;
      }),
    );
    setNotice("Actividad movida al siguiente paso del flujo.");
  }

  function addTask(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();

    if (!title) return;

    const branch = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: Date.now(),
        title,
        description: description || "Nueva actividad del equipo.",
        branch: `feat/${branch || "nueva-actividad"}`,
        label: "Nueva tarea",
        status: "todo",
      },
    ]);
    setIsFormOpen(false);
    setNotice("Actividad agregada al tablero.");
  }

  function resetBoard() {
    setTasks(starterTasks);
    setNotice("El tablero volvió a los datos de ejemplo.");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#inicio" aria-label="CodeFlow, inicio">
          <span className="brand-mark" aria-hidden="true">
            {"</>"}
          </span>
          <span>
            <strong>codeflow</strong>
            <small>LABORATORIO DE CLASE</small>
          </span>
        </a>

        <div className="workspace-label">ESPACIO DE TRABAJO</div>
        <button className="workspace-switcher" type="button">
          <span className="workspace-avatar">IW</span>
          <span className="workspace-copy">
            <strong>Ingeniería Web</strong>
            <small>Grupo de clase</small>
          </span>
          <span className="switcher-chevron" aria-hidden="true">⌄</span>
        </button>

        <nav className="sidebar-nav" aria-label="Navegación principal">
          <a className="nav-link active" href="#tablero">
            <span aria-hidden="true">▦</span> Tablero
          </a>
          <a className="nav-link" href="#flujo">
            <span aria-hidden="true">⌘</span> Flujo de GitHub
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="tip-card">
            <span className="tip-icon" aria-hidden="true">✳</span>
            <strong>Un cambio a la vez</strong>
            <p>Las ramas ayudan a trabajar en equipo sin interferir.</p>
            <code>git switch -c feat/mi-cambio</code>
          </div>
          <div className="profile">
            <span className="profile-avatar">AP</span>
            <span className="profile-copy">
              <strong>Alex Profe</strong>
              <small>Docente</small>
            </span>
            <span className="profile-menu" aria-hidden="true">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Ingeniería Web</span>
            <span className="breadcrumb-divider">/</span>
            <strong>Tablero</strong>
          </div>
          <div className="topbar-actions">
            <span className="live-status"><span /> Proyecto de práctica</span>
            <button
              className="avatar-stack"
              type="button"
              aria-label="Equipo de clase"
              title="Equipo de clase"
            >
              <span>AP</span><span>MJ</span><span>+3</span>
            </button>
            <button className="icon-button" type="button" aria-label="Ayuda">?</button>
          </div>
        </header>

        <div className="page-content" id="tablero">
          <section className="intro">
            <div>
              <div className="eyebrow"><span /> PROYECTO DE CLASE</div>
              <h1>Construyamos en equipo pero en serio<span>.</span></h1>
              <p className="intro-copy">
                Practica el flujo de trabajo colaborativo con Git y GitHub.
                Cada tarjeta es un cambio que el equipo puede seguir de principio a fin.
              </p>
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={() => setIsFormOpen(true)}
            >
              <span aria-hidden="true">＋</span> Nueva actividad
            </button>
          </section>

          <section className="stats-grid" aria-label="Resumen del tablero">
            <article className="stat-card">
              <span className="stat-icon stat-icon-blue" aria-hidden="true">▤</span>
              <div><span className="stat-label">Actividades</span><strong>{tasks.length}</strong></div>
              <span className="stat-note">en el tablero</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-icon-violet" aria-hidden="true">⌘</span>
              <div><span className="stat-label">En progreso</span><strong>{tasks.filter((task) => task.status === "doing").length}</strong></div>
              <span className="stat-note">en una rama</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-icon-amber" aria-hidden="true">◷</span>
              <div><span className="stat-label">Por revisar</span><strong>{tasks.filter((task) => task.status === "review").length}</strong></div>
              <span className="stat-note">pull requests</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-icon-green" aria-hidden="true">✓</span>
              <div><span className="stat-label">Completadas</span><strong>{completedTasks}</strong></div>
              <span className="stat-note">integradas</span>
            </article>
          </section>

          <section className="workflow-panel" id="flujo" aria-labelledby="workflow-title">
            <div className="workflow-heading">
              <div>
                <span className="section-kicker">DE LA IDEA AL CÓDIGO</span>
                <h2 id="workflow-title">El flujo de trabajo</h2>
              </div>
              <span className="workflow-caption">Así viaja cada cambio por GitHub</span>
            </div>
            <ol className="workflow-steps">
              {workflow.map((step, index) => (
                <li className="workflow-step" key={step.number}>
                  <span className={`step-number step-${index + 1}`}>{step.number}</span>
                  <span className="step-copy"><strong>{step.title}</strong><small>{step.detail}</small></span>
                  {index < workflow.length - 1 && <span className="step-connector" aria-hidden="true">→</span>}
                </li>
              ))}
            </ol>
          </section>

          <section className="board-section" aria-labelledby="board-title">
            <div className="board-heading">
              <div>
                <h2 id="board-title">Actividades del proyecto</h2>
                <span className="board-subtitle">Sigue cada tarea desde el issue hasta el merge.</span>
              </div>
              <button className="text-button" type="button" onClick={resetBoard}>
                Restaurar ejemplo
              </button>
            </div>
            <div className="board">
              {columns.map((column) => {
                const columnTasks = tasks.filter((task) => task.status === column.id);
                return (
                  <section className="board-column" key={column.id} aria-label={`${column.title}, ${columnTasks.length} actividades`}>
                    <div className="column-heading">
                      <span className={`column-indicator ${column.tone}`}>{column.icon}</span>
                      <h3>{column.title}</h3>
                      <span className="task-count">{columnTasks.length}</span>
                      <button
                        className="column-add"
                        type="button"
                        onClick={() => setIsFormOpen(true)}
                        aria-label={`Agregar actividad en ${column.title}`}
                      >＋</button>
                    </div>
                    <div className="task-list">
                      {columnTasks.map((task) => {
                        const nextColumn = columns[columns.findIndex((item) => item.id === task.status) + 1];
                        return (
                          <article className="task-card" key={task.id}>
                            <div className="task-card-top">
                              <span className={`task-label label-${column.tone}`}>{task.label}</span>
                              <span className="issue-number">#{task.id}</span>
                            </div>
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <div className="branch-chip">
                              <span aria-hidden="true">⑂</span>
                              <code>{task.branch}</code>
                            </div>
                            <div className="task-card-footer">
                              <span className="task-avatar" aria-label="Asignada al equipo">E</span>
                              {nextColumn ? (
                                <button
                                  className="move-button"
                                  type="button"
                                  onClick={() => moveTask(task.id)}
                                  aria-label={`Mover ${task.title} a ${nextColumn.title}`}
                                >
                                  Mover <span aria-hidden="true">→</span>
                                </button>
                              ) : (
                                <span className="merged-label"><span aria-hidden="true">✓</span> Integrado</span>
                              )}
                            </div>
                          </article>
                        );
                      })}
                      {columnTasks.length === 0 && (
                        <div className="empty-column">Las actividades aparecerán aquí.</div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
          <footer className="page-footer">
            <span>Hecho para aprender, colaborar y compartir.</span>
            <span>Laboratorio de Ingeniería Web <span className="footer-dot">·</span> MVP 1.0</span>
          </footer>
        </div>
      </main>

      {isFormOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsFormOpen(false);
        }}>
          <section
            className="activity-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-heading">
              <div>
                <span className="section-kicker">NUEVO ISSUE</span>
                <h2 id="modal-title">Crear una actividad</h2>
              </div>
              <button
                className="icon-button modal-close"
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Cerrar"
              >×</button>
            </div>
            <p className="modal-copy">Describe un cambio pequeño que el equipo pueda desarrollar en una rama.</p>
            <form onSubmit={addTask}>
              <label htmlFor="activity-title">Título</label>
              <input
                id="activity-title"
                name="title"
                placeholder="Ej. Agregar formulario de contacto"
                maxLength="90"
                required
                autoFocus
              />
              <label htmlFor="activity-description">Descripción</label>
              <textarea
                id="activity-description"
                name="description"
                placeholder="¿Qué resultado esperamos?"
                rows="3"
                maxLength="180"
              />
              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={() => setIsFormOpen(false)}>Cancelar</button>
                <button className="primary-button" type="submit">Crear actividad</button>
              </div>
            </form>
          </section>
        </div>
      )}
      <div className="sr-only" aria-live="polite">{notice}</div>
    </div>
  );
}

export default App;
