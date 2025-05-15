using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class DietPlanEntry
{
    [Key] public int Id { get; set; }

    [Required] public int DietPlanId { get; set; }
    [ForeignKey(nameof(DietPlanId))] public DietPlan Plan { get; set; }

    [Required] public int DayOrder { get; set; }      // 1‑7
    [Required] public string MealName { get; set; }   // “Sabah”, “Öğle”, …
    [Required] public string Content { get; set; }    // detay
}
