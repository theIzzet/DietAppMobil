using System.Security.Claims;
using DietTracking.API.Data;
using DietTracking.API.DTO;
using DietTracking.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DietTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemandController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DietTypeManagementController> _logger;


        public DemandController(ApplicationDbContext context, ILogger<DietTypeManagementController> logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpGet("sent")]
        public async Task<IActionResult> GetSentDemands()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var demands = await _context.Demands
                .Include(d => d.Receiver)
                .ThenInclude(r => r.User)
                .Where(d => d.SenderId == userId)
                .OrderByDescending(d => d.SendTime)
                .Select(d => new DemandDto
                {
                    Id = d.Id,
                    DietitianId = d.DietitianId,
                    DietitianName = d.Receiver.User.Name + " " + d.Receiver.User.Surname,
                    ProfilePhotoPath = d.Receiver.ProfilePhotoPath,
                    SendTime = d.SendTime,
                    State = d.State
                })
                .ToListAsync();

            return Ok(demands);
        }

       
        [HttpGet("received")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> GetReceivedDemands()
        {
            var dietitianId = User.FindFirstValue(ClaimTypes.NameIdentifier);


            var dietitianProfileId = await _context.DietitianProfiles.Where(d => d.ApplicationUserId == dietitianId).Select(d => d.Id).FirstOrDefaultAsync();

            var demands = await _context.Demands
                .Include(d => d.Sender)
                .Where(d => d.DietitianId == dietitianProfileId)
                .OrderByDescending(d => d.SendTime)
               .Select(d => new DemandDto
               {
                   Id = d.Id,
                   SenderId = d.SenderId,
                   SenderName = d.Sender != null ? $"{d.Sender.Name} {d.Sender.Surname}" : "Bilinmeyen Kullanıcı",
                   SendTime = d.SendTime,
                   State = d.State,
                   
               })
                .ToListAsync();

            return Ok(demands);
        }

        // Yeni talep oluştur
        [HttpPost]
        public async Task<IActionResult> CreateDemand([FromBody] CreateDemandDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Aynı diyetisyene zaten talep gönderilmiş mi kontrol ettiğimiz kısım
            var existingDemand = await _context.Demands
                .FirstOrDefaultAsync(d => d.SenderId == userId && d.DietitianId == dto.DietitianId);

            if (existingDemand != null)
            {
                return BadRequest("Bu diyetisyene zaten talep gönderdiniz.");
            }

           
            var dietitianExists = await _context.DietitianProfiles
                .AnyAsync(d => d.Id == dto.DietitianId);

            if (!dietitianExists)
            {
                return NotFound("Diyetisyen bulunamadı.");
            }

            var demand = new Demand
            {
                SenderId = userId,
                DietitianId = dto.DietitianId,
                SendTime = DateTime.UtcNow,
                State = "Bekliyor" 
            };

            _context.Demands.Add(demand);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Talep başarıyla gönderildi.", demandId = demand.Id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> UpdateDemandStatus(int id, [FromBody] UpdateDemandStatusDto dto)
        {
            try
            {
                var dietitianId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var dietitianProfileId = await _context.DietitianProfiles
                    .Where(d => d.ApplicationUserId == dietitianId)
                    .Select(d => d.Id)
                    .FirstOrDefaultAsync();

                var demand = await _context.Demands
                    .FirstOrDefaultAsync(d => d.Id == id && d.DietitianId == dietitianProfileId);

                if (demand == null)
                {
                    return NotFound("Talep bulunamadı veya bu talep için yetkiniz yok.");
                }

                if (demand.State != "Bekliyor")
                {
                    return BadRequest("Bu talep zaten işleme alınmış.");
                }

                
                demand.State = dto.IsApproved ? "Onaylandı" : "Reddedildi";

                
                if (!dto.IsApproved)
                {
                    demand.RejectionReason = dto.RejectionReason;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Talep {demand.State}",
                    state = demand.State
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Talep güncellenirken hata oluştu");
                return StatusCode(500, "Bir hata oluştu");
            }
        }

[Authorize(Roles = "Diyetisyen")]
[HttpGet("patients")]
public async Task<IActionResult> GetAcceptedPatients()
{
    var dietitianUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    var dietitianProfileId = await _context.DietitianProfiles
        .Where(d => d.ApplicationUserId == dietitianUserId)
        .Select(d => d.Id)
        .FirstOrDefaultAsync();

    if (dietitianProfileId == 0)
        return NotFound("Diyetisyen profili bulunamadı.");

    var acceptedDemands = await _context.Demands
        .Include(d => d.Sender)
        .Where(d => d.DietitianId == dietitianProfileId && d.State == "Onaylandı") // 🔥 Kritik filtre
        .GroupBy(d => d.SenderId)
        .Select(g => g.OrderByDescending(d => d.SendTime).FirstOrDefault())
        .Select(d => new
        {
            PatientId = d.Sender.Id,
            PatientName = d.Sender.Name,
            PatientEmail = d.Sender.Email,
            AssignedAt = d.SendTime,
            State = d.State // 🔥 Bunu eklemezsen frontend filtre çalışmaz
        })
        .ToListAsync();

    return Ok(acceptedDemands);
}


        [HttpGet("check-status/{dietitianId}")]
        public async Task<IActionResult> CheckDemandStatus(int dietitianId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var demand = await _context.Demands
                .Where(d => d.SenderId == userId && d.DietitianId == dietitianId)
                .OrderByDescending(d => d.SendTime)
                .FirstOrDefaultAsync();

            if (demand == null)
            {
                return NotFound("Talep bulunamadı");
            }

            return Ok(new
            {
                status = demand.State,
                rejectionReason = demand.RejectionReason
            });
        }
    }
}
