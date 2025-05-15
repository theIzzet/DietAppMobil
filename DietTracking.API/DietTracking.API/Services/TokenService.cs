using DietTracking.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DietTracking.API.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;

        public TokenService(IConfiguration configuration, UserManager<ApplicationUser> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
        }

        public string CreateToken(ApplicationUser user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["Key"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            // Kullanıcının rollerini al
            var roles = _userManager.GetRolesAsync(user).Result;

            // Token'a koyacağımız claim'ler:
            var authClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.AddHours(5),
                claims: authClaims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}


//| JWT Claim(`JwtRegisteredClaimNames` veya custom) | ASP.NET Core içinde `Claim.Type` olarak okunur                   | Tipik `Claim.Value` örneği                  |
//| ------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
//| `new Claim(JwtRegisteredClaimNames.Sub, user.Id)`                   | `ClaimTypes.NameIdentifier`                                      | `12345678 - 90ab - cdef - 1234 - 567890abcdef`      |
//| `new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)`      | `ClaimTypes.Name` (veya `ClaimTypes.Name` ile eşdeğer okunur)    | `ali.veli`                                  |
//| `new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())` | **`JwtRegisteredClaimNames.Jti`**(genelde `"jti"` olarak kalır) | `c1d2e3f4-...` (token’ın benzersiz kimliği) |
//| `new Claim(ClaimTypes.Role, role)`                                  | **`ClaimTypes.Role`**                                            | `Diyetisyen`, `Danisan` vb.                 |
