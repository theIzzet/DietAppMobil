// Controllers/DietitianController.cs  (ilgili using’ler dahil)
using DietTracking.API.Data;
using DietTracking.API.Dto;
using DietTracking.API.DTO;
using DietTracking.API.Entities;
using DietTracking.API.Models;
using DietTracking.API.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;



namespace DietTracking.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class DietitianController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IWebHostEnvironment _env;   // ← doğru tip

        // 1) IWebHostEnvironment'i constructor'a ekleyin:
        public DietitianController(ApplicationDbContext context,
                                 IWebHostEnvironment env)
        {
            _context = context;
            _env = env;    // artık _env null olmayacak
        }
        private string GetCurrentUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            }
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("Kullanıcı bilgileri alınamadı.");
            }

            return userId;

        }

        private string DietitianId => User.FindFirstValue(ClaimTypes.NameIdentifier);
        // ───────────────────────────────────────────────────────────────
        //  PROFİL   (GET  →  POST  →  PUT  →  DELETE)
        // ───────────────────────────────────────────────────────────────


        [HttpGet("profile")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> GetDietitianProfile()
        {

            var diyetisyten = await _context.DietitianProfiles
                .FirstOrDefaultAsync(x => x.ApplicationUserId == DietitianId);
            if (diyetisyten == null) return NotFound();

            var dto = new DietitianProfileDto
            {
                About = diyetisyten.About,
                ProfilePhotoPath = diyetisyten.ProfilePhotoPath,
                Specialties = diyetisyten.Specialties.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
                WorkHours = diyetisyten.WorkHours,
                ClinicName = diyetisyten.ClinicName,
                ServiceDiets = diyetisyten.ServiceDiets.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            };
            return Ok(dto);
        }

        [HttpPost("profile")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> CreateProfile([FromForm] UpsertDietitianProfileDto dto)
        {

            if (await _context.DietitianProfiles.AnyAsync(x => x.ApplicationUserId == DietitianId))
                return BadRequest("Bu kullanıcının profili zaten mevcut.");

            // ==> DTO'dan entity'ye manuel atama
            var profile = new DietitianProfile
            {
                ApplicationUserId = DietitianId,
                About = dto.About,
                Specialties = string.Join(',', dto.Specialties),
                WorkHours = dto.WorkHours,
                ClinicName = dto.ClinicName,
                ServiceDiets = string.Join(',', dto.ServiceDiets)
            };

            // Profil fotoğrafı varsa kaydet
            if (dto.ProfilePhoto != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.ProfilePhoto.FileName);
                var folder = Path.Combine(_env.WebRootPath, "Uploads", "Dietitian", "ProfilePhotos");
                Directory.CreateDirectory(folder);
                var path = Path.Combine(folder, fileName);

                await using var stream = new FileStream(path, FileMode.Create);
                await dto.ProfilePhoto.CopyToAsync(stream);

                profile.ProfilePhotoPath = Path.Combine("Uploads", "Dietitian", "ProfilePhotos", fileName);
            }

            _context.DietitianProfiles.Add(profile);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDietitianProfile), null, dto);
        }

        // -----------------  PUT  /api/dietitianpanel/profile  -----------------
        [HttpPut("profile")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpsertDietitianProfileDto dto)
        {

            var profile = await _context.DietitianProfiles
                .FirstOrDefaultAsync(x => x.ApplicationUserId == DietitianId);

            if (profile == null) return NotFound();

            // ==> DTO'dan entity'ye manuel güncelleme
            profile.About = dto.About;
            profile.Specialties = string.Join(',', dto.Specialties);
            profile.WorkHours = dto.WorkHours;
            profile.ClinicName = dto.ClinicName;
            profile.ServiceDiets = string.Join(',', dto.ServiceDiets);

            // Profil fotoğrafı güncelleme
            if (dto.ProfilePhoto != null)
            {
                // Eski dosyayı sil (isteğe bağlı)
                if (!string.IsNullOrEmpty(profile.ProfilePhotoPath))
                {
                    var oldFull = Path.Combine(_env.WebRootPath, profile.ProfilePhotoPath);
                    if (System.IO.File.Exists(oldFull)) System.IO.File.Delete(oldFull);
                }

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.ProfilePhoto.FileName);
                var folder = Path.Combine(_env.WebRootPath, "Uploads", "Dietitian", "ProfilePhotos");
                Directory.CreateDirectory(folder);
                var newPath = Path.Combine(folder, fileName);

                await using var stream = new FileStream(newPath, FileMode.Create);
                await dto.ProfilePhoto.CopyToAsync(stream);

                profile.ProfilePhotoPath = Path.Combine("Uploads", "Dietitian", "ProfilePhotos", fileName);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("profile")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> DeleteProfile()
        {


            var profile = await _context.DietitianProfiles
                .FirstOrDefaultAsync(x => x.ApplicationUserId == DietitianId);
            if (profile == null) return NotFound();

            // Profil fotoğrafını da silelim (opsiyonel)
            if (!string.IsNullOrEmpty(profile.ProfilePhotoPath))
            {
                var fullPath = Path.Combine(_env.WebRootPath, profile.ProfilePhotoPath);
                if (System.IO.File.Exists(fullPath))
                    System.IO.File.Delete(fullPath);
            }

            _context.DietitianProfiles.Remove(profile);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // ───────────────────────────────────────────────────────────────
        //  CERTIFICATES   (GET  →  POST  →  PUT  →  DELETE)
        // ───────────────────────────────────────────────────────────────

        // 1️⃣  GET  /api/dietitianpanel/certificates  – Diyetisyenin tüm sertifikaları
        [HttpGet("certificates")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> ListCertificates()
        {
            var id = DietitianId;
            var list = await _context.DietitianCertificates
                .Where(x => x.ApplicationUserId == id)
                .Select(x => new CertificateDto
                {
                    Id = x.Id,
                    CertificateName = x.CertificateName,
                    FilePath = x.FilePath,
                    DateReceived = x.DateReceived,
                    QualificationUrl = x.QualificationUrl,
                    Issuer = x.Issuer
                })
                .ToListAsync();
            return Ok(list);
        }

        // 2️⃣  POST /api/dietitianpanel/certificates   – Yeni sertifika yükle
        [HttpPost("certificates")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> UploadCertificate([FromForm] UpsertCertificateDto dto)
        {
            var id = DietitianId;

            // Dosyayı kaydet
            var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);
            var folder = Path.Combine(_env.WebRootPath, "Uploads", "Dietitian", "Certificates");
            Directory.CreateDirectory(folder);
            var fullPath = Path.Combine(folder, fileName);
            await using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            var cert = new DietitianCertificate
            {
                ApplicationUserId = id,
                CertificateName = dto.CertificateName,
                FilePath = Path.Combine("Uploads", "Dietitian", "Certificates", fileName),
                DateReceived = dto.DateReceived,
                QualificationUrl = dto.QualificationUrl,
                Issuer = dto.Issuer
            };

            _context.DietitianCertificates.Add(cert);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ListCertificates), null, new { cert.Id });
        }

        // 3️⃣  PUT  /api/dietitianpanel/certificates/{id}   – Sertifika güncelle
        [HttpPut("certificates/{id}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> UpdateCertificate(int id, [FromForm] UpsertCertificateDto dto)
        {
            var cert = await _context.DietitianCertificates.FindAsync(id);
            if (cert == null || cert.ApplicationUserId != DietitianId) return NotFound();

            // Metin alanları
            cert.CertificateName = dto.CertificateName;
            cert.DateReceived = dto.DateReceived;
            cert.QualificationUrl = dto.QualificationUrl;
            cert.Issuer = dto.Issuer;

            // Yeni dosya geldiyse eskiyi silip yenisini kaydet
            if (dto.File != null)
            {
                var oldPath = Path.Combine(_env.WebRootPath, cert.FilePath ?? "");
                if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);
                var folder = Path.Combine(_env.WebRootPath, "Uploads", "Dietitian", "Certificates");
                Directory.CreateDirectory(folder);
                var newFull = Path.Combine(folder, fileName);
                await using var stream = new FileStream(newFull, FileMode.Create);
                await dto.File.CopyToAsync(stream);

                cert.FilePath = Path.Combine("Uploads", "Dietitian", "Certificates", fileName);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 4️⃣  DELETE /api/dietitianpanel/certificates/{id}  – Sertifika sil
        [HttpDelete("certificates/{id}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> DeleteCertificate(int id)
        {
            var cert = await _context.DietitianCertificates.FindAsync(id);
            if (cert == null || cert.ApplicationUserId != DietitianId) return NotFound();

            // Fiziksel dosyayı sil
            var fullPath = Path.Combine(_env.WebRootPath, cert.FilePath ?? "");
            if (System.IO.File.Exists(fullPath)) System.IO.File.Delete(fullPath);

            _context.DietitianCertificates.Remove(cert);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // ───────────────────────────────────────────────────────────────
        //  EXPERIENCES   (GET → POST → PUT → DELETE)
        // ───────────────────────────────────────────────────────────────

        // 1️⃣  GET  /api/dietitianpanel/experiences   – tüm deneyim listesi
        [HttpGet("experiences")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> ListExperiences()
        {
            var id = DietitianId;
            var list = await _context.DietitianExperiences
                .Where(x => x.ApplicationUserId == id)
                .Select(x => new ExperienceDto
                {
                    Id = x.Id,
                    Institution = x.Institution,
                    Position = x.Position,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate
                })
                .ToListAsync();
            return Ok(list);
        }

        [HttpPost("experiences")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> CreateExperience([FromBody] UpsertExperienceDto dto)
        {
            var id = DietitianId;
            var exp = new DietitianExperience
            {
                ApplicationUserId = id,
                Institution = dto.Institution,
                Position = dto.Position,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };
            _context.DietitianExperiences.Add(exp);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(ListExperiences), null, new { exp.Id });
        }

        [HttpPut("experiences/{id}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> UpdateExperience(int id, [FromBody] UpsertExperienceDto dto)
        {
            var exp = await _context.DietitianExperiences.FindAsync(id);
            if (exp == null || exp.ApplicationUserId != DietitianId) return NotFound();

            exp.Institution = dto.Institution;
            exp.Position = dto.Position;
            exp.StartDate = dto.StartDate;
            exp.EndDate = dto.EndDate;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("experiences/{id}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> DeleteExperience(int id)
        {
            var exp = await _context.DietitianExperiences.FindAsync(id);
            if (exp == null || exp.ApplicationUserId != DietitianId) return NotFound();

            _context.DietitianExperiences.Remove(exp);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // ───────────────────────────────────────────────────────────────
        //  PATIENTS   (GET list → GET one → POST → PUT → DELETE)
        // ───────────────────────────────────────────────────────────────

        // GET  /api/dietitianpanel/patients       – diyetisyenin tüm hastaları
        [HttpGet("patients")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> ListPatients()
        {
            var id = DietitianId;
            var list = await _context.DietitianPatients
                .Where(x => x.DietitianId == id)
                .Select(x => new PatientDto
                {
                    PatientId = x.PatientId,
                    PatientName = x.Patient.UserName,
                    PatientEmail = x.Patient.Email,
                    AssignedAt = x.AssignedAt
                })
                .ToListAsync();
            return Ok(list);
        }

        // GET  /api/dietitianpanel/patients/{patientId}   – tek hasta
        [HttpGet("patients/{patientId}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> GetPatient(string patientId)
        {
            var id = DietitianId;
            var map = await _context.DietitianPatients
                .Include(x => x.Patient)
                .FirstOrDefaultAsync(x => x.DietitianId == id && x.PatientId == patientId);

            if (map == null) return NotFound();

            return Ok(new PatientDto
            {
                PatientId = map.PatientId,
                PatientName = map.Patient.UserName,
                PatientEmail = map.Patient.Email,
                AssignedAt = map.AssignedAt
            });
        }

        // POST /api/dietitianpanel/patients       – yeni hasta atama
        [HttpPost("patients")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> AssignPatient([FromBody] AssignPatientDto dto)
        {
            var id = DietitianId;

            if (await _context.DietitianPatients
                .AnyAsync(x => x.DietitianId == id && x.PatientId == dto.PatientId))
                return BadRequest("Hasta zaten atanmış.");

            var map = new DietitianPatient
            {
                DietitianId = id,
                PatientId = dto.PatientId
            };

            _context.DietitianPatients.Add(map);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatient),
                new { patientId = dto.PatientId },
                new { dto.PatientId });
        }

        // DELETE /api/dietitianpanel/patients/{patientId}  – hastayı kaldır
        [HttpDelete("patients/{patientId}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> DeletePatientAssignment(string patientId)
        {
            var id = DietitianId;
            var map = await _context.DietitianPatients
                .FirstOrDefaultAsync(x => x.DietitianId == id && x.PatientId == patientId);

            if (map == null) return NotFound();

            _context.DietitianPatients.Remove(map);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // ───────────────────────────────────────────────────────────────
        //  DIET PLANS   (GET list → GET detail → POST → PUT → DELETE)
        // ───────────────────────────────────────────────────────────────
        // ───────────────────────────────────────────────────────────────
        //  DIET PLANS – Latest (tek hasta için tam detay)
        //  GET /api/dietitianpanel/diet-plans/latest?patientId=XXX
        // ───────────────────────────────────────────────────────────────

        [HttpGet("diet-plans/latest")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> GetLatestDietPlan([FromQuery] string patientId)
        {
            var dietitianId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var plan = await _context.DietPlans
                .Include(p => p.Entries)
                .Where(p => p.DietitianId == dietitianId && p.PatientId == patientId)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (plan == null) return NotFound("Bu hastaya ait plan bulunamadı.");

            var dto = new DietPlanDetailDto
            {
                Id = plan.Id,
                Description = plan.Description,
                CreatedAt = plan.CreatedAt,
                Entries = plan.Entries
                    .OrderBy(e => e.DayOrder)
                    .ThenBy(e => e.MealName)
                    .Select(e => new DietPlanEntryDto
                    {
                        DayOrder = e.DayOrder,
                        MealName = e.MealName,
                        Content = e.Content
                    })
                    .ToList()
            };

            return Ok(dto);
        }


        // 3️⃣  POST /api/dietitianpanel/diet-plans        – plan oluştur
        [HttpPost("diet-plans")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> CreateDietPlan([FromBody] UpsertDietPlanDto dto)
        {
            var plan = new DietPlan
            {
                DietitianId = DietitianId,
                PatientId = dto.PatientId,
                Description = dto.Description,
                Entries = dto.Entries.Select(ent => new DietPlanEntry
                {
                    DayOrder = ent.DayOrder,
                    MealName = ent.MealName,
                    Content = ent.Content
                }).ToList()
            };

            _context.DietPlans.Add(plan);
            await _context.SaveChangesAsync();

            return Ok(plan); 
                }

        // 4️⃣  PUT  /api/dietitianpanel/diet-plans/{id}   – plan güncelle
        [HttpPut("diet-plans/{id}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> UpdateDietPlan(int id,[FromBody] UpsertDietPlanDto dto)
        {
            var plan = await _context.DietPlans
                .Include(p => p.Entries)
                .FirstOrDefaultAsync(p => p.Id == id && p.DietitianId == DietitianId);

            if (plan == null) return NotFound();

            // Başlık alanları
            plan.Description = dto.Description;

            // Eski öğünleri sil
            _context.DietPlanEntries.RemoveRange(plan.Entries);

            // Yeni öğünleri ekle
            plan.Entries = dto.Entries.Select(ent => new DietPlanEntry
            {
                DietPlanId = id,
                DayOrder = ent.DayOrder,
                MealName = ent.MealName,
                Content = ent.Content
            }).ToList();

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 5️⃣  DELETE /api/dietitianpanel/diet-plans/{id} – plan sil
        [HttpDelete("diet-plans/{id}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> DeleteDietPlan(int id)
        {
            var plan = await _context.DietPlans
                .Include(p => p.Entries)
                .FirstOrDefaultAsync(p => p.Id == id && p.DietitianId == DietitianId);

            if (plan == null) return NotFound();

            // Önce öğünleri, sonra planı sil
            _context.DietPlanEntries.RemoveRange(plan.Entries);
            _context.DietPlans.Remove(plan);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ===================================================================
        //  DİYETİSYEN – HASTANIN TÜM FORM VERİLERİ
        //  GET /api/forms/all/{patientId}
        // ===================================================================
        [HttpGet("all/{patientId}")]
        [Authorize(Roles = "Diyetisyen")]
        public async Task<IActionResult> GetAllFormsOfPatient(string patientId)
        {
            

            // Her tablo için tek sorgu
            var personal = await _context.PersonalInfos.FirstOrDefaultAsync(x => x.ApplicationUserId == patientId);
            var physical = await _context.PhysicalActivities.FirstOrDefaultAsync(x => x.ApplicationUserId == patientId);
            var lifestyle = await _context.Lifestyles.FirstOrDefaultAsync(x => x.ApplicationUserId == patientId);
            var food = await _context.FoodHabits.FirstOrDefaultAsync(x => x.ApplicationUserId == patientId);
            var goal = await _context.Goals.FirstOrDefaultAsync(x => x.ApplicationUserId == patientId);
            var medical = await _context.MedicalHistories.FirstOrDefaultAsync(x => x.ApplicationUserId == patientId);

            var result = new UserFormsCreateDto
            {
                PersonalInfo = personal == null ? null : new PersonalInfoDto
                {
                    Name = personal.Name,
                    Surname = personal.Surname,
                    DateOfBirth = personal.DateOfBirth,
                    Gender = personal.Gender,
                    Height = personal.Height,
                    Weight = personal.Weight,
                    Occupation = personal.Occupation,
                    MaritalStatus = personal.MaritalStatus,
                    ChildCount = personal.ChildCount
                },
                PhysicalActivity = physical == null ? null : new PhysicalActivityDto
                {
                    RegularPhysicalActivity = physical.RegularPhysicalActivity,
                    DailyInactivity = physical.DailyInactivity,
                    SleepPattern = physical.SleepPattern
                },
                Lifestyle = lifestyle == null ? null : new LifestyleDto
                {
                    RegularPhysicalActivity = lifestyle.RegularPhysicalActivity,
                    DailyInactivity = lifestyle.DailyInactivity,
                    SleepPattern = lifestyle.SleepPattern,
                    StressLevel = lifestyle.StressLevel,
                    SmokingHabits = lifestyle.SmokingHabits,
                    CaffeineIntake = lifestyle.CaffeineIntake,
                    MotivationLevel = lifestyle.MotivationLevel,
                    SocialSupport = lifestyle.SocialSupport,
                    AlcoholConsumption = lifestyle.AlcoholConsumption
                },
                FoodHabit = food == null ? null : new FoodHabitDto
                {
                    MealTimes = food.MealTimes,
                    ConsumedFoods = food.ConsumedFoods,
                    SnackingHabits = food.SnackingHabits,
                    OutsideEatingHabits = food.OutsideEatingHabits,
                    EatingDuration = food.EatingDuration,
                    SweetConsumption = food.SweetConsumption,
                    CookingMethods = food.CookingMethods,
                    WaterIntake = food.WaterIntake
                },
                Goal = goal == null ? null : new GoalDto
                {
                    WeightGoal = goal.WeightGoal,
                    HealthIssuesManagement = goal.HealthIssuesManagement,
                    SportsPerformanceGoals = goal.SportsPerformanceGoals,
                    OtherGoals = goal.OtherGoals
                },
                MedicalHistory = medical == null ? null : new MedicalHistoryDto
                {
                    MedicationNames = medical.MedicationNames,
                    PersonalDiseases = medical.PersonalDiseases,
                    HereditaryDiseases = medical.HereditaryDiseases,
                    Allergies = medical.Allergies
                }
            };

            return Ok(result);
        }

    }
}
