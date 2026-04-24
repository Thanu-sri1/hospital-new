import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Link as RouterLink } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";

const highlights = [
  {
    title: "Real-time booking",
    description: "Prevent double booking with centralized appointment validation."
  },
  {
    title: "Patient-first access",
    description: "JWT-secured login, profile management, and patient-specific views."
  },
  {
    title: "Connected services",
    description: "Doctor, appointment, and notification services communicate over HTTP."
  }
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack spacing={4}>
      <SectionCard
        sx={{
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.95), rgba(213,236,233,0.92)), linear-gradient(135deg, #f6fcfb 0%, #d9ece8 100%)"
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack spacing={2.5}>
              <Chip label="Production-ready microservices demo" sx={{ width: "fit-content", fontWeight: 700 }} />
              <Typography variant="h2" sx={{ maxWidth: 620 }}>
                Healthcare scheduling that feels calm, fast, and reliable.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
                Register as a patient, browse specialists, book a verified time slot, and manage appointments from one streamlined dashboard.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button size="large" variant="contained" component={RouterLink} to={isAuthenticated ? "/doctors" : "/auth"}>
                  {isAuthenticated ? "Browse Doctors" : "Get Started"}
                </Button>
                <Button size="large" variant="outlined" component={RouterLink} to={isAuthenticated ? "/appointments" : "/auth"}>
                  View Appointments
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                minHeight: 320,
                borderRadius: 5,
                background:
                  "linear-gradient(160deg, rgba(12,82,80,1) 0%, rgba(34,122,118,0.94) 55%, rgba(243,179,74,0.95) 100%)",
                color: "white",
                p: 3,
                display: "grid",
                gap: 2
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <MedicalServicesIcon />
                <Typography variant="h6">Doctor Service</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CalendarMonthIcon />
                <Typography variant="h6">Appointment Core</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <NotificationsActiveIcon />
                <Typography variant="h6">Notification Events</Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: "auto" }}>
                Single MongoDB instance. Independent Node.js services. React frontend. Docker-first workflow.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </SectionCard>

      <Grid container spacing={3}>
        {highlights.map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
            <SectionCard sx={{ height: "100%" }}>
              <Stack spacing={1.5}>
                <Typography variant="h5">{item.title}</Typography>
                <Typography color="text.secondary">{item.description}</Typography>
              </Stack>
            </SectionCard>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default HomePage;
