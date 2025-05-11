namespace DietTracking.API.DTO
{
    public class BodyMeasurementDto
    {
        public int Id { get; set; }
        public DateTime MeasuredAt { get; set; }
        public double Waist { get; set; }
        public double Hip { get; set; }
        public double Chest { get; set; }
        public double UpperArm { get; set; }
        public double Thigh { get; set; }
        public double Neck { get; set; }
        public string? PhotoPath { get; set; }
    }
}
