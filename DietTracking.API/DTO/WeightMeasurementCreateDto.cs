namespace DietTracking.API.DTO
{
    public class WeightMeasurementCreateDto
    {
        public DateTime MeasuredAt { get; set; }
        public double Weight { get; set; }
        public IFormFile? Photo { get; set; }
    }
}
