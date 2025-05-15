using DietTracking.API.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DietTracking.API.Entities
{
    public class DietitianCertificate
    {
        [Key]
        public int Id { get; set; }


        [ForeignKey(nameof(User))]
        public string? ApplicationUserId { get; set; }

        [Required]
        public ApplicationUser User { get; set; }
        [Required] public string CertificateName { get; set; }
        [Required] public string FilePath { get; set; }          // pdf / resim
        [Required] public DateTime DateReceived { get; set; }
        public string QualificationUrl { get; set; }
        public string Issuer { get; set; }
    }
}
