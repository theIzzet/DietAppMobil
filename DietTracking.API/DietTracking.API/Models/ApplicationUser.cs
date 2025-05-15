using Microsoft.AspNetCore.Identity;
using DietTracking.API.Entities; // Entity sınıflarımız burada yer alacak

namespace DietTracking.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Kendi alanlarımız
        public string Name { get; set; }
        public string Surname { get; set; }
        public string? GraduationCertificatePath { get; set; }
        public string? TranskriptPath { get; set; }

        public PhysicalActivity PhysicalActivity { get; set; }



      
    }
}
