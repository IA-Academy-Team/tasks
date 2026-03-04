import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, User } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'columnId'>) => void;
  participants: User[];
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, onSave, participants, task }: TaskModalProps) {
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setStartDate(task.startDate);
      setEndDate(task.endDate);
      setAssignedTo(task.assignedTo);
    } else {
      setDescription('');
      setStartDate('');
      setEndDate('');
      setAssignedTo('');
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && startDate && endDate && assignedTo) {
      onSave({
        description,
        startDate,
        endDate,
        assignedTo,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-primary/20 w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-primary">
          <h3 className="text-lg font-semibold text-primary-foreground">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/15 rounded-xl transition-colors"
          >
            <X className="size-5 text-primary-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Descripción de la tarea *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              placeholder="Describe la tarea..."
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Fecha de inicio *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Fecha de fin *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min={startDate}
              required
            />
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Asignar a *
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Seleccionar persona...</option>
              {participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover"
            >
              {task ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
