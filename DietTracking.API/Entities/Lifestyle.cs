using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class Lifestyle
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

        [Required]
        public string StressLevel { get; set; }

        [Required]
        public string SmokingHabits { get; set; }

        [Required]
        public string CaffeineIntake { get; set; }

        [Required]
        public string MotivationLevel { get; set; }

        [Required]
        public string SocialSupport { get; set; }

        [Required]
        public string AlcoholConsumption { get; set; }
    }
}
