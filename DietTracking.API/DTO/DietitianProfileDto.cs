namespace DietTracking.API.DTO
{
    public class DietitianProfileDto
    {
        public string About { get; set; }
        public string? ProfilePhotoPath { get; set; }
        public List<string> Specialties { get; set; }
        public string WorkHours { get; set; }
        public string ClinicName { get; set; }
        public List<string> ServiceDiets { get; set; }
    }
}
