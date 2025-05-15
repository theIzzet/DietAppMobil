namespace DietTracking.API.Entities
{
    public class CreateExperienceDto
    {
        public string Institution { get; set; }
        public string Position { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Description { get; set; }
    }
}
