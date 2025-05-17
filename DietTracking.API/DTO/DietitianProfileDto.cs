using DietTracking.API.DTO;

public class DietitianProfileDto
{
    public int Id { get; set; }
    public string? UserId { get; set; }
    public string? Name { get; set; }
    public string? Surname { get; set; }
    public string? About { get; set; }
    public string? ProfilePhotoPath { get; set; }
    public List<string>? Specialties { get; set; }
    public string? WorkHours { get; set; }
    public string? ClinicName { get; set; }
    public List<string>? ServiceDiets { get; set; }
    public List<DietTypeDto> DietTypes { get; set; } = new();
    public List<CertificateDto> Certificates { get; set; } = new();
    
    
}
