# Healthcare Appointment Management System

Production-ready microservices project with:

- `patient-service`
- `doctor-service`
- `appointment-service`
- `notification-service`
- `frontend`
- single shared MongoDB instance

## Run

```bash
docker-compose up --build
```

## Service URLs

- Frontend: `http://localhost:5173`
- Patient Service: `http://localhost:4001`
- Doctor Service: `http://localhost:4002`
- Appointment Service: `http://localhost:4003`
- Notification Service: `http://localhost:4004`

## Core APIs

- `POST /patients/register`
- `POST /patients/login`
- `GET /patients/profile`
- `GET /doctors`
- `POST /appointments/book`
- `GET /appointments/patient`
- `DELETE /appointments/:id`
- `POST /notifications/send`

## Notes

- All services connect to the same MongoDB container through separate database names.
- Doctor seed data is inserted automatically on first startup.
- Appointment booking validates the patient, validates doctor availability, prevents double booking, and triggers a notification.
