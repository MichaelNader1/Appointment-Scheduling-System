#  Appointment Scheduling System – PUA

This is a .NET MVC-based appointment scheduling system developed for **Pharos University in Alexandria (PUA)**.  
It allows students (patients) to book appointments with doctors, and doctors can approve, edit, or delete these appointments.  
Admins have full access to manage all users and appointments.

---

## 🛠 Technologies Used

- ASP.NET Core MVC  
- Entity Framework Core  
- Identity (Authentication & Authorization)  
- SQL Server  
- Mailjet (for email notifications)

---

## 👤 User Roles

- **Admin**
  - Full access to manage users and appointments.
- **Doctor**
  - View appointments.
  - Approve or reject appointments.
- **Patient**
  - View doctors.
  - Request, edit, or delete appointments.

---

## 🔑 Features

- Login system using ASP.NET Identity with roles (Admin, Doctor, Patient).
- Patients can:
  - Browse available doctors.
  - Schedule appointments.
  - Edit or delete their own appointments.
- Doctors can:
  - View incoming appointment requests.
  - Approve or reject appointments.
- Admins can:
  - Manage all users and appointments.
- Email notifications on appointment creation.

---

## 📦 API Endpoints

- `POST /api/appointment/SaveCalenderData`  
  Save or update an appointment.

- `GET /api/appointment/GetCalenderData`  
  Get all appointments for the current user (based on role).

- `GET /api/appointment/GetCalenderDataById/{id}`  
  Get details of a specific appointment.

- `GET /api/appointment/DeleteAppointment/{id}`  
  Delete an appointment by ID.

- `GET /api/appointment/ConfirmAppointment/{id}`  
  Approve an appointment (Doctor only).

---

## 📁 Project Structure

- `Controllers/Api/AppointmentApiController.cs` – Handles API logic.
- `Services/AppointmentService.cs` – Business logic for appointments.
- `Models/Appointment.cs` – Main appointment entity.
- `Models/ViewModel/AppointmentViewModel.cs` – View model for API/UI.
- `Utility/EmailSender.cs` – Handles sending email notifications.

---

## 📧 Email Notifications

Uses **Mailjet** to send email confirmations to both patient and doctor.  
Make sure to configure your `Mailjet API Key` and `Secret Key` in `EmailSender.cs`.

---

## ⚠️ Notes

- Ensure Identity roles (`Admin`, `Doctor`, `Patient`) are seeded or created.
- Admins can access and manage everything in the system.
