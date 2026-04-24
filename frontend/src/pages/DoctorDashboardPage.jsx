import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import dayjs from "dayjs";
import SectionCard from "../components/SectionCard";
import doctorApi from "../services/doctorApi";
import appointmentApi from "../services/appointmentApi";
import { useAuth } from "../context/AuthContext";

const initialSlotForm = {
  date: "",
  startTime: "",
  endTime: ""
};

const DoctorDashboardPage = () => {
  const { token, doctor } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [slotForm, setSlotForm] = useState(initialSlotForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [availabilityData, appointmentData] = await Promise.all([
        doctorApi.getMyAvailability(token),
        appointmentApi.getMyDoctorAppointments(token)
      ]);
      setAvailability(availabilityData.availableSlots || []);
      setAppointments(appointmentData);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to load doctor dashboard." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAddSlot = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      if (editingSlotId) {
        await doctorApi.updateAvailability(token, editingSlotId, slotForm);
      } else {
        await doctorApi.addAvailability(token, slotForm);
      }
      setSlotForm(initialSlotForm);
      setEditingSlotId("");
      setMessage({ type: "success", text: editingSlotId ? "Availability slot updated." : "Availability slot added." });
      await loadDashboard();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to save slot." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      setMessage({ type: "", text: "" });
      await doctorApi.deleteAvailability(token, slotId);
      setMessage({ type: "success", text: "Availability slot deleted." });
      await loadDashboard();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to delete slot." });
    }
  };

  const handleEditSlot = (slot) => {
    setEditingSlotId(slot._id);
    setSlotForm({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime
    });
  };

  if (loading) {
    return (
      <SectionCard>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Loading doctor dashboard...</Typography>
        </Stack>
      </SectionCard>
    );
  }

  return (
    <Stack spacing={3}>
      <SectionCard>
        <Stack spacing={1}>
          <Typography variant="h3">Doctor Dashboard</Typography>
          <Typography color="text.secondary">
            {doctor?.name} | {doctor?.specialization}
          </Typography>
        </Stack>
      </SectionCard>

      {message.text ? <Alert severity={message.type}>{message.text}</Alert> : null}

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <SectionCard>
            <Stack spacing={2.5}>
              <Typography variant="h5">{editingSlotId ? "Update Availability" : "Add Availability"}</Typography>
              <Stack component="form" spacing={2} onSubmit={handleAddSlot}>
                <TextField
                  label="Date"
                  type="date"
                  value={slotForm.date}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => setSlotForm({ ...slotForm, date: event.target.value })}
                />
                <TextField
                  label="Start Time"
                  type="time"
                  value={slotForm.startTime}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => setSlotForm({ ...slotForm, startTime: event.target.value })}
                />
                <TextField
                  label="End Time"
                  type="time"
                  value={slotForm.endTime}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => setSlotForm({ ...slotForm, endTime: event.target.value })}
                />
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? "Saving..." : editingSlotId ? "Update Slot" : "Add Slot"}
                </Button>
                {editingSlotId ? (
                  <Button variant="outlined" onClick={() => {
                    setEditingSlotId("");
                    setSlotForm(initialSlotForm);
                  }}>
                    Cancel Edit
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={7}>
          <SectionCard>
            <Stack spacing={2}>
              <Typography variant="h5">Availability Slots</Typography>
              {availability.length ? (
                availability.map((slot) => (
                  <Stack
                    key={slot._id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ border: "1px solid rgba(17,72,71,0.12)", borderRadius: 3, p: 1.5 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Chip label={dayjs(slot.date).format("DD MMM YYYY")} />
                      <Chip label={`${slot.startTime}-${slot.endTime}`} variant="outlined" />
                      <Chip
                        label={slot.isBooked ? "Booked" : "Available"}
                        color={slot.isBooked ? "warning" : "success"}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEditSlot(slot)} disabled={slot.isBooked}>
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteSlot(slot._id)} disabled={slot.isBooked}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                ))
              ) : (
                <Typography color="text.secondary">No availability slots added yet.</Typography>
              )}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard>
        <Stack spacing={2}>
          <Typography variant="h5">Your Appointments</Typography>
          {appointments.length ? (
            appointments.map((appointment) => (
              <Stack
                key={appointment._id}
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={1.5}
                sx={{ border: "1px solid rgba(17,72,71,0.12)", borderRadius: 3, p: 2 }}
              >
                <div>
                  <Typography variant="h6">{appointment.patient?.name}</Typography>
                  <Typography color="text.secondary">{appointment.patient?.email}</Typography>
                </div>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                  <Chip label={dayjs(appointment.appointmentDate).format("DD MMM YYYY")} />
                  <Chip label={appointment.timeSlot} variant="outlined" />
                  <Chip label={appointment.status} color={appointment.status === "BOOKED" ? "success" : "default"} />
                </Stack>
              </Stack>
            ))
          ) : (
            <Typography color="text.secondary">No appointments assigned yet.</Typography>
          )}
        </Stack>
      </SectionCard>
    </Stack>
  );
};

export default DoctorDashboardPage;
