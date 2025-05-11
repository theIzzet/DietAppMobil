using DietTracking.API.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class DietPlan
{
    [Key] public int Id { get; set; }

    [Required] public string DietitianId { get; set; }
    [ForeignKey(nameof(DietitianId))] public ApplicationUser Dietitian { get; set; }

    [Required] public string PatientId { get; set; }
    [ForeignKey(nameof(PatientId))] public ApplicationUser Patient { get; set; }

    [Required] public string Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<DietPlanEntry> Entries { get; set; }
}
