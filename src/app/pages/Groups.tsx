import { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, X, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { mockUsers, getGroups, getGroupById, getUsers, createGroup, deleteGroup } from '../store';
import { User, Group } from '../types';

/** Total de integrantes: los del grupo al crearlo + usuarios asignados al grupo por groupId */
function getGroupMemberCount(group: Group): number {
  const usersInGroup = getUsers().filter((u) => u.groupId === group.id);
  const ids = new Set<string>(group.members.map((m) => m.id));
  usersInGroup.forEach((u) => ids.add(u.id));
  return ids.size;
}

export function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setGroups(getGroups());
  }, []);

  const selectedGroup = selectedGroupId ? getGroupById(selectedGroupId) : null;

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedUsers.find(u => u.id === user.id)
  );

  const handleAddUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      createGroup(groupName, selectedUsers);
      setGroups(getGroups());
      setGroupName('');
      setSelectedUsers([]);
      setIsCreating(false);
    }
  };

  const handleDeleteGroup = (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de eliminar este grupo?')) {
      deleteGroup(groupId);
      setGroups(getGroups());
      if (selectedGroupId === groupId) setSelectedGroupId(null);
    }
  };

  const handleGroupClick = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  // Vista aparte: tabla de integrantes del grupo
  // Incluye group.members (asignados al crear el grupo) + usuarios con groupId === este grupo (asignados después)
  if (selectedGroup) {
    const usersInGroup = getUsers().filter((u) => u.groupId === selectedGroup.id);
    const membersById = new Map<string, User>();
    for (const m of selectedGroup.members) membersById.set(m.id, m);
    for (const u of usersInGroup) membersById.set(u.id, u);
    const members = Array.from(membersById.values());
    return (
      <div className="size-full overflow-auto bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <button
            type="button"
            onClick={() => setSelectedGroupId(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4" />
            Volver a grupos
          </button>
          <div className="bg-card rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UsersIcon className="size-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedGroup.name}</h2>
                <p className="text-sm text-gray-500">{members.length} integrante{members.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              {members.length === 0 ? (
                <p className="p-6 text-sm text-gray-500 italic">Este grupo no tiene integrantes.</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-background border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Correo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-background">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {member.name.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{member.username}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{member.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full overflow-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Create Group Form */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Crear Grupo
          </button>
        ) : (
          <div className="bg-card rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Crear Nuevo Grupo</h3>

            {/* Group Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre del grupo *
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Equipo de Desarrollo"
              />
            </div>

            {/* Search Users */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Agregar personas *
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Buscar personas..."
                  />
                </div>

                {/* Search Results */}
                {showResults && searchQuery && filteredUsers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleAddUser(user)}
                        className="w-full px-3 py-2 text-left hover:bg-background flex items-center gap-2"
                      >
                        <div className="size-8 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  Personas seleccionadas ({selectedUsers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      <span>{user.name}</span>
                      <button
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

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedUsers.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear Grupo
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setGroupName('');
                  setSelectedUsers([]);
                }}
                className="px-4 py-2 bg-gray-100 text-foreground rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de grupos: clic abre vista aparte */}
        <div className="space-y-3">
          {groups.length === 0 ? (
            <div className="bg-card rounded-lg border border-gray-200 p-8 text-center">
              <UsersIcon className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay grupos creados</p>
            </div>
          ) : (
            groups.map((group) => {
              const memberCount = getGroupMemberCount(group);
              return (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                className="bg-card rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <UsersIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">{group.name}</h3>
                    <p className="text-sm text-gray-500">
                      {memberCount} miembro{memberCount !== 1 ? 's' : ''} — clic para ver integrantes
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteGroup(e, group.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg opacity-80 hover:opacity-100"
                  title="Eliminar grupo"
                >
                  <Trash2 className="size-4 text-destructive" />
                </button>
              </div>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}