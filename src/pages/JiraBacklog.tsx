import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PRIORITIES = [
  { label: 'High', color: '#e74c3c' },
  { label: 'Medium', color: '#f1c40f' },
  { label: 'Low', color: '#2ecc71' },
];
const TYPES = [
  { label: 'Bug', color: '#e67e22', icon: '🐞' },
  { label: 'Epic', color: '#8e44ad', icon: '🌟' },
  { label: 'Task', color: '#3498db', icon: '📝' },
  { label: 'Story', color: '#16a085', icon: '📖' },
];
const STATUS_MAP = {
  todo: 'TO DO',
  inprogress: 'IN PROGRESS',
  inreview: 'IN REVIEW',
  done: 'DONE',
};
const STATUS_COLOR = {
  'TO DO': '#3498db',
  'IN PROGRESS': '#f39c12',
  'IN REVIEW': '#8e44ad',
  'DONE': '#2ecc71',
};

function getRandomFromArray(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function getRandomColor() {
  const colors = ['#f39c12', '#e67e22', '#16a085', '#2980b9', '#8e44ad', '#2ecc71', '#e74c3c'];
  return colors[Math.floor(Math.random() * colors.length)];
}

interface Item {
  id: string;
  content: string;
  status: string;
  priority: { label: string; color: string };
  type: { label: string; color: string; icon: string };
  assignee: string;
}

interface Column {
  name: string;
  items: Item[];
}

interface Columns {
  [key: string]: Column;
}

const initialData: { columns: Columns } = {
  columns: {
    todo: {
      name: 'TO DO',
      items: [
        { id: '1', content: 'Implement feedback collector for all user journeys and ensure the feedback is actionable for the product team to review and prioritize.', status: 'TO DO', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Alice' },
        { id: '2', content: 'Bump version for new API for billing', status: 'TO DO', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Bob' },
        { id: '3', content: 'Add NPS feedback to wallboard so that management can track user satisfaction trends over time and make data-driven decisions.', status: 'TO DO', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Charlie' },
      ],
    },
    inprogress: {
      name: 'IN PROGRESS',
      items: [
        { id: '4', content: 'Update T&C copy with v1.9 from the writers guild in all products that have cross country compliance.', status: 'IN PROGRESS', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'David' },
        { id: '5', content: 'Test new stripe integration', status: 'IN PROGRESS', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Eve' },
        { id: '6', content: 'Refactor stripe verification key validator to a single call to avoid timing out on slow connections.', status: 'IN PROGRESS', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Frank' },
        { id: '7', content: "Change phone number field type to 'phone' for better validation and user experience.", status: 'IN PROGRESS', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Grace' },
      ],
    },
    inreview: {
      name: 'IN REVIEW',
      items: [
        { id: '8', content: 'Multi-dest search UI web', status: 'IN REVIEW', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Heidi' },
      ],
    },
    done: {
      name: 'DONE',
      items: [
        { id: '9', content: 'Quick booking for accomodations - web', status: 'DONE', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Ivan' },
        { id: '10', content: 'Adapt web app no new payments provider', status: 'DONE', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Judy' },
        { id: '11', content: 'Fluid booking on tablets', status: 'DONE', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Mallory' },
        { id: '12', content: 'Shoping cart purchasing error - quick fix required.', status: 'DONE', priority: getRandomFromArray(PRIORITIES), type: getRandomFromArray(TYPES), assignee: 'Oscar' },
      ],
    },
  },
};

function KanbanItem({ item, isDragging }: { item: Item; isDragging?: boolean }) {
  function getAvatarColor(id: string) {
    const colors = ['#f39c12', '#e67e22', '#16a085', '#2980b9', '#8e44ad', '#2ecc71', '#e74c3c'];
    return colors[parseInt(id, 10) % colors.length];
  }
  return (
    <div
      style={{
        userSelect: 'none',
        padding: 12,
        margin: '0 0 12px 0',
        minHeight: '60px',
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 8,
        boxShadow: isDragging ? '0 4px 16px #0003' : '0 1px 4px #0002',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'box-shadow 0.2s, transform 0.2s',
        transform: isDragging ? 'scale(1.04)' : 'scale(1)',
        zIndex: isDragging ? 10 : 1,
        cursor: 'grab',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: getAvatarColor(item.id),
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        {item.assignee.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontWeight: 600,
          textAlign: 'left',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          whiteSpace: 'normal',
          textOverflow: 'ellipsis',
        }} title={item.content}>
          {item.content}
        </div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            color: STATUS_COLOR[item.status as keyof typeof STATUS_COLOR],
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: 0.5,
            minWidth: 50,
            textAlign: 'center',
            opacity: 0.8,
          }}>{item.status}</span>
          <span style={{ color: item.priority.color, fontWeight: 500, fontSize: 11, opacity: 0.8 }}>{item.priority.label}</span>
          <span style={{ color: item.type.color, fontSize: 11, opacity: 0.8 }}>{item.type.icon} {item.type.label}</span>
        </div>
      </div>
    </div>
  );
}

function SortableKanbanItem({ item, id, colId }: { item: Item; id: string; colId: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'box-shadow 0.2s, transform 0.2s',
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 10 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} data-col={colId}>
      <KanbanItem item={item} isDragging={isDragging} />
    </div>
  );
}

const JiraBacklog = () => {
  const [columns, setColumns] = useState<Columns>(initialData.columns);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    let sourceColId = '';
    let destColId = '';
    let sourceIdx = -1;
    Object.entries(columns).forEach(([colId, col]) => {
      const idx = col.items.findIndex((i) => i.id === active.id);
      if (idx !== -1) {
        sourceColId = colId;
        sourceIdx = idx;
      }
    });
    Object.entries(columns).forEach(([colId, col]) => {
      if (col.items.some((i) => i.id === over.id)) {
        destColId = colId;
      }
      if (colId === over.id) {
        destColId = colId;
      }
    });
    if (!sourceColId || !destColId) return;
    if (sourceColId !== destColId) {
      const sourceCol = columns[sourceColId];
      const destCol = columns[destColId];
      const sourceItems = [...sourceCol.items];
      const destItems = [...destCol.items];
      const [removed] = sourceItems.splice(sourceIdx, 1);
      removed.status = STATUS_MAP[destColId as keyof typeof STATUS_MAP];
      destItems.unshift(removed);
      setColumns({
        ...columns,
        [sourceColId]: {
          ...sourceCol,
          items: sourceItems,
        },
        [destColId]: {
          ...destCol,
          items: destItems,
        },
      });
    } else {
      const col = columns[sourceColId];
      const oldIndex = sourceIdx;
      const newIndex = col.items.findIndex((i) => i.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newItems = arrayMove(col.items, oldIndex, newIndex);
        setColumns({
          ...columns,
          [sourceColId]: {
            ...col,
            items: newItems,
          },
        });
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
     
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          {Object.entries(columns).map(([colId, col]) => (
            <div
              key={colId}
              style={{
                background: '#f4f5f7',
                padding: 12,
                width: 280,
                minHeight: 400,
                borderRadius: 8,
                boxShadow: '0 2px 8px #0001',
                display: 'flex',
                flexDirection: 'column',
              }}
              data-col={colId}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <h4 style={{ textAlign: 'center', margin: '8px 0 8px 0' }}>{col.name}</h4>
                <span style={{
                  background: STATUS_COLOR[col.name as keyof typeof STATUS_COLOR],
                  color: '#fff',
                  borderRadius: 12,
                  padding: '2px 10px',
                  fontWeight: 700,
                  fontSize: 13,
                  minWidth: 28,
                  textAlign: 'center',
                  marginLeft: 8,
                  boxShadow: '0 1px 2px #0001',
                }}>{col.items.length}</span>
              </div>
              <SortableContext items={col.items.map((item) => item.id)} strategy={verticalListSortingStrategy} id={colId}>
                {col.items.map((item) => (
                  <SortableKanbanItem key={item.id} item={item} id={item.id} colId={colId} />
                ))}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default JiraBacklog; 