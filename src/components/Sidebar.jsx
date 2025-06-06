import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import TuneIcon from "@mui/icons-material/Tune";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: "Graph", icon: <DashboardIcon />, path: "/" },
    { text: "Overview", icon: <InfoIcon />, path: "/overview" },
    { text: "Istio Config", icon: <TuneIcon />, path: "/istio-config" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1e293b",
          color: "#fff",
        },
      }}
    >
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                backgroundColor: isActive ? "#334155" : "inherit",
                "&:hover": {
                  backgroundColor: "#475569",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ color: "white" }}
                primaryTypographyProps={{
                  fontWeight: isActive ? "bold" : "normal",
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
