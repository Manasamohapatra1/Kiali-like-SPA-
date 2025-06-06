import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import { useState } from "react";

const EdgeForm = ({ onAddEdge, onRemoveEdge, onEditEdge, edges, nodes }) => {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");

  const [editId, setEditId] = useState("");
  const [editLabel, setEditLabel] = useState("");

  const [removeId, setRemoveId] = useState("");

  return (
    <Stack spacing={3}>
      <Typography variant="h6">🔗 Add New Connection</Typography>
      <TextField
        select
        label="Source Node"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        fullWidth
      >
        {nodes.map((node) => (
          <MenuItem key={node.id} value={node.id}>
            {node.data.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Target Node"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        fullWidth
      >
        {nodes.map((node) => (
          <MenuItem key={node.id} value={node.id}>
            {node.data.label}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (source && target && source !== target) {
            onAddEdge(source, target);
            setSource("");
            setTarget("");
          }
        }}
      >
        Add Edge
      </Button>

      <Divider />

      <Typography variant="h6">✏️ Edit Connection</Typography>
      <TextField
        select
        label="Select Edge"
        value={editId}
        onChange={(e) => {
          const edge = edges.find((ed) => ed.id === e.target.value);
          setEditId(e.target.value);
          setEditLabel(edge?.label || "");
        }}
        fullWidth
      >
        {edges.map((edge) => (
          <MenuItem key={edge.id} value={edge.id}>
            {edge.source} → {edge.target} ({edge.label})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="New Label"
        fullWidth
        value={editLabel}
        onChange={(e) => setEditLabel(e.target.value)}
      />
      <Button
        variant="contained"
        color="warning"
        onClick={() => {
          if (editId && editLabel.trim()) {
            onEditEdge(editId, editLabel);
            setEditId("");
            setEditLabel("");
          }
        }}
      >
        Update Edge
      </Button>

      <Divider />

      <Typography variant="h6">🗑️ Remove Connection</Typography>
      <TextField
        select
        label="Select Edge"
        value={removeId}
        onChange={(e) => setRemoveId(e.target.value)}
        fullWidth
      >
        {edges.map((edge) => (
          <MenuItem key={edge.id} value={edge.id}>
            {edge.source} → {edge.target} ({edge.label})
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          if (removeId) {
            onRemoveEdge(removeId);
            setRemoveId("");
          }
        }}
      >
        Remove Edge
      </Button>
    </Stack>
  );
};

export default EdgeForm;
