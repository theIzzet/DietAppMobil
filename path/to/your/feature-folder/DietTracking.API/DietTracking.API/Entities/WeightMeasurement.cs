using DietTracking.API.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DietTracking.API.Entities
{
    public class WeightMeasurement
    {
        [Key] public int Id { get; set; }

        [Required] public string ApplicationUserId { get; set; }
        [ForeignKey(nameof(ApplicationUserId))] public ApplicationUser User { get; set; }

        [Required] public DateTime MeasuredAt { get; set; }
        [Required] public double Weight { get; set; }   // kg

        public string? PhotoPath { get; set; }
    }
}
