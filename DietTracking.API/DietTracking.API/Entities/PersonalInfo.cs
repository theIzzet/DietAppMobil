using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class PersonalInfo
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(User))]
        public string? ApplicationUserId { get; set; }

        [Required]
        public ApplicationUser User { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public double Height { get; set; }

        [Required]
        public double Weight { get; set; }

        [Required]
        public string Occupation { get; set; }

        [Required]
        public string MaritalStatus { get; set; }

        [Required]
        public int ChildCount { get; set; }
    }
}
