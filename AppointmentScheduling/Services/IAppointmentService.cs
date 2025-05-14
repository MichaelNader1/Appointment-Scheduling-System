using System.Collections.Generic;
using System.Threading.Tasks;
using AppointmentScheduling.Models.ViewModel;

namespace AppointmentScheduling.Services
{
    public interface IAppointmentService
    {
        public List<DoctorViewModel> GetDoctorsList();
        public List<PatientViewModel> GetPatientsList();
        public Task<int> AddUpdate (AppointmentViewModel model);
        public List<AppointmentViewModel> DoctorsEventsById(string doctorId);
        public List<AppointmentViewModel> PatientsEventsById(string patientId);
        public AppointmentViewModel  GetById (int id);
        public Task<int> Delete(int id);
        public Task<int> ConfirmEvent(int id);


    }
}
