namespace DietTracking.API.DTO
{
    public class UpdateDemandStatusDto
    {
        
        public bool IsApproved { get; set; }
        public string? RejectionReason { get; set; }
    }
}
