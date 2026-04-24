import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import doctorApi from "../services/doctorApi";
import appointmentApi from "../services/appointmentApi";
import { useAuth } from "../context/AuthContext";

const DoctorSlotsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const loadDoctorSlots = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      const data = await doctorApi.getDoctorSlots(id);
      setDoctorData(data);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to load doctor slots." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorSlots();
  }, [id]);

  const uniqueDates = useMemo(
    () => Array.from(new Set((doctorData?.availableSlots || []).map((slot) => slot.date))),
    [doctorData]
  );

  const filteredSlots = useMemo(
    () =>
      (doctorData?.availableSlots || []).filter((slot) =>
        selectedDate ? slot.date === selectedDate : true
      ),
    [doctorData, selectedDate]
  );

  const handleBook = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      setMessage({ type: "error", text: "Please select a date and an available slot." });
      return;
    }

    try {
      setBookingLoading(true);
      setMessage({ type: "", text: "" });
      await appointmentApi.bookAppointment(token, {
        doctorId: doctorData.doctor.id || doctorData.doctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedTimeSlot
      });
      setMessage({ type: "success", text: "Appointment booked successfully." });
      setSelectedTimeSlot("");
      await loadDoctorSlots();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to book appointment." });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <SectionCard>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Loading doctor slots...</Typography>
        </Stack>
      </SectionCard>
    );
  }

  return (
    <Stack spacing={3}>
      <SectionCard>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
          <div>
            <Typography variant="h3">{doctorData?.doctor?.name}</Typography>
            <Typography color="text.secondary">
              {doctorData?.doctor?.specialization} | {doctorData?.doctor?.experience} years experience
            </Typography>
          </div>
          <Button variant="outlined" onClick={() => navigate("/doctors")}>
            Back to Doctors
          </Button>
        </Stack>
      </SectionCard>

      {message.text ? <Alert severity={message.type}>{message.text}</Alert> : null}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SectionCard>
            <Stack spacing={2}>
              <Typography variant="h5">Choose Slot</Typography>
              <TextField
                select
                label="Select Date"
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setSelectedTimeSlot("");
                }}
              >
                {uniqueDates.map((date) => (
                  <MenuItem key={date} value={date}>
                    {dayjs(date).format("DD MMM YYYY")}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Select Time Slot"
                value={selectedTimeSlot}
                disabled={!selectedDate}
                onChange={(event) => setSelectedTimeSlot(event.target.value)}
              >
                {filteredSlots.map((slot) => {
                  const slotValue = `${slot.startTime}-${slot.endTime}`;
                  return (
                    <MenuItem key={slot._id || slotValue} value={slotValue}>
                      {slotValue}
                    </MenuItem>
                  );
                })}
              </TextField>
              <Button variant="contained" onClick={handleBook} disabled={bookingLoading || !filteredSlots.length}>
                {bookingLoading ? "Booking..." : "Book Appointment"}
              </Button>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <SectionCard>
            <Stack spacing={2}>
              <Typography variant="h5">Available Slots</Typography>
              {filteredSlots.length ? (
                filteredSlots.map((slot) => (
                  <Stack
                    key={slot._id}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1.5}
                    sx={{ border: "1px solid rgba(17,72,71,0.12)", borderRadius: 3, p: 2 }}
                  >
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip label={dayjs(slot.date).format("DD MMM YYYY")} />
                      <Chip label={`${slot.startTime}-${slot.endTime}`} variant="outlined" />
                      <Chip label="Available" color="success" />
                    </Stack>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedDate(slot.date);
                        setSelectedTimeSlot(`${slot.startTime}-${slot.endTime}`);
                      }}
                    >
                      Select
                    </Button>
                  </Stack>
                ))
              ) : (
                <Typography color="text.secondary">No open slots available for this doctor right now.</Typography>
              )}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DoctorSlotsPage;
