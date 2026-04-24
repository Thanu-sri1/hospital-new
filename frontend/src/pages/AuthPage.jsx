import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import patientApi from "../services/patientApi";
import { useAuth } from "../context/AuthContext";

const initialRegisterState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  age: "",
  gender: "Male"
};

const initialLoginState = {
  email: "",
  password: ""
};

const AuthPage = () => {
  const [tab, setTab] = useState(0);
  const [registerForm, setRegisterForm] = useState(initialRegisterState);
  const [loginForm, setLoginForm] = useState(initialLoginState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateRegister = () => {
    if (Object.values(registerForm).some((value) => !String(value).trim())) {
      return "Please fill in all registration fields.";
    }
    if (registerForm.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (Number(registerForm.age) < 0) {
      return "Age must be valid.";
    }
    return "";
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const errorText = validateRegister();
    if (errorText) {
      setMessage({ type: "error", text: errorText });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      const result = await patientApi.register({
        ...registerForm,
        age: Number(registerForm.age)
      });
      login(result);
      navigate("/doctors");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setMessage({ type: "error", text: "Enter email and password." });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      const result = await patientApi.login(loginForm);
      login(result);
      navigate("/doctors");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Login failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <SectionCard sx={{ height: "100%", background: "linear-gradient(180deg, #0c5250 0%, #116f6c 100%)", color: "white" }}>
          <Stack spacing={2.5}>
            <Typography variant="h3">Patient Access</Typography>
            <Typography sx={{ opacity: 0.9 }}>
              Create your account to manage your profile, discover specialists, and reserve appointment slots without double booking conflicts.
            </Typography>
            <Box
              sx={{
                mt: 1,
                p: 2.5,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255,255,255,0.12)"
              }}
            >
              <Typography variant="body2">
                Tip: seeded doctors are available immediately after startup, so once you log in you can book right away.
              </Typography>
            </Box>
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={7}>
        <SectionCard>
          <Stack spacing={3}>
            <Tabs value={tab} onChange={(_, value) => setTab(value)}>
              <Tab label="Register" />
              <Tab label="Login" />
            </Tabs>

            {message.text ? <Alert severity={message.type || "info"}>{message.text}</Alert> : null}

            {tab === 0 ? (
              <Box component="form" onSubmit={handleRegister}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={registerForm.name}
                      onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={registerForm.email}
                      onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={registerForm.password}
                      onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={registerForm.phone}
                      onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      value={registerForm.age}
                      onChange={(event) => setRegisterForm({ ...registerForm, age: event.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Gender"
                      value={registerForm.gender}
                      onChange={(event) => setRegisterForm({ ...registerForm, gender: event.target.value })}
                    >
                      {["Male", "Female", "Other"].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" size="large" disabled={loading}>
                      {loading ? "Creating account..." : "Register and Continue"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleLogin}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  />
                  <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
};

export default AuthPage;
