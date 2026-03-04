import { useState } from 'react';
import { FolderKanban, CheckCircle2, Clock, Users, Filter, Calendar, CheckCircle, XCircle, ClipboardList, FolderOpen, Search } from 'lucide-react';
import { getProjects, getUsers } from '../store';
import { Task } from '../types';

type TaskWithMeta = Task & { projectName: string; projectId: string; columnTitle: string };

function getAllTasksWithMeta(): TaskWithMeta[] {
  const projects = getProjects();
  const result: TaskWithMeta[] = [];
  for (const project of projects) {
    for (const column of project.columns) {
      for (const task of column.tasks) {
        result.push({
          ...task,
          projectName: project.name,
          projectId: project.id,
          columnTitle: column.title,
        });
      }
    }
  }
  return result;
}

function getProjectTaskCount(project: { columns: { tasks: unknown[] }[] }): number {
  return project.columns.reduce((acc, col) => acc + col.tasks.length, 0);
}

function getAssigneeName(assignedToId: string, users: { id: string; name: string }[]): string {
  const user = users.find((u) => u.id === assignedToId);
  return user?.name ?? '—';
}

export function Dashboard() {
  const projects = getProjects();
  const users = getUsers();
  const [filterSearch, setFilterSearch] = useState<string>('');

  const totalProjects = projects.length;
  const allTasksWithMeta = getAllTasksWithMeta();
  const totalTasks = allTasksWithMeta.length;
  const pendingTasks = allTasksWithMeta.filter((t) => t.columnTitle !== 'Producción').length;

  const searchLower = filterSearch.trim().toLowerCase();
  const filteredTasks =
    searchLower === ''
      ? allTasksWithMeta
      : allTasksWithMeta.filter((t) => {
          const name = getAssigneeName(t.assignedTo, users);
          return name.toLowerCase().includes(searchLower);
        });

  // Mostrar las últimas 8 tareas
  const displayedTasks = [...filteredTasks]
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
    .slice(0, 8);

  const hasSearch = filterSearch.trim() !== '';

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const isFulfilled = (columnTitle: string) => columnTitle === 'Producción';

  return (
    <div className="p-5 md:p-6 w-full min-h-full flex flex-col gap-5">
      {/* Header con acento azul */}
      <div className="flex-shrink-0 flex items-center gap-4">
        <div className="h-10 w-1 rounded-full bg-primary shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Resumen general de tus proyectos y tareas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <StatCard
          title="Proyectos"
          value={totalProjects}
          icon={<FolderKanban className="size-6 text-primary" />}
        />
        <StatCard
          title="Tareas totales"
          value={totalTasks}
          icon={<CheckCircle2 className="size-6 text-success" />}
        />
        <StatCard
          title="Pendientes"
          value={pendingTasks}
          icon={<Clock className="size-6 text-warning" />}
        />
        <StatCard
          title="Miembros"
          value={users.length}
          icon={<Users className="size-6 text-primary" />}
        />
      </div>

      {/* Card 1: Tareas por persona */}
      <div className="bg-card border border-primary/25 rounded-2xl shadow-[0_4px_14px_rgba(2,106,167,0.12)] overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="px-5 py-4 bg-primary/10 border-b border-primary/20 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Filter className="size-5 text-primary" aria-hidden />
            <div>
              <h2 className="text-lg font-semibold text-primary">Tareas por persona</h2>
              {filteredTasks.length > 8 && (
                <p className="text-xs text-muted-foreground">Mostrando las 8 más recientes</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="filter-person" className="text-sm font-medium text-muted-foreground whitespace-nowrap sr-only">
              Buscar por persona
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden />
              <input
                id="filter-person"
                type="search"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Buscar por nombre de persona..."
                className="pl-9 pr-3 py-2 border border-primary/25 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm min-w-[220px] bg-input-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="overflow-auto flex-1 min-h-0">
          {displayedTasks.length === 0 ? (
            <div className="px-5 py-8 flex flex-col items-center justify-center text-center flex-1 min-h-0">
              <div className="p-3 rounded-xl bg-secondary/50 mb-3">
                <ClipboardList className="size-8 text-muted-foreground/70" aria-hidden />
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                {hasSearch
                  ? 'Ninguna tarea coincide con ese nombre. Prueba con otro.'
                  : 'No hay tareas en ningún proyecto. Crea un proyecto y añade tareas para verlas aquí.'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-primary/10 border-b border-primary/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tarea
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Asignado a
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Fecha asignación
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Fecha compromiso
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ¿Cumplió?
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedTasks.map((task) => (
                  <tr key={`${task.projectId}-${task.id}`} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-foreground max-w-[200px] truncate">
                      {task.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {getAssigneeName(task.assignedTo, users)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {task.projectName}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-4 text-muted-foreground/80 flex-shrink-0" />
                      {formatDate(task.startDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(task.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      {isFulfilled(task.columnTitle) ? (
                        <span className="inline-flex items-center gap-1 text-success bg-success/10 px-2 py-1 rounded text-xs font-medium">
                          <CheckCircle className="size-4" />
                          Sí
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-warning bg-warning/15 px-2 py-1 rounded text-xs font-medium">
                          <XCircle className="size-4" />
                          Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Card 2: Proyectos recientes */}
      <div className="bg-card border border-primary/25 rounded-2xl shadow-[0_4px_14px_rgba(2,106,167,0.12)] overflow-hidden flex-shrink-0">
        <div className="px-5 py-4 bg-primary/10 border-b border-primary/20">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <FolderOpen className="size-5 text-primary" aria-hidden />
            Proyectos recientes
          </h2>
        </div>

        <div className="p-5">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="p-3 rounded-xl bg-secondary/50 mb-3">
                <FolderKanban className="size-8 text-muted-foreground/70" aria-hidden />
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                No hay proyectos creados aún. Crea tu primer proyecto desde la sección Proyectos para verlo aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl border border-primary/20 bg-input-background/50 hover:bg-primary/5 hover:border-primary/30 transition-colors"
                >
                  <p className="font-medium text-foreground text-base">{project.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getProjectTaskCount(project)} tareas
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-primary/25 rounded-2xl p-4 flex items-center gap-4 shadow-[0_4px_14px_rgba(2,106,167,0.12)]">
      <div className="p-2.5 rounded-xl bg-primary/15">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
      </div>
    </div>
  );
}