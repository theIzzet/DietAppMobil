using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DietTracking.API.Data;
using DietTracking.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DietTracking.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        public ChatHub(ApplicationDbContext context) => _context = context;

        // Gruba katılma
        public async Task JoinChat(string dietitianId, string patientId)
        {
            var group = $"chat_{dietitianId}_{patientId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
        }

        // Mesaj gönderme
        public async Task SendMessage(string dietitianId, string patientId, string text)
        {
            var fromUserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var toUserId = fromUserId == dietitianId ? patientId : dietitianId;
            var group = $"chat_{dietitianId}_{patientId}";

            var msg = new ChatMessage
            {
                FromUserId = fromUserId,
                ToUserId = toUserId,
                GroupName = group,
                Text = text,
                SentAt = DateTime.UtcNow
            };
            _context.ChatMessages.Add(msg);
            await _context.SaveChangesAsync();

            await Clients.Group(group).SendAsync("ReceiveMessage", new
            {
                FromUserId = fromUserId,
                ToUserId = toUserId,
                Text = text,
                SentAt = msg.SentAt
            });
        }
    }
}