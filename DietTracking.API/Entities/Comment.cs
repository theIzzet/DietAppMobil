using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Data;
using DietTracking.API.Entities;
using DietTracking.API.Models;

namespace DietApp.Entities
{
    public class Comment
    {
        public int CommentId { get; set; }
        public string? CommentText { get; set; }
        public DateTime PublishedOn { get; set; }

        [Range(1, 5)] 
        public int Rating { get; set; }

        [ForeignKey(nameof(User))]
        public string UserId { get; set; } = null!;

        public ApplicationUser User { get; set; } = null!;


        [ForeignKey(nameof(DP))]
        public int DPId { get; set; }

        public DietitianProfile DP { get; set;} = null!;

    }
}
