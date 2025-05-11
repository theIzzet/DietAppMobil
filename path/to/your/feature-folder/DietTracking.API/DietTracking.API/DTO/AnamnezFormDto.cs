namespace DietTracking.API.Models.Dto
{
    public class AnamnezFormDto
    {
        public PersonalInfoDto PersonalInfo { get; set; }
        public PhysicalActivityDto PhysicalActivity { get; set; }
        public LifestyleDto Lifestyle { get; set; }
        public FoodHabitDto FoodHabit { get; set; }
        public GoalDto Goal { get; set; }
        public MedicalHistoryDto MedicalHistory { get; set; }
    }
}
