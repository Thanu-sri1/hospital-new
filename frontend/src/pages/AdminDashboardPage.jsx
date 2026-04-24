import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SectionCard from "../components/SectionCard";
import doctorApi from "../services/doctorApi";
import { useAuth } from "../context/AuthContext";

const initialDoctorForm = {
  name: "",
  email: "",
  password: "",
  specialization: "",
  experience: ""
};

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialDoctorForm);
  const [editingDoctorId, setEditingDoctorId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorApi.getAdminDoctors(token);
      setDoctors(data);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to load doctors." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const resetForm = () => {
    setForm(initialDoctorForm);
    setEditingDoctorId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setMessage({ type: "", text: "" });
      if (editingDoctorId) {
        const payload = {
          ...form,
          experience: Number(form.experience)
        };
        if (!payload.password) {
          delete payload.password;
        }
        await doctorApi.updateDoctorByAdmin(token, editingDoctorId, payload);
        setMessage({ type: "success", text: "Doctor updated successfully." });
      } else {
        await doctorApi.addDoctorByAdmin(token, {
          ...form,
          experience: Number(form.experience)
        });
        setMessage({ type: "success", text: "Doctor added successfully." });
      }
      resetForm();
      await loadDoctors();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to save doctor." });
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctorId(doctor.id);
    setForm({
      name: doctor.name,
      email: doctor.email,
      password: "",
      specialization: doctor.specialization,
      experience: String(doctor.experience)
    });
  };

  const handleDelete = async (doctorId) => {
    try {
      setMessage({ type: "", text: "" });
      await doctorApi.deleteDoctorByAdmin(token, doctorId);
      setMessage({ type: "success", text: "Doctor deleted successfully." });
      await loadDoctors();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to delete doctor." });
    }
  };

  const doctorCount = useMemo(() => doctors.length, [doctors]);

  return (
    <Stack spacing={3}>
      <SectionCard>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
          <div>
            <Typography variant="h3">Admin Dashboard</Typography>
            <Typography color="text.secondary">Manage doctor accounts and provider details.</Typography>
          </div>
          <Chip label={`${doctorCount} doctors`} color="secondary" />
        </Stack>
      </SectionCard>

      {message.text ? <Alert severity={message.type}>{message.text}</Alert> : null}

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <SectionCard>
            <Stack spacing={2.5}>
              <Typography variant="h5">{editingDoctorId ? "Update Doctor" : "Add Doctor"}</Typography>
              <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                <TextField label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <TextField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                <TextField
                  label={editingDoctorId ? "New Password (optional)" : "Password"}
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
                  {["Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology", "General Medicine"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Experience"
                  type="number"
                  value={form.experience}
                  onChange={(event) => setForm({ ...form, experience: event.target.value })}
                />
                <Stack direction="row" spacing={1.5}>
                  <Button type="submit" variant="contained" disabled={loading}>
                    {editingDoctorId ? "Update" : "Add Doctor"}
                  </Button>
                  {editingDoctorId ? (
                    <Button variant="outlined" onClick={resetForm}>
                      Cancel Edit
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={7}>
          <SectionCard>
            <Stack spacing={2}>
              <Typography variant="h5">Doctors</Typography>
              {doctors.map((doctor) => (
                <Stack
                  key={doctor.id}
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                  sx={{ border: "1px solid rgba(17,72,71,0.12)", borderRadius: 3, p: 2 }}
                >
                  <div>
                    <Typography variant="h6">{doctor.name}</Typography>
                    <Typography color="text.secondary">{doctor.email}</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                      <Chip label={doctor.specialization} />
                      <Chip label={`${doctor.experience} years`} variant="outlined" />
                    </Stack>
                  </div>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => handleEdit(doctor)}>
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(doctor.id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
              {!doctors.length ? <Typography color="text.secondary">No doctors available.</Typography> : null}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AdminDashboardPage;
