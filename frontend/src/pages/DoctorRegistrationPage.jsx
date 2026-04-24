import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import doctorApi from "../services/doctorApi";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  specialization: "Cardiologist",
  experience: ""
};

const DoctorRegistrationPage = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password || !form.specialization || !form.experience) {
      setMessage({ type: "error", text: "Please complete all doctor registration fields." });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      const result = await doctorApi.registerDoctor({
        ...form,
        experience: Number(form.experience)
      });
      login(result, "DOCTOR");
      navigate("/doctor/dashboard");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Doctor registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <SectionCard sx={{ height: "100%", background: "linear-gradient(180deg, #104645 0%, #1b7b77 100%)", color: "white" }}>
          <Stack spacing={2}>
            <Typography variant="h3">Doctor Registration</Typography>
            <Typography sx={{ opacity: 0.9 }}>
              Create your doctor account, define your specialization, and start managing available slots securely.
            </Typography>
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={7}>
        <SectionCard>
          <Stack spacing={3}>
            <Typography variant="h4">Register as Doctor</Typography>
            {message.text ? <Alert severity={message.type}>{message.text}</Alert> : null}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField label="Full Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <TextField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                <TextField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
                <TextField
                  select
                  label="Specialization"
                  value={form.specialization}
                  onChange={(event) => setForm({ ...form, specialization: event.target.value })}
                >
                  {["Cardiologist", "Dermatologist", "Pediatrician", "Orthopedic", "Neurologist", "General Physician"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Experience (years)"
                  type="number"
                  value={form.experience}
                  onChange={(event) => setForm({ ...form, experience: event.target.value })}
                />
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Creating account..." : "Register"}
                </Button>
                <Button component={RouterLink} to="/doctor/login" variant="text">
                  Already registered? Doctor login
                </Button>
              </Stack>
            </Box>
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
};

export default DoctorRegistrationPage;
