using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class PhysicalActivity
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(User))]
        public string? ApplicationUserId { get; set; }

        [Required]
        public ApplicationUser User { get; set; }

        [Required]
        public string RegularPhysicalActivity { get; set; }

        [Required]
        public string DailyInactivity { get; set; }

        [Required]
        public string SleepPattern { get; set; }
    }
}
