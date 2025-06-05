using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Entities;

namespace DietApp.Entities
{
    public class DietType
    {
        [Key]
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }
        public string? About { get; set; }

        public string? PicturePath { get; set; }


        public ICollection<DietitianProfile> DiyetisyenProfiles { get; set; } = new List<DietitianProfile>();
     
    }
}
