using System.ComponentModel.DataAnnotations;

namespace DietTracking.API.DTO
{
    public class CreateReviewDto
    {
        [Required]
        public string DietitianId { get; set; }   // Yeni: hedef diyetisyen
        [Required]
        public int Rating { get; set; }

        public string? Comment { get; set; }
    }
}
