using DietTracking.API.DTO;
using FluentValidation;

namespace DietTracking.API.Validators
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator()
        {
            // E-posta zorunlu ve formatı doğru olmalı
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("E-posta boş olamaz.")
                .EmailAddress().WithMessage("Geçerli bir e-posta formatı giriniz.");

            // Parola zorunlu, en az 6 karakter
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Parola boş olamaz.")
                .MinimumLength(6).WithMessage("Parola en az 6 karakter olmalı.");
        }
    }
}
