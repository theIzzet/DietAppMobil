namespace DietTracking.API.DTO
{
    public class UpsertDietPlanDto
    {
        public string PatientId { get; set; }
        public string Description { get; set; }
        public List<DietPlanEntryDto> Entries { get; set; }
    }
}
