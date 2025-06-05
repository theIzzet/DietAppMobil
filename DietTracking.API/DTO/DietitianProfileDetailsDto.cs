namespace DietTracking.API.DTO
{
    public class DietitianProfileDetailsDto
    {
        // public int Id { get; set; }
        // public string? UserId { get; set; }
        // public string? Name { get; set; }
        // public string? Surname { get; set; }
        // public string? About { get; set; }
        // public string? ProfilePhotoPath { get; set; }
        // public string? Specialties { get; set; }
        // public string? WorkHours { get; set; }
        // public string? ClinicName { get; set; }
        // public string? ServiceDiets { get; set; }
        // public List<DietTypeDto> DietTypes { get; set; } = new List<DietTypeDto>();
        // public List<CommentDto> Comments { get; set; } = new List<CommentDto>();
        // public double AverageRating { get; set; }
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? About { get; set; }
        public string? ProfilePhotoPath { get; set; }
        public List<string> Specialties { get; set; } = new List<string>(); // String list olarak değiştirildi
        public string? WorkHours { get; set; }
        public string? ClinicName { get; set; }
        public string? ServiceDiets { get; set; }
        public List<DietTypeDto> DietTypes { get; set; } = new List<DietTypeDto>();
        public List<CommentDto> Comments { get; set; } = new List<CommentDto>();
        public List<CertificateDto> Certificates { get; set; } = new List<CertificateDto>();
        public double AverageRating { get; set; }
    }
}
