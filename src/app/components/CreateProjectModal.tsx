import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, Users as UsersIcon, UserPlus } from 'lucide-react';
import { mockUsers, getGroups, createProject } from '../store';
import { User, Group } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [showResults, setShowResults] = useState(false);

  const groups = getGroups();

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.find((u) => u.id === user.id)
  );

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedGroups.find((g) => g.id === group.id)
  );

  const handleAddUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleAddGroup = (group: Group) => {
    setSelectedGroups([...selectedGroups, group]);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleRemoveGroup = (groupId: string) => {
    setSelectedGroups(selectedGroups.filter((g) => g.id !== groupId));
  };

  const handleCreateProject = () => {
    if (projectName.trim()) {
      const project = createProject(projectName, selectedUsers, selectedGroups);
      onClose();
      setProjectName('');
      setSelectedUsers([]);
      setSelectedGroups([]);
      navigate(`/projects/${project.id}`);
    }
  };

  const handleClose = () => {
    setProjectName('');
    setSelectedUsers([]);
    setSelectedGroups([]);
    setSearchQuery('');
    setShowResults(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="bg-card rounded-2xl shadow-xl border border-primary/20 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
      >
        <div className="flex items-center justify-between px-5 py-4 bg-primary flex-shrink-0">
          <h2 id="create-project-title" className="text-xl font-bold text-primary-foreground">Crear Nuevo Proyecto</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-white/15 rounded-xl transition-colors"
            aria-label="Cerrar"
          >
            <X className="size-5 text-primary-foreground" />
          </button>
        </div>

        {/* Body - scrollable */}
        <div className="p-4 overflow-y-auto flex-1 min-h-0 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre del proyecto *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ingresa el nombre del proyecto"
            />
          </div>

          {/* Search Participants */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Agregar participantes
            </label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Buscar por nombre o elegir usuario / grupo..."
                />
              </div>

              {showResults && (filteredUsers.length > 0 || filteredGroups.length > 0) && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredUsers.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-secondary">
                        Usuarios
                      </div>
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleAddUser(user)}
                          className="w-full px-3 py-2 text-left hover:bg-secondary flex items-center gap-2"
                        >
                          <UserPlus className="size-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-foreground">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {filteredGroups.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-secondary">
                        Grupos
                      </div>
                      {filteredGroups.map((group) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => handleAddGroup(group)}
                          className="w-full px-3 py-2 text-left hover:bg-secondary flex items-center gap-2"
                        >
                          <UsersIcon className="size-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-foreground">{group.name}</p>
                            <p className="text-xs text-gray-500">{group.members.length} miembros</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Usuarios seleccionados</p>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 bg-blue-50 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    <span>{user.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user.id)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Groups */}
          {selectedGroups.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Grupos seleccionados</p>
              <div className="flex flex-wrap gap-2">
                {selectedGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    <UsersIcon className="size-3" />
                    <span>{group.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGroup(group.id)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <button
            type="button"
            onClick={handleCreateProject}
            disabled={!projectName.trim()}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}
