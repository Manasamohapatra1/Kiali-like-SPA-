import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import { useState } from "react";

const NodeForm = ({ onAddNode, onRemoveNode, onEditNode, nodes }) => {
  const [newLabel, setNewLabel] = useState("");

  const [editId, setEditId] = useState("");
  const [editLabel, setEditLabel] = useState("");

  const [removeId, setRemoveId] = useState("");

  return (
    <Stack spacing={3}>
      <Typography variant="h6">➕ Add New Service</Typography>
      <TextField
        label="Service Label"
        fullWidth
        value={newLabel}
        onChange={(e) => setNewLabel(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (newLabel.trim()) {
            onAddNode(newLabel);
            setNewLabel("");
          }
        }}
      >
        Add Node
      </Button>

      <Divider />

      <Typography variant="h6">✏️ Edit Service</Typography>
      <TextField
        select
        label="Select Node"
        value={editId}
        onChange={(e) => {
          const node = nodes.find((n) => n.id === e.target.value);
          setEditId(e.target.value);
          setEditLabel(node?.data?.label || "");
        }}
        fullWidth
      >
        {nodes.map((node) => (
          <MenuItem key={node.id} value={node.id}>
            {node.data.label}
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
            onEditNode(editId, editLabel);
            setEditId("");
            setEditLabel("");
          }
        }}
      >
        Update Node
      </Button>

      <Divider />

      <Typography variant="h6">🗑️ Remove Service</Typography>
      <TextField
        select
        label="Select Node"
        value={removeId}
        onChange={(e) => setRemoveId(e.target.value)}
        fullWidth
      >
        {nodes.map((node) => (
          <MenuItem key={node.id} value={node.id}>
            {node.data.label}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          if (removeId) {
            onRemoveNode(removeId);
            setRemoveId("");
          }
        }}
      >
        Remove Node
      </Button>
    </Stack>
  );
};

export default NodeForm;
