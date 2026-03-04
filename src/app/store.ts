import { User, Group, Project } from './types';

// ---------- Datos quemados para visualizar el flujo ----------
const userIds = { admin: '1', trabajador: '2', ana: '3', carlos: '4', maria: '5' } as const;
const groupIds = { desarrollo: 'g1', diseno: 'g2' } as const;
const projectIds = { appMovil: 'p1', redisenoWeb: 'p2', portalInterno: 'p3' } as const;

let users: User[] = [
  { id: userIds.admin, name: 'Administrador', email: 'admin@tasks.com', username: 'admin', password: 'admin123', role: 'admin' },
  { id: userIds.trabajador, name: 'Trabajador', email: 'trabajador@tasks.com', username: 'trabajador', password: 'trab123', role: 'trabajador', groupId: groupIds.diseno },
  { id: userIds.ana, name: 'Ana García', email: 'ana@tasks.com', username: 'anagarcia', password: 'pass123', role: 'trabajador', groupId: groupIds.desarrollo },
  { id: userIds.carlos, name: 'Carlos Méndez', email: 'carlos@tasks.com', username: 'carlosm', password: 'pass123', role: 'trabajador', groupId: groupIds.desarrollo },
  { id: userIds.maria, name: 'María López', email: 'maria@tasks.com', username: 'marialopez', password: 'pass123', role: 'trabajador', groupId: groupIds.diseno },
];

let groups: Group[] = [
  {
    id: groupIds.desarrollo,
    name: 'Equipo Desarrollo',
    members: [users[2], users[3]], // Ana, Carlos
  },
  {
    id: groupIds.diseno,
    name: 'Equipo Diseño',
    members: [users[1], users[4]], // Trabajador, María
  },
];

let projects: Project[] = [
  {
    id: projectIds.appMovil,
    name: 'App móvil',
    users: [users[2], users[3]],
    groups: [groups[0]],
    columns: [
      {
        id: 'c1',
        title: 'Asignada',
        tasks: [
          { id: 't1', description: 'Definir arquitectura de la app', startDate: '2025-02-01', endDate: '2025-02-15', assignedTo: userIds.ana, columnId: 'c1' },
        ],
      },
      {
        id: 'c2',
        title: 'En proceso',
        tasks: [
          { id: 't2', description: 'Pantalla de login', startDate: '2025-02-10', endDate: '2025-02-28', assignedTo: userIds.carlos, columnId: 'c2' },
          { id: 't3', description: 'Integración API auth', startDate: '2025-02-05', endDate: '2025-02-20', assignedTo: userIds.ana, columnId: 'c2' },
        ],
      },
      {
        id: 'c3',
        title: 'En revisión',
        tasks: [
          { id: 't4', description: 'Diseño de componentes base', startDate: '2025-01-15', endDate: '2025-01-30', assignedTo: userIds.carlos, columnId: 'c3' },
        ],
      },
      {
        id: 'c4',
        title: 'Producción',
        tasks: [
          { id: 't5', description: 'Configuración inicial del proyecto', startDate: '2025-01-01', endDate: '2025-01-10', assignedTo: userIds.ana, columnId: 'c4' },
        ],
      },
    ],
  },
  {
    id: projectIds.redisenoWeb,
    name: 'Rediseño web',
    users: [users[1], users[4]],
    groups: [groups[1]],
    columns: [
      {
        id: 'c1',
        title: 'Asignada',
        tasks: [
          { id: 't6', description: 'Benchmark de competencia', startDate: '2025-03-01', endDate: '2025-03-15', assignedTo: userIds.maria, columnId: 'c1' },
        ],
      },
      {
        id: 'c2',
        title: 'En proceso',
        tasks: [
          { id: 't7', description: 'Wireframes homepage', startDate: '2025-02-20', endDate: '2025-03-10', assignedTo: userIds.maria, columnId: 'c2' },
          { id: 't8', description: 'Guía de estilos', startDate: '2025-02-15', endDate: '2025-03-05', assignedTo: userIds.trabajador, columnId: 'c2' },
        ],
      },
      { id: 'c3', title: 'En revisión', tasks: [] },
      {
        id: 'c4',
        title: 'Producción',
        tasks: [
          { id: 't9', description: 'Auditoría de accesibilidad', startDate: '2025-01-20', endDate: '2025-02-01', assignedTo: userIds.trabajador, columnId: 'c4' },
        ],
      },
    ],
  },
  {
    id: projectIds.portalInterno,
    name: 'Portal interno',
    users: [users[2], users[3], users[4]],
    groups: [groups[0], groups[1]],
    columns: [
      {
        id: 'c1',
        title: 'Asignada',
        tasks: [
          { id: 't10', description: 'Requisitos del portal', startDate: '2025-03-10', endDate: '2025-03-25', assignedTo: userIds.maria, columnId: 'c1' },
        ],
      },
      {
        id: 'c2',
        title: 'En proceso',
        tasks: [
          { id: 't11', description: 'Backend de notificaciones', startDate: '2025-02-25', endDate: '2025-03-15', assignedTo: userIds.carlos, columnId: 'c2' },
        ],
      },
      { id: 'c3', title: 'En revisión', tasks: [] },
      {
        id: 'c4',
        title: 'Producción',
        tasks: [
          { id: 't12', description: 'Documentación técnica', startDate: '2025-01-10', endDate: '2025-01-25', assignedTo: userIds.ana, columnId: 'c4' },
        ],
      },
    ],
  },
];

// Mock data for users (for backward compatibility)
export const mockUsers: User[] = users;

// Users management
export const getUsers = (): User[] => users;

export const createUser = (userData: Omit<User, 'id'>): User => {
  const newUser: User = {
    id: Date.now().toString(),
    role: 'trabajador', // los nuevos usuarios creados desde Miembros son trabajadores
    ...userData,
  };
  users = [...users, newUser];
  return newUser;
};

export const deleteUser = (userId: string): void => {
  users = users.filter(u => u.id !== userId);
};

// Groups management (groups y projects ya inicializados con datos quemados arriba)
export const getGroups = (): Group[] => groups;

export const getGroupById = (groupId: string): Group | undefined =>
  groups.find((g) => g.id === groupId);

export const createGroup = (name: string, members: User[]): Group => {
  const newGroup: Group = {
    id: Date.now().toString(),
    name,
    members,
  };
  groups = [...groups, newGroup];
  return newGroup;
};

export const deleteGroup = (groupId: string): void => {
  groups = groups.filter(g => g.id !== groupId);
};

// Projects management
export const getProjects = (): Project[] => projects;

export const getProjectById = (projectId: string): Project | undefined => {
  return projects.find(p => p.id === projectId);
};

export const createProject = (
  name: string,
  users: User[],
  selectedGroups: Group[]
): Project => {
  const newProject: Project = {
    id: Date.now().toString(),
    name,
    users,
    groups: selectedGroups,
    columns: [
      { id: '1', title: 'Asignada', tasks: [] },
      { id: '2', title: 'En proceso', tasks: [] },
      { id: '3', title: 'En revisión', tasks: [] },
      { id: '4', title: 'Producción', tasks: [] },
    ],
  };
  projects = [...projects, newProject];
  return newProject;
};

export const updateProject = (projectId: string, updatedProject: Project): void => {
  projects = projects.map(p => p.id === projectId ? updatedProject : p);
};

export const deleteProject = (projectId: string): void => {
  projects = projects.filter(p => p.id !== projectId);
};