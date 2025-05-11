using DietTracking.API.Models;

namespace DietTracking.API.Services
{
    public interface ITokenService
    {
        string CreateToken(ApplicationUser user);
    }
}
