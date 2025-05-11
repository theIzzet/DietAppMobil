namespace DietTracking.API.DTO
{
    public class UpsertExperienceDto
    {
        public string Institution { get; set; }
        public string Position { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
