using AppointmentScheduling.Services;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using AppointmentScheduling.Models;
using AppointmentScheduling.Models.ViewModel;
using AppointmentScheduling.Utility;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AppointmentScheduling.Controllers.Api
{
    [Route("api/appointment")]
    [ApiController]
    public class AppointmentApiController : Controller
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IHttpContextAccessor _httpcontextAccessor;
        private readonly string loginUserId;
        private readonly string role;


        public AppointmentApiController(IAppointmentService AppointmentService, IHttpContextAccessor httpContextAccessor)
        {
            _appointmentService = AppointmentService;
            _httpcontextAccessor = httpContextAccessor;
            loginUserId = _httpcontextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            role = _httpcontextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
        }

        [HttpPost]
        [Route("SaveCalenderData")]
        public IActionResult SaveCalenderData(AppointmentViewModel data)
        {
            CommonResponse<int> commonResponse = new CommonResponse<int>();
            try
            {
                commonResponse.status = _appointmentService.AddUpdate(data).Result;
                if (commonResponse.status == 1)
                    commonResponse.message = Helper.appointmentUpdated;
                if (commonResponse.status == 2)
                    commonResponse.message = Helper.appointmentAdded;
            }
            catch (Exception e)
            {
                commonResponse.message = e.Message;
                commonResponse.status = Helper.failure_code;

            }
            return View();
        }


        [HttpGet]
        [Route("GetCalenderData")]
        public IActionResult GetCalenderData(string doctorId)
        {
            CommonResponse<List<AppointmentViewModel>> commonResponse = new CommonResponse<List<AppointmentViewModel>>();
            try
            {
                if(role == Helper.Patient)
                {
                    commonResponse.dataenum = _appointmentService.PatientsEventsById(loginUserId);
                    commonResponse.status=Helper.success_code;
                }
                else if(role == Helper.Doctor)
                {
                    commonResponse.dataenum = _appointmentService.DoctorsEventsById(loginUserId);
                    commonResponse.status = Helper.success_code;
                }
                else
                {
                    commonResponse.dataenum = _appointmentService.DoctorsEventsById(doctorId);
                    commonResponse.status = Helper.success_code;
                }
            }
            catch (Exception e)
            {
                commonResponse.message = e.Message;
                commonResponse.status = Helper.failure_code;
            }
            return Ok(commonResponse);

        }

        [HttpGet]
        [Route("GetCalenderDataById/{id}")]
        public IActionResult GetCalenderDataById(int id)
        {
            CommonResponse<AppointmentViewModel> commonResponse = new CommonResponse<AppointmentViewModel>();
            try
            {

                    commonResponse.dataenum = _appointmentService.GetById(id);
                    commonResponse.status = Helper.success_code;
                
            }
            catch (Exception e)
            {
                commonResponse.message = e.Message;
                commonResponse.status = Helper.failure_code;
            }
            return Ok(commonResponse);

        }

        [HttpGet]
        [Route("DeleteAppointment/{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            CommonResponse<int> commonResponse = new CommonResponse<int>();
            try
            {

                commonResponse.status = await _appointmentService.Delete(id);
                commonResponse.message= commonResponse.status ==1 ? Helper.appointmentDeleted : Helper.somethingWentWrong;

            }
            catch (Exception e)
            {
                commonResponse.message = e.Message;
                commonResponse.status = Helper.failure_code;
            }
            return Ok(commonResponse);

        }
        [HttpGet]
        [Route("ConfirmAppointment/{id}")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            CommonResponse<int> commonResponse = new CommonResponse<int>();
            try
            {

               var result = await _appointmentService.ConfirmEvent(id);
                if (result>0)
                {
                    commonResponse.status = Helper.success_code;
                    commonResponse.message = Helper.meetingConfirm;
                }
                else
                {
                    commonResponse.status = Helper.failure_code;
                    commonResponse.message = Helper.meetingConfirmError;
                }
                commonResponse.message = commonResponse.status == 1 ? Helper.appointmentDeleted : Helper.somethingWentWrong;

            }
            catch (Exception e)
            {
                commonResponse.message = e.Message;
                commonResponse.status = Helper.failure_code;
            }
            return Ok(commonResponse);

        }

    }
}

