using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class FoodHabit
    {
        [Key]
        public int Id { get; set; }


        [ForeignKey(nameof(User))]
        public string? ApplicationUserId { get; set; }

        [Required]
        public ApplicationUser User { get; set; }

        [Required]
        public string MealTimes { get; set; }

        [Required]
        public string ConsumedFoods { get; set; }

        [Required]
        public string SnackingHabits { get; set; }

        [Required]
        public string OutsideEatingHabits { get; set; }

        [Required]
        public string EatingDuration { get; set; }

        [Required]
        public string SweetConsumption { get; set; }

        [Required]
        public string CookingMethods { get; set; }

        [Required]
        public string WaterIntake { get; set; }
    }
}
