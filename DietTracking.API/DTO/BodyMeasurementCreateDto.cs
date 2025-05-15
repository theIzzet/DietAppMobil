namespace DietTracking.API.DTO
{
    public class BodyMeasurementCreateDto
    {
        public DateTime MeasuredAt { get; set; }
        public double Waist { get; set; }
        public double Hip { get; set; }
        public double Chest { get; set; }
        public double UpperArm { get; set; }
        public double Thigh { get; set; }
        public double Neck { get; set; }
        public IFormFile? Photo { get; set; }
    }
}
