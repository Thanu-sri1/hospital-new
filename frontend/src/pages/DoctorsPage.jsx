import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import doctorApi from "../services/doctorApi";
import appointmentApi from "../services/appointmentApi";
import { useAuth } from "../context/AuthContext";

const DoctorsPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingState, setBookingState] = useState({
    open: false,
    doctor: null,
    appointmentDate: "",
    timeSlot: ""
  });
  const [bookingMessage, setBookingMessage] = useState({ type: "", text: "" });
  const [bookingLoading, setBookingLoading] = useState(false);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await doctorApi.getDoctors(specialization);
      setDoctors(data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [specialization]);

  const specializations = useMemo(
    () => Array.from(new Set(doctors.map((doctor) => doctor.specialization))),
    [doctors]
  );

  const slotOptions = bookingState.doctor
    ? bookingState.doctor.availableSlots.filter((slot) => slot.date === bookingState.appointmentDate)
    : [];

  const openBooking = (doctor) => {
    setBookingMessage({ type: "", text: "" });
    setBookingState({
      open: true,
      doctor,
      appointmentDate: "",
      timeSlot: ""
    });
  };

  const closeBooking = () => {
    setBookingState({
      open: false,
      doctor: null,
      appointmentDate: "",
      timeSlot: ""
    });
    setBookingMessage({ type: "", text: "" });
  };

  const showAvailability = (doctor) => {
    navigate(`/doctors/${doctor._id}/slots`);
  };

  const handleBookAppointment = async () => {
    if (!bookingState.doctor || !bookingState.appointmentDate || !bookingState.timeSlot) {
      setBookingMessage({ type: "error", text: "Select a date and time slot." });
      return;
    }

    try {
      setBookingLoading(true);
      setBookingMessage({ type: "", text: "" });
      await appointmentApi.bookAppointment(token, {
        doctorId: bookingState.doctor._id,
        appointmentDate: bookingState.appointmentDate,
        timeSlot: bookingState.timeSlot
      });
      setBookingMessage({ type: "success", text: "Appointment booked successfully." });
      await loadDoctors();
      setTimeout(closeBooking, 900);
    } catch (apiError) {
      setBookingMessage({
        type: "error",
        text: apiError.response?.data?.message || "Unable to book appointment."
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <SectionCard>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }}>
          <div>
            <Typography variant="h3">Find Doctors</Typography>
            <Typography color="text.secondary">Browse available specialists and reserve a verified slot.</Typography>
          </div>
          <TextField
            select
            label="Filter specialization"
            value={specialization}
            onChange={(event) => setSpecialization(event.target.value)}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">All Specializations</MenuItem>
            {specializations.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </SectionCard>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item xs={12} md={6} key={doctor._id}>
            <SectionCard sx={{ height: "100%" }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <div>
                    <Typography variant="h5">{doctor.name}</Typography>
                    <Typography color="text.secondary">{doctor.specialization}</Typography>
                  </div>
                  <Chip label={`${doctor.experience} yrs`} color="secondary" />
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {doctor.availableSlots.slice(0, 4).map((slot, index) => (
                    <Chip
                      key={`${doctor._id}-${index}`}
                      label={`${dayjs(slot.date).format("DD MMM")} ${slot.startTime}-${slot.endTime}`}
                      variant="outlined"
                    />
                  ))}
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button variant="outlined" onClick={() => showAvailability(doctor)}>
                    View Availability
                  </Button>
                  <Button variant="contained" onClick={() => openBooking(doctor)} disabled={loading || !doctor.availableSlots.length}>
                  Book Appointment
                  </Button>
                </Stack>
              </Stack>
            </SectionCard>
          </Grid>
        ))}
      </Grid>

      {!loading && doctors.length === 0 ? (
        <SectionCard>
          <Typography>No doctors found for the selected filter.</Typography>
        </SectionCard>
      ) : null}

      <Dialog open={bookingState.open} onClose={closeBooking} fullWidth maxWidth="sm">
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5}>
            <Typography color="text.secondary">{bookingState.doctor?.name}</Typography>
            {bookingMessage.text ? <Alert severity={bookingMessage.type}>{bookingMessage.text}</Alert> : null}
            <TextField
              select
              label="Appointment Date"
              value={bookingState.appointmentDate}
              onChange={(event) =>
                setBookingState({
                  ...bookingState,
                  appointmentDate: event.target.value,
                  timeSlot: ""
                })
              }
            >
              {Array.from(new Set((bookingState.doctor?.availableSlots || []).map((slot) => slot.date))).map((date) => (
                <MenuItem key={date} value={date}>
                  {dayjs(date).format("DD MMM YYYY")}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Time Slot"
              value={bookingState.timeSlot}
              onChange={(event) => setBookingState({ ...bookingState, timeSlot: event.target.value })}
              disabled={!bookingState.appointmentDate}
            >
              {slotOptions.map((slot) => {
                const slotValue = `${slot.startTime}-${slot.endTime}`;
                return (
                  <MenuItem key={slotValue} value={slotValue}>
                    {slotValue}
                  </MenuItem>
                );
              })}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeBooking}>Close</Button>
          <Button variant="contained" onClick={handleBookAppointment} disabled={bookingLoading}>
            {bookingLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default DoctorsPage;
