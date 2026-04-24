import { useState } from "react";
import { Alert, Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import doctorApi from "../services/doctorApi";
import { useAuth } from "../context/AuthContext";

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      const result = await doctorApi.loginAdmin(form);
      login(result, "ADMIN");
      navigate("/admin/dashboard");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Admin login failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <SectionCard sx={{ height: "100%", background: "linear-gradient(180deg, #4d3417 0%, #8c5b1c 100%)", color: "white" }}>
          <Stack spacing={2}>
            <Typography variant="h3">Admin Access</Typography>
            <Typography sx={{ opacity: 0.9 }}>
              Manage doctor accounts, keep provider details current, and control the operational side of the platform.
            </Typography>
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={7}>
        <SectionCard>
          <Stack spacing={3}>
            <Typography variant="h4">Admin Login</Typography>
            {message.text ? <Alert severity={message.type}>{message.text}</Alert> : null}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
};

export default AdminLoginPage;
