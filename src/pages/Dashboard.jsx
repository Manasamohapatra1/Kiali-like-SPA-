import { useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
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

const Dashboard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const [edgeModalOpen, setEdgeModalOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY));
    if (saved) {
      setNodes(saved.nodes || []);
      setEdges(saved.edges || []);
    } else {
      setNodes([
        {
          id: "1",
          position: { x: 100, y: 100 },
          data: { label: "Service 1", traffic: "80%", latency: "120ms" },
        },
        {
          id: "2",
          position: { x: 400, y: 100 },
          data: { label: "Service 2", traffic: "60%", latency: "90ms" },
        },
      ]);
      setEdges([
        {
          id: "e1-2",
          source: "1",
          target: "2",
          label: "20 RPS",
          animated: true,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  const onAddNode = (label) => {
    const id = (Date.now() + Math.random()).toString();
    const newNode = {
      id,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      data: { label, traffic: "N/A", latency: "N/A" },
    };
    setNodes((prev) => [...prev, newNode]);
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
    const newEdge = { id, source, target, label: "Auto", animated: true };
    setEdges((prev) => [...prev, newEdge]);
  };

  const onRemoveEdge = (id) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  };

  const onEditEdge = (id, newLabel) => {
    setEdges((prev) =>
      prev.map((e) => (e.id === id ? { ...e, label: newLabel } : e))
    );
  };

  const filteredNodes = nodes.filter((node) =>
    node.data.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEdges = edges.filter((edge) =>
    filteredNodes.some(
      (node) => node.id === edge.source || node.id === edge.target
    )
  );

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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setNodeModalOpen(true)}
        >
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

      {/* Graph Canvas */}
      <Box
        sx={{
          height: "60vh",
          width: "100%",
          backgroundColor: "#f0f0f0",
          boxShadow: 1,
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Box sx={{ height: "100%", width: "100%" }}>
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
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
