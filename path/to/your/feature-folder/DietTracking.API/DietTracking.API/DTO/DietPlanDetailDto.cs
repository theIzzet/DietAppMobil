namespace DietTracking.API.DTO
{
    public class DietPlanDetailDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<DietPlanEntryDto> Entries { get; set; }
    }
}
