import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FolderKanban, Users, Trash2, Plus } from 'lucide-react';
import { getProjects, deleteProject } from '../store';
import { Project } from '../types';
import { CreateProjectModal } from '../components/CreateProjectModal';

export function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      deleteProject(projectId);
      setProjects(getProjects());
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setProjects(getProjects());
  };

  return (
    <div className="size-full flex flex-col bg-background">
      {/* Header azul */}
      <div className="flex-shrink-0 flex items-center justify-between px-8 py-6 bg-primary border-b border-primary/30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/15">
            <FolderKanban className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-foreground">Proyectos</h2>
            <p className="text-sm text-white/90 mt-0.5">
              {projects.length === 0
                ? 'Crea tu primer proyecto para comenzar'
                : 'Selecciona un proyecto para ver su tablero'}
            </p>
          </div>
        </div>
        <div className="relative group">
          <button
            type="button"
            onClick={openCreateModal}
            className="size-11 flex items-center justify-center bg-primary-foreground text-primary hover:bg-white rounded-xl transition-colors shadow-lg font-medium"
            aria-label="Crear proyecto"
          >
            <Plus className="size-5" />
          </button>
          <span className="absolute right-0 top-full mt-2 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Crear proyecto
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-auto">
        {projects.length === 0 ? (
          <div className="flex items-center justify-center flex-1 min-h-[320px]">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                <FolderKanban className="size-16 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No hay proyectos</h3>
              <p className="text-muted-foreground mb-4">Haz clic en el botón + para crear tu primer proyecto</p>
              <button
                type="button"
                onClick={openCreateModal}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover font-medium shadow-md"
              >
                Crear Proyecto
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projects.map((project) => {
            const totalUsers = project.users.length + 
              project.groups.reduce((acc, group) => acc + group.members.length, 0);
            const totalTasks = project.columns.reduce((acc, col) => acc + col.tasks.length, 0);

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-card rounded-2xl border border-primary/25 p-5 hover:shadow-[0_8px_24px_rgba(2,106,167,0.15)] hover:border-primary/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/15">
                      <FolderKanban className="size-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 rounded-lg transition-opacity"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="size-4 text-primary/80" />
                    <span>{totalUsers} participantes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary"></span>
                    <span>{totalTasks} tareas</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-1">
                  {project.columns.map((col) => (
                    <div
                      key={col.id}
                      className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(col.tasks.length / (totalTasks || 1)) * 100}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
            </div>
          </div>
        )}
      </div>

      <CreateProjectModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </div>
  );
}
