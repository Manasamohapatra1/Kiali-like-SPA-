import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import IstioConfig from "./pages/IstioConfig";
import { Box, Typography } from "@mui/material";

const Settings = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h5">Settings (Coming Soon)</Typography>
  </Box>
);

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/istio-config" element={<IstioConfig />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
