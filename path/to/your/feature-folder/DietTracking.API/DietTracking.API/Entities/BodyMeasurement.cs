using DietTracking.API.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DietTracking.API.Entities
{
    public class BodyMeasurement
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string ApplicationUserId { get; set; }

        [ForeignKey("ApplicationUserId")]
        public ApplicationUser ApplicationUser { get; set; }

        [Required] public DateTime MeasuredAt { get; set; }

        public double Waist { get; set; }   // Bel (cm)
        public double Hip { get; set; }   // Kalça
        public double Chest { get; set; }   // Göğüs
        public double UpperArm { get; set; }   // Üst kol
        public double Thigh { get; set; }   // Bacak
        public double Neck { get; set; }   // Boyun

        public string? PhotoPath { get; set; }
    }
}
