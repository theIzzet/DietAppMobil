namespace DietTracking.API.DTO
{
    public class PatientDto
    {
        public string PatientId { get; set; }
        public string PatientName { get; set; }
        public string PatientEmail { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
