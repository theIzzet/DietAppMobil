using DietTracking.API.Models.Dto;
using FluentValidation;

namespace DietTracking.API.Validators
{
    public class MedicalHistoryDtoValidator : AbstractValidator<MedicalHistoryDto>
    {
        public MedicalHistoryDtoValidator()
        {
            RuleFor(x => x.MedicationNames)
                .NotEmpty().WithMessage("MedicationNames boş olamaz.");

            RuleFor(x => x.PersonalDiseases)
                .NotEmpty().WithMessage("PersonalDiseases boş olamaz.");

            RuleFor(x => x.HereditaryDiseases)
                .NotEmpty().WithMessage("HereditaryDiseases boş olamaz.");

            RuleFor(x => x.Allergies)
                .NotEmpty().WithMessage("Allergies boş olamaz.");
        }
    }
}
