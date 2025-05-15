using DietTracking.API.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DietTracking.API.Entities
{
    public class DietitianExperience
    {
        [Key]
        public int Id { get; set; }


        [ForeignKey(nameof(User))]
        public string? ApplicationUserId { get; set; }

        [Required]
        public ApplicationUser User { get; set; }

        // Çalışılan kurumun adı
        [Required]
        public string Institution { get; set; }

        // Pozisyon veya kısa açıklama
        [Required]
        public string Position { get; set; }

        // İşe başlama tarihi
        [Required]
        public DateTime StartDate { get; set; }

        // İşten ayrılma/bitiş tarihi (isterseniz null geçilebilir)
        public DateTime? EndDate { get; set; }

    }
}
