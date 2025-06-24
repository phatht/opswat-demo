import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  Handle,
  Position,
  getBezierPath,
  BaseEdge,
  EdgeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    data: { label: 'Start', type: 'start' },
    position: { x: 250, y: 5 },
  },
];

const initialEdges: Edge[] = [];

const toolList = [
  { type: 'tool', label: 'Tool' },
  { type: 'agent', label: 'Agent' },
];

// Danh sách công nghệ mẫu (tên + icon SVG hoặc emoji)
const TECHNOLOGIES = [
  { name: 'Google', icon: <svg width="24" height="24" viewBox="0 0 24 24"><g><path fill="#4285F4" d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.715-2.641c-1.703-1.57-3.906-2.523-6.684-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.703 0-.652-.07-1.148-.156-1.652z"/><path fill="#34A853" d="M3.153 7.548l3.285 2.41c.891-1.781 2.578-2.961 4.562-2.961 1.109 0 2.148.383 2.953 1.016l2.727-2.641c-1.57-1.453-3.594-2.372-5.68-2.372-3.672 0-6.773 2.484-7.883 5.948z"/><path fill="#FBBC05" d="M12 22c2.43 0 4.477-.805 5.969-2.188l-2.75-2.25c-.766.523-1.75.836-3.219.836-2.484 0-4.594-1.68-5.352-3.945l-3.273 2.531c1.484 3.406 4.859 5.016 8.625 5.016z"/><path fill="#EA4335" d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.715-2.641c-1.703-1.57-3.906-2.523-6.684-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.703 0-.652-.07-1.148-.156-1.652z" opacity=".1"/></g></svg> },
  { name: 'ChatGPT', icon: <span style={{fontSize:20}}>🤖</span> },
  { name: 'DeepL', icon: <span style={{fontSize:20}}>🧠</span> },
  { name: 'Slack', icon: <span style={{fontSize:20}}>💬</span> },
  { name: 'Telegram', icon: <span style={{fontSize:20}}>✈️</span> },
  { name: 'GitHub', icon: <span style={{fontSize:20}}>🐙</span> },
  { name: 'n8n', icon: <span style={{fontSize:20}}>🟠</span> },
  { name: 'OpenAI', icon: <span style={{fontSize:20}}>🔮</span> },
  { name: 'AWS', icon: <span style={{fontSize:20}}>☁️</span> },
  { name: 'Zapier', icon: <span style={{fontSize:20}}>⚡</span> },
];

function getRandomTech() {
  const idx = Math.floor(Math.random() * TECHNOLOGIES.length);
  return TECHNOLOGIES[idx];
}

const Sidebar = ({ onDragStart }: { onDragStart: (event: React.DragEvent, nodeType: string) => void }) => (
  <aside style={{ padding: 16, width: 120, background: '#f4f6fa', borderRight: '1px solid #e0e0e0', minHeight: '100vh' }}>
    <div style={{ fontWeight: 700, marginBottom: 12 }}>Nodes</div>
    {toolList.map((tool) => (
      <div
        key={tool.type}
        onDragStart={(event) => onDragStart(event, tool.type)}
        draggable
        style={{
          padding: '8px 12px',
          marginBottom: 8,
          background: '#fff',
          border: '1px solid #1976d2',
          borderRadius: 6,
          cursor: 'grab',
          fontWeight: 500,
          color: '#1976d2',
          textAlign: 'center',
        }}
      >
        {tool.label}
      </div>
    ))}
  </aside>
);

// Custom Node: hiển thị điểm đầu/cuối, cho phép rename, có icon công nghệ
const CustomNode = ({ id, data, selected, isConnectable, xPos, yPos, dragging }: any) => {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  };
  const handleBlur = () => {
    setEditing(false);
    if (label !== data.label && data.onLabelChange) data.onLabelChange(id, label);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
  };

  return (
    <div style={{ position: 'relative', minWidth: 80, minHeight: 40, background: selected ? '#e3f2fd' : '#fff', border: '2px solid #1976d2', borderRadius: 8, padding: 8, textAlign: 'center', boxShadow: dragging ? '0 2px 8px #1976d2' : undefined }}>
      {/* Điểm đầu (hình tròn xám) */}
      <Handle type="target" position={Position.Left} style={{ background: '#888', width: 16, height: 16, borderRadius: '50%', left: -10, top: '50%', transform: 'translateY(-50%)' }} isConnectable={isConnectable} />
      {/* Điểm cuối (dấu ngạch) */}
      <Handle type="source" position={Position.Right} style={{ background: '#1976d2', width: 16, height: 4, borderRadius: 2, right: -10, top: '50%', transform: 'translateY(-50%)' }} isConnectable={isConnectable} />
      {/* Icon công nghệ */}
      <div style={{marginBottom: 2}}>{data.icon}</div>
      {/* Label hoặc input rename */}
      {editing ? (
        <input
          ref={inputRef}
          value={label}
          onChange={e => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{ width: '90%', fontSize: 16, border: '1px solid #1976d2', borderRadius: 4, padding: 2 }}
        />
      ) : (
        <div onDoubleClick={handleDoubleClick} style={{ fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{label}</div>
      )}
    </div>
  );
};

// Custom Edge: vẽ mũi tên, hiện nút + và x khi hover
const CustomEdge = (props: EdgeProps) => {
  const OFFSET = 10;
  let { sourceX, sourceY, targetX, targetY } = props;
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const len = Math.sqrt(dx * dx + dy * dy);
  // Lùi điểm target lại một đoạn OFFSET
  let arrowX = targetX, arrowY = targetY;
  if (len > OFFSET) {
    arrowX = targetX - (dx / len) * OFFSET;
    arrowY = targetY - (dy / len) * OFFSET;
  }
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX: arrowX,
    targetY: arrowY,
  });
  const [hovered, setHovered] = useState(false);
  // Thêm node mới giữa edge
  const handleAddNode = () => {
    if (props.data && props.data.onAddNode) props.data.onAddNode(props);
  };
  // Xóa edge
  const handleDeleteEdge = () => {
    if (props.data && props.data.onDeleteEdge) props.data.onDeleteEdge(props.id);
  };
  // Tính góc quay của mũi tên
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;
  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <BaseEdge path={edgePath} {...props} />
      <path d={edgePath} stroke="#1976d2" strokeWidth={2} fill="none" />
      {/* Vẽ mũi tên riêng */}
      <g transform={`translate(${arrowX},${arrowY}) rotate(${angle})`}>
        <polygon points="0,-6 12,0 0,6" fill="#1976d2" />
      </g>
      {hovered && (
        <foreignObject x={labelX - 18} y={labelY - 14} width={36} height={28} style={{ pointerEvents: 'none' }}>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', pointerEvents: 'auto' }}>
            <button
              onClick={handleAddNode}
              style={{
                background: '#fff',
                border: '1px solid #1976d2',
                borderRadius: '50%',
                width: 18,
                height: 18,
                cursor: 'pointer',
                color: '#1976d2',
                fontWeight: 700,
                fontSize: 12,
                lineHeight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >+</button>
            <button
              onClick={handleDeleteEdge}
              style={{
                background: '#fff',
                border: '1px solid #d32f2f',
                borderRadius: '50%',
                width: 18,
                height: 18,
                cursor: 'pointer',
                color: '#d32f2f',
                fontWeight: 700,
                fontSize: 12,
                lineHeight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >x</button>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

// Custom Start Node: bo góc đặc biệt, nền xám, icon sấm sét
const StartNode = ({ data, selected }: any) => (
  <div style={{
    minWidth: 90,
    minHeight: 60,
    background: selected ? '#fb8c00' : '#ff9800',
    border: '2px solid #b26a00',
    borderRadius: '32px 12px 12px 32px', // Góc trái trên và trái dưới bo lớn
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    position: 'relative',
    boxShadow: selected ? '0 2px 8px #b26a0088' : undefined,
    padding: 10,
    fontWeight: 600,
    fontSize: 16,
  }}>
    {/* Icon sấm sét */}
    <div style={{ fontSize: 28, marginBottom: 2, color: '#ffd600' }}>
      {/* SVG sấm sét đẹp */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2L6 18H16L12 30L26 14H16L20 2Z" fill="#ffd600" stroke="#222" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    </div>
    <div style={{fontSize: 24, fontWeight: 700}}>{data.label || 'Start'}</div>
    {/* Output handle */}
    <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)' }}>
      <Handle type="source" position={Position.Right} style={{ background: '#222', width: 16, height: 4, borderRadius: 2 }} />
    </div>
  </div>
);

const nodeTypes = { custom: CustomNode, start: StartNode };
const edgeTypes = { custom: CustomEdge };

const SPAWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Chỉ cho phép kết nối giữa Agent và Tool (hai chiều)
  const isValidConnection = useCallback((connection: Connection) => {
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (!sourceNode || !targetNode) return false;
    const sourceType = sourceNode.data?.type;
    const targetType = targetNode.data?.type;
    // Cho phép Agent -> Tool, Tool -> Agent, Start -> Agent, Start -> Tool
    return (
      (sourceType === 'tool' && targetType === 'agent') ||
      (sourceType === 'agent' && targetType === 'tool') ||
      (sourceType === 'start' && (targetType === 'agent' || targetType === 'tool'))
    );
  }, [nodes]);

  // Kết nối
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)), [setEdges]);

  // Kéo thả node từ sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Thêm hàm đổi tên node
  const onLabelChange = (id: string, newLabel: string) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label: newLabel, onLabelChange } } : n));
  };

  // Thêm node mới giữa edge
  const onAddNode = (edgeProps: EdgeProps) => {
    const { source, target } = edgeProps;
    // Tìm vị trí giữa
    const x = (edgeProps.sourceX + edgeProps.targetX) / 2;
    const y = (edgeProps.sourceY + edgeProps.targetY) / 2;
    const newNode: Node = {
      id: `${+new Date()}`,
      type: 'custom',
      position: { x, y },
      data: { label: 'Tool', type: 'tool', onLabelChange },
    };
    setNodes(nds => nds.concat(newNode));
    // Xóa edge cũ, thêm 2 edge mới
    setEdges(eds => {
      const filtered = eds.filter(e => e.id !== edgeProps.id);
      return [
        ...filtered,
        { id: `${source}-${newNode.id}`, source, target: newNode.id, type: 'custom', data: { onAddNode, onDeleteEdge } },
        { id: `${newNode.id}-${target}`, source: newNode.id, target, type: 'custom', data: { onAddNode, onDeleteEdge } },
      ];
    });
  };

  // Xóa edge
  const onDeleteEdge = (edgeId: string) => {
    setEdges(eds => eds.filter(e => e.id !== edgeId));
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      // Random công nghệ
      const tech = getRandomTech();
      const newNode: Node = {
        id: `${+new Date()}`,
        type: 'custom',
        position,
        data: { label: tech.name, type, icon: tech.icon, onLabelChange },
      };
      setNodes((nds: Node[]) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Khi xóa node, nếu là Agent thì xóa các Tool không còn liên kết
  const handleNodesDelete = useCallback((deleted: Node[]) => {
    let updatedNodes = nodes.filter((n) => !deleted.some((d) => d.id === n.id));
    let updatedEdges = edges.filter((e) => !deleted.some((d) => d.id === e.source || d.id === e.target));
    // Nếu xóa Agent, kiểm tra các Tool không còn kết nối tới Agent nào
    const deletedAgentIds = deleted.filter((n) => n.data?.type === 'agent').map((n) => n.id);
    if (deletedAgentIds.length > 0) {
      // Tìm các Tool không còn là source của bất kỳ edge nào
      const toolNodes = updatedNodes.filter((n) => n.data?.type === 'tool');
      const toolIds = toolNodes.map((n) => n.id);
      const toolHasEdge = toolIds.filter((tid) => updatedEdges.some((e) => e.source === tid));
      const toolToRemove = toolIds.filter((tid) => !toolHasEdge.includes(tid));
      updatedNodes = updatedNodes.filter((n) => !toolToRemove.includes(n.id));
    }
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Sidebar onDragStart={onNodeDragStart} />
        <div style={{ flex: 1, height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges.map(e => ({ ...e, type: 'custom', data: { onAddNode, onDeleteEdge } }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            style={{ background: '#f9fafb' }}
            isValidConnection={isValidConnection}
            onNodesDelete={handleNodesDelete}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
          >
            <MiniMap />
            <Controls />
            <Background gap={16} color="#e3e3e3" />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default SPAWorkflow; 