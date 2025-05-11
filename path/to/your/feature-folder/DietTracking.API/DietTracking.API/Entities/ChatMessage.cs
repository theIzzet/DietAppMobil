using DietTracking.API.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DietTracking.API.Entities
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }

        // Gönderen
        [Required]
        public string FromUserId { get; set; }
        [ForeignKey(nameof(FromUserId))]
        public ApplicationUser FromUser { get; set; }

        // Alıcı
        [Required]
        public string ToUserId { get; set; }
        [ForeignKey(nameof(ToUserId))]
        public ApplicationUser ToUser { get; set; }

        [Required]
        public string GroupName { get; set; }

        [Required]
        public string Text { get; set; }

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
