using DietTracking.API.Data;
using DietTracking.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DietTracking.API.Models;
using Microsoft.AspNetCore.Authorization;
using DietApp.Entities;
using DietTracking.API.DTO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace DietTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DietTypeManagementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DietTypeManagementController> _logger;

        public DietTypeManagementController(ApplicationDbContext context, ILogger<DietTypeManagementController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Gets all diet types available in the system
        /// </summary>
        /// <returns>List of diet types</returns>
        [HttpGet("diet-types")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<DietTypeDto>>> GetAllDietTypes()
        {
            try
            {
                var dietTypes = await _context.DietTypes
                    .Select(dt => new DietTypeDto
                    {
                        Id = dt.Id,
                        Title = dt.Title,
                        Description = dt.Description,
                        About = dt.About,
                        PicturePath = dt.PicturePath
                    })
                    .ToListAsync();

                return Ok(dietTypes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all diet types");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        /// <summary>
        /// Gets a specific diet type by ID
        /// </summary>
        /// <param name="id">Diet type ID</param>
        /// <returns>Diet type details</returns>
        [HttpGet("diet-types/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DietTypeDto>> GetDietTypeById(int id)
        {
            try
            {
                var dietType = await _context.DietTypes
                    .Where(dt => dt.Id == id)
                    .Select(dt => new DietTypeDto
                    {
                        Id = dt.Id,
                        Title = dt.Title,
                        Description = dt.Description,
                        About = dt.About,
                        PicturePath = dt.PicturePath
                    })
                    .FirstOrDefaultAsync();

                if (dietType == null)
                {
                    return NotFound($"Diet type with ID {id} not found.");
                }

                return Ok(dietType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting diet type with ID {id}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        /// <summary>
        /// Gets all dietitians offering a specific diet type
        /// </summary>
        /// <param name="dietTypeId">Diet type ID</param>
        /// <returns>List of dietitians</returns>
        [HttpGet("diet-types/{dietTypeId}/dietitians")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<DietitianProfileDto>>> GetDietitiansByDietType(int dietTypeId)
        {
            try
            {
                // First check if diet type exists
                var dietTypeExists = await _context.DietTypes.AnyAsync(dt => dt.Id == dietTypeId);
                if (!dietTypeExists)
                {
                    return NotFound($"Diet type with ID {dietTypeId} not found.");
                }

                var dietitians = await _context.DietitianProfiles
                    .Where(dp => dp.DietTypes.Any(dt => dt.Id == dietTypeId))
                    .Include(dp => dp.User)
                    .Select(dp => new DietitianProfileDto
                    {
                        Id = dp.Id,
                        UserId = dp.ApplicationUserId,
                        Name = dp.User.Name,
                        Surname = dp.User.Surname,
                        About = dp.About,
                        ProfilePhotoPath = dp.ProfilePhotoPath,
                        
                        WorkHours = dp.WorkHours,
                        ClinicName = dp.ClinicName,
                        
                    })
                    .ToListAsync();

                return Ok(dietitians);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting dietitians for diet type ID {dietTypeId}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        /// <summary>
        /// Gets details of a specific dietitian
        /// </summary>
        /// <param name="id">Dietitian profile ID</param>
        /// <returns>Dietitian details including comments</returns>
        [HttpGet("dietitians/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DietitianProfileDetailsDto>> GetDietitianById(int id)
        {
            try
            {
                var dietitian = await _context.DietitianProfiles
                    .Include(dp => dp.User)
                    .Include(dp => dp.DietTypes)
                    .Include(dp => dp.Comments)
                        .ThenInclude(c => c.User)
                    .Where(dp => dp.Id == id)
                    .Select(dp => new DietitianProfileDetailsDto
                    {
                        Id = dp.Id,
                        UserId = dp.ApplicationUserId,
                        Name = dp.User.Name,
                        Surname = dp.User.Surname,
                        About = dp.About,
                        ProfilePhotoPath = dp.ProfilePhotoPath,
                        Specialties = dp.Specialties.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(), // String'i listeye çevir
                        WorkHours = dp.WorkHours,
                        ClinicName = dp.ClinicName,
                        ServiceDiets = dp.ServiceDiets,
                        DietTypes = dp.DietTypes.Select(dt => new DietTypeDto
                        {
                            Id = dt.Id,
                            Title = dt.Title,
                            Description = dt.Description
                        }).ToList(),
                        Comments = dp.Comments.Select(c => new CommentDto
                        {
                            CommentId = c.CommentId,
                            CommentText = c.CommentText,
                            PublishedOn = c.PublishedOn,
                            Rating = c.Rating,
                            UserId = c.UserId,
                            UserName = c.User.Name,
                            UserSurname = c.User.Surname
                        }).OrderByDescending(c => c.PublishedOn).ToList(),
                        AverageRating = dp.Comments.Any() ? dp.Comments.Average(c => c.Rating) : 0
                    })
                    .FirstOrDefaultAsync();

                if (dietitian == null)
                {
                    return NotFound($"Dietitian with ID {id} not found.");
                }

                return Ok(dietitian);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting dietitian with ID {id}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
        /// <summary>
        /// Adds a new comment to a dietitian's profile
        /// </summary>
        /// <param name="dietitianId">Dietitian profile ID</param>
        /// <param name="model">Comment data</param>
        /// <returns>Created comment</returns>
        [HttpPost("dietitians/{dietitianId}/comments")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CommentDto>> AddComment(int dietitianId, [FromBody] AddCommentDto model)
        {
            try
            {
                
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                
                var dietitian = await _context.DietitianProfiles.Include(d => d.User).Where(d => d.Id == dietitianId).FirstOrDefaultAsync();
                if (dietitian == null)
                {
                    return NotFound($"Dietitian with ID {dietitianId} not found.");
                }

                
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return Unauthorized();
                }

                
                var comment = new Comment
                {
                    CommentText = model.CommentText,
                    PublishedOn = DateTime.UtcNow,
                    UserId = userId,
                    DPId = dietitianId,
                    Rating = model.Rating
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                
                var commentDto = new CommentDto
                {
                    CommentId = comment.CommentId,
                    CommentText = comment.CommentText,
                    PublishedOn = comment.PublishedOn,
                    Rating = comment.Rating,
                    UserId = comment.UserId,
                    UserName = user.Name,
                    UserSurname = user.Surname
                };


                if (!string.IsNullOrEmpty(dietitian?.User?.ExpoPushToken))
                {

                    var pushBody = new
                    {
                        to = dietitian.User.ExpoPushToken,
                        title = "Yeni Yorum!",
                        body = $"{user.Name} sizin profilinize yorum yaptı!",
                        data = new { commentId = comment.CommentId }
                    };

                    using (var client = new HttpClient())
                    {
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        var json = JsonSerializer.Serialize(pushBody);
                        var content = new StringContent(json, Encoding.UTF8, "application/json");

                        await client.PostAsync("https://exp.host/--/api/v2/push/send", content);
                    }

                }

                return CreatedAtAction(nameof(GetDietitianById), new { id = dietitianId }, commentDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while adding comment to dietitian with ID {dietitianId}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
    }
}