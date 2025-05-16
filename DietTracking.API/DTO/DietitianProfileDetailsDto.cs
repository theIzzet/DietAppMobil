namespace DietTracking.API.DTO
{
    public class DietitianProfileDetailsDto
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? About { get; set; }
        public string? ProfilePhotoPath { get; set; }
        public string? Specialties { get; set; }
        public string? WorkHours { get; set; }
        public string? ClinicName { get; set; }
        public string? ServiceDiets { get; set; }
        public List<DietTypeDto> DietTypes { get; set; } = new List<DietTypeDto>();
        public List<CommentDto> Comments { get; set; } = new List<CommentDto>();
        public double AverageRating { get; set; }
    }
}
