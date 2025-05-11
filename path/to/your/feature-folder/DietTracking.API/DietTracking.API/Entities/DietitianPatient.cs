using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class DietitianPatient
    {
        [Key] public int Id { get; set; }

        [Required] public string DietitianId { get; set; }
        [ForeignKey(nameof(DietitianId))] public ApplicationUser Dietitian { get; set; }

        [Required] public string PatientId { get; set; }
        [ForeignKey(nameof(PatientId))] public ApplicationUser Patient { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
