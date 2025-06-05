namespace DietTracking.API.DTO
{
    public class CertificateDto
    {
        public int Id { get; set; }
        public string CertificateName { get; set; }
        public string FilePath { get; set; }
        public DateTime DateReceived { get; set; }
        public string QualificationUrl { get; set; }
        public string Issuer { get; set; }
    }
}
