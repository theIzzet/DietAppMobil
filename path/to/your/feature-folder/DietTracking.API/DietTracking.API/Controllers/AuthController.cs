using DietTracking.API.DTO;
using DietTracking.API.Models;
using DietTracking.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace DietTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly IWebHostEnvironment _env; // Dosya yükleme için gerekli (wwwroot dizinine erişeceğiz)

        public AuthController(UserManager<ApplicationUser> userManager,
                              RoleManager<IdentityRole> roleManager,
                              ITokenService tokenService,
                              IWebHostEnvironment env)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _env = env;
        }

        // ========== DANISAN KAYIT ==============
        // POST: /api/auth/register/danisan
        [HttpPost("register/danisan")]
        public async Task<IActionResult> RegisterDanisan([FromForm] RegisterDanisanDto model)
        {
            // 1) Aynı email var mı kontrol
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return BadRequest("Bu e-postayla kayıtlı bir kullanıcı zaten var.");
            }

            // 2) ApplicationUser nesnesi oluştur
            var newUser = new ApplicationUser
            {
                Name = model.Name,
                Surname = model.Surname,
                UserName = model.Username,
                Email = model.Email
                // PhoneNumber'ı Danışan için zorunlu tutmadık, istersen ekleyebilirsin
            };

            // 3) Identity ile kullanıcı oluştur
            var createResult = await _userManager.CreateAsync(newUser, model.Password);
            if (!createResult.Succeeded)
            {
                return BadRequest(createResult.Errors);
            }

            // 4) Rol "Danışan" yoksa oluştur, sonra ata
            var role = "Danisan";
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));

            await _userManager.AddToRoleAsync(newUser, role);

            // 5) Başarılı olursa token üret
            var token = _tokenService.CreateToken(newUser);

            return Ok(new { message = "Danışan kaydı başarılı", token });
        }

        // ========== DIYETISYEN KAYIT ==============
        // POST: /api/auth/register/diyetisyen
        [HttpPost("register/diyetisyen")]
        public async Task<IActionResult> RegisterDiyetisyen([FromForm] RegisterDiyetisyenDto model)
        {
            // 1) Aynı email var mı kontrol
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return BadRequest("Bu e-postayla kayıtlı bir kullanıcı zaten var.");
            }

            // 2) ApplicationUser nesnesi oluştur
            var newUser = new ApplicationUser
            {
                Name = model.Name,
                Surname = model.Surname,
                UserName = model.Username,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber
            };

            // 3) Dosyaları (GraduationCertificate, Transkript) wwwroot içine kaydet
            //    Kaydettikten sonra newUser.GraduationCertificatePath / TranskriptPath içine path'i yazacağız

            // Mezuniyet belgesi
            if (model.GraduationCertificate != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.GraduationCertificate.FileName);
                var filePath = Path.Combine(_env.WebRootPath, "Uploads", "Graduation", fileName);

                // Klasör yoksa oluştur
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.GraduationCertificate.CopyToAsync(stream);
                }

                newUser.GraduationCertificatePath = Path.Combine("Uploads", "Graduation", fileName);
            }

            // Transkript
            if (model.Transkript != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.Transkript.FileName);
                var filePath = Path.Combine(_env.WebRootPath, "Uploads", "Transkripts", fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Transkript.CopyToAsync(stream);
                }

                newUser.TranskriptPath = Path.Combine("Uploads", "Transkripts", fileName);
            }

            // 4) Identity ile kullanıcı oluştur
            var createResult = await _userManager.CreateAsync(newUser, model.Password);
            if (!createResult.Succeeded)
            {
                return BadRequest(createResult.Errors);
            }

            // 5) Rol "Diyetisyen" yoksa oluştur, sonra ata
            var role = "Diyetisyen";
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));

            await _userManager.AddToRoleAsync(newUser, role);

            // 6) Başarılı olursa token üret
            var token = _tokenService.CreateToken(newUser);

            return Ok(new { message = "Diyetisyen kaydı başarılı", token });
        }

        // ========== LOGIN ==============
        // POST: /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            // 1) E-posta ile kullanıcıyı bul
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized("Geçersiz e-posta veya şifre.");
            }

            // 2) Şifre doğru mu kontrol et
            var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!isPasswordCorrect)
            {
                return Unauthorized("Geçersiz e-posta veya şifre.");
            }

            // 3) Giriş başarılı -> Token oluştur
            var token = _tokenService.CreateToken(user);

            // 4) Token'ı döndür
            return Ok(new { token });
        }

    }
}
