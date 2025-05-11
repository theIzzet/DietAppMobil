using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class Goal
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(User))]
        public string? ApplicationUserId { get; set; }

        [Required]
        public ApplicationUser User { get; set; }

        [Required]
        public string WeightGoal { get; set; }

        [Required]
        public string HealthIssuesManagement { get; set; }

        [Required]
        public string SportsPerformanceGoals { get; set; }

        [Required]
        public string OtherGoals { get; set; }
    }
}
