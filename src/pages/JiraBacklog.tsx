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
  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    if (viewMode !== 'kanban') return;
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

  const renderGridTable = () => {
    const allItems: Item[] = Object.values(columns).flatMap(col => col.items);
    const filtered = allItems.filter(item => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;
      return (
        item.content.toLowerCase().includes(term) ||
        item.assignee.toLowerCase().includes(term)
      );
    });
    return (
      <div style={{ width: '100%', marginTop: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', borderRadius: 12, boxShadow: '0 1px 8px #0001', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f4f5f7', color: '#2176ff', fontWeight: 700, fontSize: 16 }}>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Assignee</th>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Priority</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', minWidth: 120 }}>Type</th>
              <th style={{ padding: '12px 8px', textAlign: 'left' }}>Content</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#888' }}>No items found.</td></tr>
            ) : filtered.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', fontSize: 15 }}>
                <td style={{ padding: '10px 8px', color: STATUS_COLOR[item.status as keyof typeof STATUS_COLOR], fontWeight: 600, textAlign: 'left' }}>{item.status}</td>
                <td style={{ padding: '10px 8px', fontWeight: 500, textAlign: 'left' }}>{item.assignee}</td>
                <td style={{ padding: '10px 8px', color: item.priority.color, fontWeight: 500, textAlign: 'left' }}>{item.priority.label}</td>
                <td style={{ padding: '10px 8px', color: item.type.color, textAlign: 'left', minWidth: 120 }}>{item.type.icon} {item.type.label}</td>
                <td style={{ padding: '10px 8px', textAlign: 'left' }}>{item.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <button style={{
              padding: '7px 16px 7px 12px',
              borderRadius: 6,
              border: '1.5px solid #ccc',
              background: '#f4f5f7',
              color: '#444',
              fontWeight: 500,
              fontSize: 15,
              cursor: 'pointer',
              outline: 'none',
              minWidth: 110,
              marginRight: 2,
            }}>
              Basic Filters <span style={{ fontSize: 13, marginLeft: 4 }}>▼</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Filter by name"
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1.5px solid #ccc',
              fontSize: 15,
              outline: 'none',
              minWidth: 170,
              background: '#fff',
              color: '#333',
              boxShadow: '0 1px 4px #0001',
              marginRight: 2,
            }}
            disabled
          />
          <select style={{
            padding: '7px 16px 7px 12px',
            borderRadius: 6,
            border: '1.5px solid #ccc',
            background: '#f4f5f7',
            color: '#444',
            fontWeight: 500,
            fontSize: 15,
            cursor: 'pointer',
            outline: 'none',
            minWidth: 100,
            marginRight: 2,
          }} disabled>
            <option>Project</option>
          </select>
          <select style={{
            padding: '7px 16px 7px 12px',
            borderRadius: 6,
            border: '1.5px solid #ccc',
            background: '#f4f5f7',
            color: '#444',
            fontWeight: 500,
            fontSize: 15,
            cursor: 'pointer',
            outline: 'none',
            minWidth: 110,
            marginRight: 2,
          }} disabled>
            <option>Issue Type</option>
          </select>
          <select style={{
            padding: '7px 16px 7px 12px',
            borderRadius: 6,
            border: '1.5px solid #ccc',
            background: '#f4f5f7',
            color: '#444',
            fontWeight: 500,
            fontSize: 15,
            cursor: 'pointer',
            outline: 'none',
            minWidth: 90,
            marginRight: 2,
          }} disabled>
            <option>Status</option>
          </select>
          <span style={{ color: '#2176ff', fontWeight: 500, fontSize: 15, cursor: 'pointer', marginRight: 8 }}>+ More filters</span>
          <span style={{ color: '#888', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>Clear filters</span>
        </div>
        <div style={{ display: 'flex', gap: 0, background: '#f4f5f7', borderRadius: 16, padding: 2 }}>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              padding: '8px 22px',
              borderRadius: 12,
              border: viewMode === 'kanban' ? '1.5px solid #ccc' : '1.5px solid transparent',
              background: viewMode === 'kanban' ? '#fff' : '#f4f5f7',
              color: viewMode === 'kanban' ? '#333' : '#888',
              fontWeight: viewMode === 'kanban' ? 700 : 400,
              fontSize: 20,
              cursor: viewMode === 'kanban' ? 'default' : 'pointer',
              outline: 'none',
              transition: 'all 0.18s',
              boxShadow: 'none',
              marginRight: 2,
            }}
            disabled={viewMode === 'kanban'}
          >
            Kanban
          </button>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '8px 22px',
              borderRadius: 12,
              border: viewMode === 'grid' ? '1.5px solid #ccc' : '1.5px solid transparent',
              background: viewMode === 'grid' ? '#fff' : '#f4f5f7',
              color: viewMode === 'grid' ? '#333' : '#888',
              fontWeight: viewMode === 'grid' ? 700 : 400,
              fontSize: 20,
              cursor: viewMode === 'grid' ? 'default' : 'pointer',
              outline: 'none',
              transition: 'all 0.18s',
              boxShadow: 'none',
            }}
            disabled={viewMode === 'grid'}
          >
            Grid
          </button>
        </div>
      </div>
      {viewMode === 'kanban' ? (
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
      ) : (
        renderGridTable()
      )}
    </div>
  );
};

export default JiraBacklog; 