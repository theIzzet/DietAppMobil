using DietTracking.API.Models.Dto;
using FluentValidation;

namespace DietTracking.API.Validators
{
    public class PhysicalActivityDtoValidator : AbstractValidator<PhysicalActivityDto>
    {
        public PhysicalActivityDtoValidator()
        {
            RuleFor(x => x.RegularPhysicalActivity)
                .NotEmpty().WithMessage("RegularPhysicalActivity boş olamaz.");

            RuleFor(x => x.DailyInactivity)
                .NotEmpty().WithMessage("DailyInactivity boş olamaz.");

            RuleFor(x => x.SleepPattern)
                .NotEmpty().WithMessage("SleepPattern boş olamaz.");
        }
    }
}
