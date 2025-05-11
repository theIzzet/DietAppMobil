using DietTracking.API.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DietTracking.API.Entities
{
    public class DietitianProfile
    {
        [Key]
        public int Id { get; set; }


        [ForeignKey(nameof(User))]
        public string? ApplicationUserId { get; set; }

        [Required]
        public ApplicationUser User { get; set; }

        public string About { get; set; }
        public string? ProfilePhotoPath { get; set; }
        public string Specialties { get; set; }              // Virgülle ayrılmış uzmanlık alanları
        public string WorkHours { get; set; }                // örn “Hafta içi 09‑17”
        public string ClinicName { get; set; }               // aktif çalışılan kurum
        public string ServiceDiets { get; set; }             // verdiği diyet türleri (virgülle)
    
    }
}
