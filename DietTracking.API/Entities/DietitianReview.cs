using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class DietitianReview
    {
        [Key]
        public int Id { get; set; }

        // Yorum yapılan diyetisyen
        [Required]
        public string DietitianId { get; set; }
        [ForeignKey(nameof(DietitianId))]
        public ApplicationUser Dietitian { get; set; }

        // Yorum yapan kullanıcı (danışan)
        [Required]
        public string ReviewerId { get; set; }
        [ForeignKey(nameof(ReviewerId))]
        public ApplicationUser Reviewer { get; set; }

        [Required]
        public int Rating { get; set; }

        // İsteğe bağlı yorum metni
        public string? Comment { get; set; }

        // Yorum zamanı
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
