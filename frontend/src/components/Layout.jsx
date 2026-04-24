import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import HealingIcon from "@mui/icons-material/Healing";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { isAuthenticated, logout, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #f4f8f8 0%, #e8f2f1 100%)" }}>
      <AppBar position="sticky" elevation={0} sx={{ background: "rgba(12, 82, 80, 0.95)", backdropFilter: "blur(16px)" }}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <HealingIcon />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ color: "inherit", textDecoration: "none", fontWeight: 700, letterSpacing: 0.4 }}
            >
              CareAxis
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Button color="inherit" component={RouterLink} to="/" disabled={location.pathname === "/"}>
              Home
            </Button>
            {isAuthenticated && role === "PATIENT" && (
              <Button color="inherit" component={RouterLink} to="/doctors" disabled={location.pathname === "/doctors"}>
                Doctors
              </Button>
            )}
            {isAuthenticated && role === "PATIENT" && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/appointments"
                disabled={location.pathname === "/appointments"}
              >
                Appointments
              </Button>
            )}
            {isAuthenticated && role === "DOCTOR" && (
              <Button color="inherit" component={RouterLink} to="/doctor/dashboard" disabled={location.pathname === "/doctor/dashboard"}>
                Doctor Dashboard
              </Button>
            )}
            {isAuthenticated && role === "ADMIN" && (
              <Button color="inherit" component={RouterLink} to="/admin/dashboard" disabled={location.pathname === "/admin/dashboard"}>
                Admin Dashboard
              </Button>
            )}
            {!isAuthenticated ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button variant="contained" color="secondary" component={RouterLink} to="/auth">
                  Patient Access
                </Button>
                <Button variant="outlined" color="inherit" component={RouterLink} to="/doctor/login">
                  Doctor Login
                </Button>
                <Button variant="outlined" color="inherit" component={RouterLink} to="/doctor/register">
                  Doctor Register
                </Button>
                <Button variant="outlined" color="inherit" component={RouterLink} to="/admin/login">
                  Admin Login
                </Button>
              </Stack>
            ) : (
              <>
                <Typography variant="body2" sx={{ opacity: 0.92 }}>
                  {user?.name || user?.email}
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
