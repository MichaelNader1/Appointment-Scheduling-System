using System.Security.Claims;
using AppointmentScheduling.Services;
using Microsoft.AspNetCore.Http;

namespace AppointmentScheduling.Models
{
    public class CommonResponse<T>
    {

        public int status { get; set; }
        public string message { get; set; }
        public T dataenum { get; set; }
    }
}
