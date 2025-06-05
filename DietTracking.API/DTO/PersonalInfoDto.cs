using System;

namespace DietTracking.API.Models.Dto
{
    public class PersonalInfoDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }
        public string Occupation { get; set; }
        public string MaritalStatus { get; set; }
        public int ChildCount { get; set; }
    }
}
