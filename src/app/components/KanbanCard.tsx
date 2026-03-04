import { useDrag, useDrop } from 'react-dnd';
import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { Task, User } from '../types';

interface KanbanCardProps {
  task: Task;
  assignedUser?: User;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (taskId: string, targetColumnId: string, position: number) => void;
  index: number;
}

const ItemTypes = {
  TASK: 'task',
};

export function KanbanCard({ task, assignedUser, onEdit, onDelete, onMove, index }: KanbanCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, columnId: task.columnId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    hover: (item: { id: string; columnId: string; index: number }) => {
      if (item.id === task.id) return;
      if (item.columnId === task.columnId && item.index === index) return;

      onMove(item.id, task.columnId, index);
      item.columnId = task.columnId;
      item.index = index;
    },
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-card border border-primary/20 rounded-xl p-3 cursor-move hover:shadow-[0_4px_12px_rgba(2,106,167,0.12)] hover:border-primary/30 transition-all group ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-foreground flex-1">{task.description}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 hover:bg-primary/10 rounded-lg"
          >
            <Pencil className="size-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-destructive/10 rounded"
          >
            <Trash2 className="size-3 text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="size-3" />
          <span>{formatDate(task.startDate)}</span>
          <span>-</span>
          <span>{formatDate(task.endDate)}</span>
        </div>

        {assignedUser && (
          <div className="flex items-center gap-1">
            <div className="size-6 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white text-xs">
              {assignedUser.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
