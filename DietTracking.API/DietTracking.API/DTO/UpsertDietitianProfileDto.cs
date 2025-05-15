namespace DietTracking.API.DTO
{
    public class UpsertDietitianProfileDto//// POST & PUT ortak
    {
        public string About { get; set; }
        public IFormFile? ProfilePhoto { get; set; }
        public List<string> Specialties { get; set; }
        public string WorkHours { get; set; }
        public string ClinicName { get; set; }
        public List<string> ServiceDiets { get; set; }
    }
}
