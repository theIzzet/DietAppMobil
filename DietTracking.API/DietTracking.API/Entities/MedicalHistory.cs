using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class MedicalHistory
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(User))]
        public string? ApplicationUserId { get; set; }

        [Required]
        public ApplicationUser User { get; set; }
        [Required]
        public string MedicationNames { get; set; }

        [Required]
        public string PersonalDiseases { get; set; }

        [Required]
        public string HereditaryDiseases { get; set; }

        [Required]
        public string Allergies { get; set; }
    }
}
