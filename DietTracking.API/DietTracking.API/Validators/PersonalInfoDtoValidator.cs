using DietTracking.API.Models.Dto;
using FluentValidation;
using System;

namespace DietTracking.API.Validators
{
    public class PersonalInfoDtoValidator : AbstractValidator<PersonalInfoDto>
    {
        public PersonalInfoDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name boş olamaz.");

            RuleFor(x => x.Surname)
                .NotEmpty().WithMessage("Surname boş olamaz.");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty().WithMessage("Doğum tarihi boş olamaz.");

            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender boş olamaz.");

            RuleFor(x => x.Height)
                .GreaterThan(0).WithMessage("Height 0’dan büyük olmalı.");

            RuleFor(x => x.Weight)
                .GreaterThan(0).WithMessage("Weight 0’dan büyük olmalı.");

            RuleFor(x => x.Occupation)
                .NotEmpty().WithMessage("Occupation boş olamaz.");

            RuleFor(x => x.MaritalStatus)
                .NotEmpty().WithMessage("MaritalStatus boş olamaz.");

            RuleFor(x => x.ChildCount)
                .GreaterThanOrEqualTo(0).WithMessage("ChildCount negatif olamaz.");
        }
    }
}
