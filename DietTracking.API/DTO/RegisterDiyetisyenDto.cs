using Microsoft.AspNetCore.Http; // IFormFile için
namespace DietTracking.API.DTO

{
    public class RegisterDiyetisyenDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        // Burada dosyaları form-data olarak alacağız
        public IFormFile GraduationCertificate { get; set; }
        public IFormFile Transkript { get; set; }

        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
