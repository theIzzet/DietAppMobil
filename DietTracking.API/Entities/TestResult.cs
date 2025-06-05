using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class TestResult
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(User))]

        public string? ApplicationUserId { get; set; }

        [Required]
        public ApplicationUser User { get; set; }

        // Zorunlu: Tahlil adı (örn. "Kan Şekeri Testi")
        [Required]
        public string TestName { get; set; }

        // Zorunlu: Tahlil tarihi
        [Required]
        public DateTime Date { get; set; }

        // Zorunlu: Kaydedilen dosyanın yolu (jpg/png/pdf)
        [Required]
        public string FilePath { get; set; }

        // İsteğe bağlı: Tahlil hakkında ek not
        public string? Notes { get; set; }
    }
}
