import { useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from "react-flow-renderer";

import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import NodeForm from "../components/NodeForm";
import EdgeForm from "../components/EdgeForm";
import MainLayout from "../components/MainLayout";

const LOCAL_KEY = "kiali_graph_data";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

// Import statements same as before

const GraphCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setEdges,
  searchTerm,
  onAddNodeCentered,
}) => {
  const { getViewport, project } = useReactFlow();

  const filteredNodes = nodes.filter((node) =>
    node.data.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEdges = edges.filter((edge) =>
    filteredNodes.some(
      (node) => node.id === edge.source || node.id === edge.target
    )
  );

  useEffect(() => {
    // Expose centering to parent when ready
    onAddNodeCentered(() => (label) => {
      const { x: offsetX, y: offsetY, zoom } = getViewport();

      const centerX = window.innerWidth / 2;
      const centerY = 500 / 2; // assuming canvas height ~500px

      const position = project({
        x: centerX - offsetX,
        y: centerY - offsetY,
      });

      const id = (Date.now() + Math.random()).toString();
      const newNode = {
        id,
        position,
        data: { label, traffic: "N/A", latency: "N/A" },
      };
      return newNode;
    });
  }, []);

  return (
    <Box
      sx={{
        height: "60vh",
        width: "100%",
        backgroundColor: "#f0f0f0",
        borderRadius: 2,
      }}
    >
      <ReactFlow
        nodes={filteredNodes}
        edges={filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) =>
          setEdges((eds) =>
            addEdge({ ...params, animated: true, label: "Auto" }, eds)
          )
        }
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={12} color="#aaa" />
      </ReactFlow>
    </Box>
  );
};

const Dashboard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const [edgeModalOpen, setEdgeModalOpen] = useState(false);

  const [getCenteredNodeFunc, setCenteredNodeFunc] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("kiali_graph_data"));
    if (saved) {
      setNodes(saved.nodes || []);
      setEdges(saved.edges || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kiali_graph_data", JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  const onAddNode = (label) => {
    if (getCenteredNodeFunc) {
      const newNode = getCenteredNodeFunc(label);
      setNodes((prev) => [...prev, newNode]);
    }
  };

  const onRemoveNode = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  };

  const onEditNode = (id, newLabel) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n
      )
    );
  };

  const onAddEdge = (source, target) => {
    const id = `e${source}-${target}`;
    setEdges((prev) => [
      ...prev,
      { id, source, target, label: "Auto", animated: true },
    ]);
  };

  const onRemoveEdge = (id) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  };

  const onEditEdge = (id, newLabel) => {
    setEdges((prev) =>
      prev.map((e) => (e.id === id ? { ...e, label: newLabel } : e))
    );
  };

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Service Mesh Graph
      </Typography>

      <TextField
        label="Search Service"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => setNodeModalOpen(true)}>
          Manage Services
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setEdgeModalOpen(true)}
        >
          Manage Connections
        </Button>
      </Stack>

      {/* Node Modal */}
      <Modal open={nodeModalOpen} onClose={() => setNodeModalOpen(false)}>
        <Box sx={modalStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Manage Services</Typography>
            <IconButton onClick={() => setNodeModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <NodeForm
            onAddNode={onAddNode}
            onRemoveNode={onRemoveNode}
            onEditNode={onEditNode}
            nodes={nodes}
          />
        </Box>
      </Modal>

      {/* Edge Modal */}
      <Modal open={edgeModalOpen} onClose={() => setEdgeModalOpen(false)}>
        <Box sx={modalStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Manage Connections</Typography>
            <IconButton onClick={() => setEdgeModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <EdgeForm
            onAddEdge={onAddEdge}
            onRemoveEdge={onRemoveEdge}
            onEditEdge={onEditEdge}
            edges={edges}
            nodes={nodes}
          />
        </Box>
      </Modal>

      <ReactFlowProvider>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setEdges={setEdges}
          searchTerm={searchTerm}
          onAddNodeCentered={setCenteredNodeFunc}
        />
      </ReactFlowProvider>
    </MainLayout>
  );
};

export default Dashboard;
