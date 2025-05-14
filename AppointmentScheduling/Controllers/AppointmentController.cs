using System;
using AppointmentScheduling.Services;
using AppointmentScheduling.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppointmentScheduling.Controllers
{
    [Authorize]
    public class AppointmentController : Controller
    {
        public readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService AppointmentService) { 
            _appointmentService = AppointmentService;
        }
        public IActionResult Index()
        {
            ViewBag.Duration = Helper.GetTimeDropDown();
            ViewBag.DoctorList = _appointmentService.GetDoctorsList();
            ViewBag.PatientList = _appointmentService.GetPatientsList();

            return View();
        }

    }
}
