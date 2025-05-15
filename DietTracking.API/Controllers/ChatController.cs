using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DietTracking.API.Data;
using DietTracking.API.DTO;
using DietTracking.API.Entities;
using DietTracking.API.Hubs;
using DietTracking.API.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace DietTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ChatHub> _hub;
        public ChatController(ApplicationDbContext context, IHubContext<ChatHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        // GET geçmiş
        // GET api/chat/messages?dietitianId={}&patientId={}
        [HttpGet("messages")]
        public async Task<IActionResult> GetHistory([FromQuery] string dietitianId, [FromQuery] string patientId)
        {
            var group = $"chat_{dietitianId}_{patientId}";
            var list = await _context.ChatMessages
                .Where(m => m.GroupName == group)
                .OrderBy(m => m.SentAt)
                .Select(m => new ChatMessageDto
                {
                    FromUserId = m.FromUserId,
                    ToUserId = m.ToUserId,
                    Text = m.Text,
                    SentAt = m.SentAt
                }).ToListAsync();
            return Ok(list);
        }

        // POST manuel
        // POST api/chat/messages
        [HttpPost("messages")]
        public async Task<IActionResult> Send([FromBody] ChatSendDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var toUser = userId == dto.DietitianId ? dto.PatientId : dto.DietitianId;
            var group = $"chat_{dto.DietitianId}_{dto.PatientId}";

            var msg = new ChatMessage
            {
                FromUserId = userId,
                ToUserId = toUser,
                GroupName = group,
                Text = dto.Text,
                SentAt = DateTime.UtcNow
            };
            _context.ChatMessages.Add(msg);
            await _context.SaveChangesAsync();

            await _hub.Clients.Group(group)
                .SendAsync("ReceiveMessage", new
                {
                    FromUserId = msg.FromUserId,
                    ToUserId = msg.ToUserId,
                    Text = msg.Text,
                    SentAt = msg.SentAt
                });

            return Ok();
        }
    }
}