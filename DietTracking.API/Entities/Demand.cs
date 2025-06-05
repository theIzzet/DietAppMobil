using System.ComponentModel.DataAnnotations.Schema;
using DietTracking.API.Models;

namespace DietTracking.API.Entities
{
    public class Demand
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Receiver))]
        public int DietitianId { get; set; }
        public DietitianProfile Receiver { get; set; }

        [ForeignKey(nameof(Sender))]
        public string SenderId { get; set; }
        public ApplicationUser Sender { get; set; }

        public DateTime SendTime { get; set; }

   
        public string State { get; set; } 

       
        public string? RejectionReason { get; set; }


    }
}
