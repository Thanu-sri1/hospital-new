import { useState } from "react";
import { Alert, Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import doctorApi from "../services/doctorApi";
import { useAuth } from "../context/AuthContext";

const DoctorLoginPage = () => {
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
      const result = await doctorApi.loginDoctor(form);
      login(result, "DOCTOR");
      navigate("/doctor/dashboard");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Doctor login failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <SectionCard sx={{ height: "100%", background: "linear-gradient(180deg, #173130 0%, #0c5250 100%)", color: "white" }}>
          <Stack spacing={2}>
            <Typography variant="h3">Doctor Portal</Typography>
            <Typography sx={{ opacity: 0.9 }}>
              Sign in to manage availability, control slot updates, and review appointments assigned to you.
            </Typography>
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={7}>
        <SectionCard>
          <Stack spacing={3}>
            <Typography variant="h4">Doctor Login</Typography>
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
                <Button component={RouterLink} to="/doctor/register" variant="text">
                  Need an account? Register as a doctor
                </Button>
              </Stack>
            </Box>
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
};

export default DoctorLoginPage;
