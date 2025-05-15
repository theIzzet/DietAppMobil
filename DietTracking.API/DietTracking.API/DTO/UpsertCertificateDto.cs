namespace DietTracking.API.DTO
{
    public class UpsertCertificateDto //   // POST & PUT
    {
        public string CertificateName { get; set; }
        public IFormFile File { get; set; }
        public DateTime DateReceived { get; set; }
        public string QualificationUrl { get; set; }
        public string Issuer { get; set; }
    }
}
