using DietTracking.API.Models.Dto;
using FluentValidation;

namespace DietTracking.API.Validators
{
    public class GoalDtoValidator : AbstractValidator<GoalDto>
    {
        public GoalDtoValidator()
        {
            RuleFor(x => x.WeightGoal)
                .NotEmpty().WithMessage("WeightGoal boş olamaz.");

            RuleFor(x => x.HealthIssuesManagement)
                .NotEmpty().WithMessage("HealthIssuesManagement boş olamaz.");

            RuleFor(x => x.SportsPerformanceGoals)
                .NotEmpty().WithMessage("SportsPerformanceGoals boş olamaz.");

            RuleFor(x => x.OtherGoals)
                .NotEmpty().WithMessage("OtherGoals boş olamaz.");
        }
    }
}
