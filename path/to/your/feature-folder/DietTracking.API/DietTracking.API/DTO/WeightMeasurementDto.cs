namespace DietTracking.API.DTO
{
    public class WeightMeasurementDto
    {
        public int Id { get; set; }
        public DateTime MeasuredAt { get; set; }
        public double Weight { get; set; }
        public string? PhotoPath { get; set; }
    }
}
