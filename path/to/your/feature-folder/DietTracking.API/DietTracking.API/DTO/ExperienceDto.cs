namespace DietTracking.API.DTO
{
    public class ExperienceDto
    {
        public int Id { get; set; }
        public string Institution { get; set; }
        public string Position { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
