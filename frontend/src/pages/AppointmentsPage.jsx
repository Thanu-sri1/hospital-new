import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import SectionCard from "../components/SectionCard";
import appointmentApi from "../services/appointmentApi";
import { useAuth } from "../context/AuthContext";

const AppointmentsPage = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [cancelId, setCancelId] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentApi.getPatientAppointments(token);
      setAppointments(data);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to load appointments." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      setCancelId(appointmentId);
      setMessage({ type: "", text: "" });
      await appointmentApi.cancelAppointment(token, appointmentId);
      setMessage({ type: "success", text: "Appointment cancelled successfully." });
      await loadAppointments();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to cancel appointment." });
    } finally {
      setCancelId("");
    }
  };

  if (loading) {
    return (
      <SectionCard>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Loading appointments...</Typography>
        </Stack>
      </SectionCard>
    );
  }

  return (
    <Stack spacing={3}>
      <SectionCard>
        <Stack spacing={1}>
          <Typography variant="h3">Your Appointments</Typography>
          <Typography color="text.secondary">
            Review your upcoming and cancelled appointments in one place.
          </Typography>
        </Stack>
      </SectionCard>

      {message.text ? <Alert severity={message.type}>{message.text}</Alert> : null}

      {appointments.length === 0 ? (
        <SectionCard>
          <Typography>No appointments booked yet.</Typography>
        </SectionCard>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <SectionCard sx={{ height: "100%" }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">{appointment.doctor?.name || "Doctor"}</Typography>
                    <Chip
                      label={appointment.status}
                      color={appointment.status === "BOOKED" ? "success" : "default"}
                    />
                  </Stack>
                  <Typography color="text.secondary">{appointment.doctor?.specialization}</Typography>
                  <Typography>
                    {dayjs(appointment.appointmentDate).format("DD MMM YYYY")} at {appointment.timeSlot}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patient: {appointment.patient?.name} | Email: {appointment.patient?.email}
                  </Typography>
                  {appointment.status === "BOOKED" ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancel(appointment._id)}
                      disabled={cancelId === appointment._id}
                    >
                      {cancelId === appointment._id ? "Cancelling..." : "Cancel Appointment"}
                    </Button>
                  ) : null}
                </Stack>
              </SectionCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default AppointmentsPage;
