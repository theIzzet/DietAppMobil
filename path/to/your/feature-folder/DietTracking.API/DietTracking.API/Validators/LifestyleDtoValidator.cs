using DietTracking.API.Models.Dto;
using FluentValidation;

namespace DietTracking.API.Validators
{
    public class LifestyleDtoValidator : AbstractValidator<LifestyleDto>
    {
        public LifestyleDtoValidator()
        {
            RuleFor(x => x.RegularPhysicalActivity)
                .NotEmpty().WithMessage("RegularPhysicalActivity boş olamaz.");

            RuleFor(x => x.DailyInactivity)
                .NotEmpty().WithMessage("DailyInactivity boş olamaz.");

            RuleFor(x => x.SleepPattern)
                .NotEmpty().WithMessage("SleepPattern boş olamaz.");

            RuleFor(x => x.StressLevel)
                .NotEmpty().WithMessage("StressLevel boş olamaz.");

            RuleFor(x => x.SmokingHabits)
                .NotEmpty().WithMessage("SmokingHabits boş olamaz.");

            RuleFor(x => x.CaffeineIntake)
                .NotEmpty().WithMessage("CaffeineIntake boş olamaz.");

            RuleFor(x => x.MotivationLevel)
                .NotEmpty().WithMessage("MotivationLevel boş olamaz.");

            RuleFor(x => x.SocialSupport)
                .NotEmpty().WithMessage("SocialSupport boş olamaz.");

            RuleFor(x => x.AlcoholConsumption)
                .NotEmpty().WithMessage("AlcoholConsumption boş olamaz.");
        }
    }
}
