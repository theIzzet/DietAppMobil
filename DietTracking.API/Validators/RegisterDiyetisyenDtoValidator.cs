using DietTracking.API.DTO;
using FluentValidation;

namespace DietTracking.API.Validators
{
    public class RegisterDiyetisyenDtoValidator : AbstractValidator<RegisterDiyetisyenDto>
    {
        public RegisterDiyetisyenDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("İsim (Name) boş olamaz.");

            RuleFor(x => x.Surname)
                .NotEmpty().WithMessage("Soyad (Surname) boş olamaz.");

            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Kullanıcı adı (Username) boş olamaz.")
                .MinimumLength(3).WithMessage("Kullanıcı adı en az 3 karakter olmalı.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email boş olamaz.")
                .EmailAddress().WithMessage("Geçerli bir email formatı giriniz.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Telefon numarası (PhoneNumber) boş olamaz.");

            // Dosya kontrolü (mezuniyet belgesi)
            RuleFor(x => x.GraduationCertificate)
                .NotNull().WithMessage("Mezuniyet belgesi (GraduationCertificate) yüklemelisiniz.");

            // Dosya kontrolü (transkript)
            RuleFor(x => x.Transkript)
                .NotNull().WithMessage("Transkript belgesi (Transkript) yüklemelisiniz.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Şifre (Password) boş olamaz.")
                .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalı.");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Şifre tekrar (ConfirmPassword) boş olamaz.")
                .Equal(x => x.Password).WithMessage("Şifreler eşleşmiyor.");
        }
    }
}
