using DietTracking.API.Data;
using DietTracking.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DietTracking.API.Models;
using Microsoft.AspNetCore.Authorization;
using DietApp.Entities;
using DietTracking.API.DTO;

namespace DietTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register-token")]
        [Authorize]
        public async Task<IActionResult> RegisterPushToken([FromBody] PushTokenDto model)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            user.ExpoPushToken = model.ExpoPushToken;
            await _context.SaveChangesAsync();


            return Ok();
        }
    }
}