namespace DietTracking.API.DTO
{
    public class DemandDto
    {
        public int Id { get; set; }
        public int? DietitianId { get; set; }
        public string? DietitianName { get; set; }
        public string? ProfilePhotoPath { get; set; }
        public string? SenderId { get; set; }
        public string? SenderName { get; set; }
        public DateTime SendTime { get; set; }
        public string? State { get; set; } // "Pending", "Accepted", "Rejected"
    }
}
