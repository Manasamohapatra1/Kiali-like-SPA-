import { Box, Typography } from "@mui/material";

const Overview = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4" color="pink.500" gutterBottom>
      Overview
    </Typography>
    <Typography>
      System-wide metrics, stats, or brief summaries go here.
    </Typography>
  </Box>
);

export default Overview;
