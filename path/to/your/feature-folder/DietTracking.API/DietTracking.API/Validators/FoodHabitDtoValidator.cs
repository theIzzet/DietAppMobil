using DietTracking.API.Models.Dto;
using FluentValidation;

namespace DietTracking.API.Validators
{
    public class FoodHabitDtoValidator : AbstractValidator<FoodHabitDto>
    {
        public FoodHabitDtoValidator()
        {
            RuleFor(x => x.MealTimes)
                .NotEmpty().WithMessage("MealTimes boş olamaz.");

            RuleFor(x => x.ConsumedFoods)
                .NotEmpty().WithMessage("ConsumedFoods boş olamaz.");

            RuleFor(x => x.SnackingHabits)
                .NotEmpty().WithMessage("SnackingHabits boş olamaz.");

            RuleFor(x => x.OutsideEatingHabits)
                .NotEmpty().WithMessage("OutsideEatingHabits boş olamaz.");

            RuleFor(x => x.EatingDuration)
                .NotEmpty().WithMessage("EatingDuration boş olamaz.");

            RuleFor(x => x.SweetConsumption)
                .NotEmpty().WithMessage("SweetConsumption boş olamaz.");

            RuleFor(x => x.CookingMethods)
                .NotEmpty().WithMessage("CookingMethods boş olamaz.");

            RuleFor(x => x.WaterIntake)
                .NotEmpty().WithMessage("WaterIntake boş olamaz.");
        }
    }
}
