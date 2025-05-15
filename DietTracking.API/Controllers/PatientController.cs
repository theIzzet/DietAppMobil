using DietTracking.API.Data;
using DietTracking.API.Dto;
using DietTracking.API.DTO;
using DietTracking.API.Entities;
using DietTracking.API.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Routing.Constraints;   // IWebHostEnvironment için

namespace DietTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        private readonly IWebHostEnvironment _env;   // ← doğru tip

        // 1) IWebHostEnvironment'i constructor'a ekleyin:
        public PatientController(ApplicationDbContext context,
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


        [HttpPost("test-result")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> UploadTestResult([FromForm] UploadTestResultDto dto)
        {
            var userId = GetCurrentUserId();

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.File.FileName);
            var filePath = Path.Combine(_env.WebRootPath, "Uploads", "TestResults", fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

            // 4) Dosyayı kaydet
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            // 5) Veritabanına kaydedeceğimiz göreceli yol
            var relativePath = Path.Combine("Uploads", "TestResults", fileName);


            var entity = new TestResult
            {
                ApplicationUserId = userId,
                TestName = dto.TestName,
                Date = dto.Date,
                FilePath = relativePath,
                Notes = dto.Notes
            };
            _context.TestResults.Add(entity);
            await _context.SaveChangesAsync();
            return Ok(dto);

        }


        [HttpGet("test-result")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> GetTestResults()
        {
            var userId = GetCurrentUserId();



            var list = await _context.TestResults
                .Where(x => x.ApplicationUserId == userId)
                .Select(x => new TestResultDto
                {
                    Id = x.Id,
                    TestName = x.TestName,
                    Date = x.Date,
                    FilePath = x.FilePath,
                    Notes = x.Notes
                })
                .ToListAsync();

            return Ok(list);
        }



        //Diyet listesi Kontrolü:
        [HttpGet("diet_list")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> GetMyLatestDietPlan()
        {
            var patientId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var plan = await _context.DietPlans
                .Include(p => p.Entries)
                .Where(p => p.PatientId == patientId)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (plan == null) return NotFound("Henüz tanımlı bir diyet planınız yok.");

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





        // ===================================================================
        //  TÜM FORMLARI TEK SEFERDE KAYDETME  (Danışan rolü)
        //  POST /api/forms/all
        // ===================================================================

        [HttpPost("all")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> CreateOrUpdateAllForms([FromBody] UserFormsCreateDto dto)
        {
            var userId = GetCurrentUserId();

            // 1 — PersonalInfo
            if (dto.PersonalInfo is { } p)
            {
                var pi = await _context.PersonalInfos
                        .FirstOrDefaultAsync(x => x.ApplicationUserId == userId);

                if (pi == null)
                {
                    pi = new PersonalInfo { ApplicationUserId = userId };
                    _context.PersonalInfos.Add(pi);
                }
                pi.Name = p.Name;
                pi.Surname = p.Surname;
                pi.DateOfBirth = p.DateOfBirth;
                pi.Gender = p.Gender;
                pi.Height = p.Height;
                pi.Weight = p.Weight;
                pi.Occupation = p.Occupation;
                pi.MaritalStatus = p.MaritalStatus;
                pi.ChildCount = p.ChildCount;
            }

            // 2 — PhysicalActivity
            if (dto.PhysicalActivity is { } pa)
            {
                var ph = await _context.PhysicalActivities
                        .FirstOrDefaultAsync(x => x.ApplicationUserId == userId);

                if (ph == null)
                {
                    ph = new PhysicalActivity { ApplicationUserId = userId };
                    _context.PhysicalActivities.Add(ph);
                }
                ph.RegularPhysicalActivity = pa.RegularPhysicalActivity;
                ph.DailyInactivity = pa.DailyInactivity;
                ph.SleepPattern = pa.SleepPattern;
            }

            // 3 — Lifestyle
            if (dto.Lifestyle is { } l)
            {
                var ls = await _context.Lifestyles
                        .FirstOrDefaultAsync(x => x.ApplicationUserId == userId);

                if (ls == null)
                {
                    ls = new Lifestyle { ApplicationUserId = userId };
                    _context.Lifestyles.Add(ls);
                }
                ls.RegularPhysicalActivity = l.RegularPhysicalActivity;
                ls.DailyInactivity = l.DailyInactivity;
                ls.SleepPattern = l.SleepPattern;
                ls.StressLevel = l.StressLevel;
                ls.SmokingHabits = l.SmokingHabits;
                ls.CaffeineIntake = l.CaffeineIntake;
                ls.MotivationLevel = l.MotivationLevel;
                ls.SocialSupport = l.SocialSupport;
                ls.AlcoholConsumption = l.AlcoholConsumption;
            }

            // 4 — FoodHabit
            if (dto.FoodHabit is { } f)
            {
                var fh = await _context.FoodHabits
                        .FirstOrDefaultAsync(x => x.ApplicationUserId == userId);

                if (fh == null)
                {
                    fh = new FoodHabit { ApplicationUserId = userId };
                    _context.FoodHabits.Add(fh);
                }
                fh.MealTimes = f.MealTimes;
                fh.ConsumedFoods = f.ConsumedFoods;
                fh.SnackingHabits = f.SnackingHabits;
                fh.OutsideEatingHabits = f.OutsideEatingHabits;
                fh.EatingDuration = f.EatingDuration;
                fh.SweetConsumption = f.SweetConsumption;
                fh.CookingMethods = f.CookingMethods;
                fh.WaterIntake = f.WaterIntake;
            }

            // 5 — Goal
            if (dto.Goal is { } g)
            {
                var gl = await _context.Goals
                        .FirstOrDefaultAsync(x => x.ApplicationUserId == userId);

                if (gl == null)
                {
                    gl = new Goal { ApplicationUserId = userId };
                    _context.Goals.Add(gl);
                }
                gl.WeightGoal = g.WeightGoal;
                gl.HealthIssuesManagement = g.HealthIssuesManagement;
                gl.SportsPerformanceGoals = g.SportsPerformanceGoals;
                gl.OtherGoals = g.OtherGoals;
            }

            // 6 — MedicalHistory
            if (dto.MedicalHistory is { } m)
            {
                var mh = await _context.MedicalHistories
                        .FirstOrDefaultAsync(x => x.ApplicationUserId == userId);

                if (mh == null)
                {
                    mh = new MedicalHistory { ApplicationUserId = userId };
                    _context.MedicalHistories.Add(mh);
                }
                mh.MedicationNames = m.MedicationNames;
                mh.PersonalDiseases = m.PersonalDiseases;
                mh.HereditaryDiseases = m.HereditaryDiseases;
                mh.Allergies = m.Allergies;
            }

            await _context.SaveChangesAsync();
            return Ok("Form verileri kaydedildi / güncellendi.");
        }

        // ===================================================================
        //  KULLANICININ TÜM FORM VERİLERİ – tek sayfa
        //  GET /api/forms/all
        // ===================================================================
        [HttpGet("all")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> GetAllMyForms()
        {
            var userId = GetCurrentUserId();

            // Her tablo için tek sorgu
            var personal = await _context.PersonalInfos.FirstOrDefaultAsync(x => x.ApplicationUserId == userId);
            var physical = await _context.PhysicalActivities.FirstOrDefaultAsync(x => x.ApplicationUserId == userId);
            var lifestyle = await _context.Lifestyles.FirstOrDefaultAsync(x => x.ApplicationUserId == userId);
            var food = await _context.FoodHabits.FirstOrDefaultAsync(x => x.ApplicationUserId == userId);
            var goal = await _context.Goals.FirstOrDefaultAsync(x => x.ApplicationUserId == userId);
            var medical = await _context.MedicalHistories.FirstOrDefaultAsync(x => x.ApplicationUserId == userId);

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

        // ───────── WEIGHT MEASUREMENTS ─────────

        [HttpGet("weight-measurements")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> ListWeightMeasurements()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var list = await _context.WeightMeasurements
                .Where(x => x.ApplicationUserId == userId)
                .OrderByDescending(x => x.MeasuredAt)
                .Select(x => new WeightMeasurementDto
                {
                    Id = x.Id,
                    MeasuredAt = x.MeasuredAt,
                    Weight = x.Weight,
                    PhotoPath = x.PhotoPath
                })
                .ToListAsync();
            return Ok(list);


        }
        [HttpPost("weight-measurements")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> AddWeightMeasurement(WeightMeasurementCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var entity = new WeightMeasurement
            {
                ApplicationUserId = userId,
                MeasuredAt = dto.MeasuredAt,
                Weight = dto.Weight
            };
            if (dto.Photo != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Photo.FileName);
                var folder = Path.Combine(_env.WebRootPath, "Uploads", "Measurements");
                Directory.CreateDirectory(folder);
                var path = Path.Combine(folder, fileName);
                await using var stream = new FileStream(path, FileMode.Create);
                await dto.Photo.CopyToAsync(stream);
                entity.PhotoPath = Path.Combine("Uploads", "Measurements", fileName);
            }
            _context.WeightMeasurements.Add(entity);
            await _context.SaveChangesAsync();
            return Created("", new { entity.Id });
        }

        // ───────── BODY MEASUREMENTS ─────────
        [HttpGet("body-measurements")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> ListBodyMeasurements()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var list = await _context.BodyMeasurements
                .Where(y => y.ApplicationUserId == userId)
                .OrderByDescending(y => y.MeasuredAt)
                .Select(y => new BodyMeasurementDto
                {
                    Id = y.id,
                    MeasuredAt = y.MeasuredAt,
                    Waist = y.Waist,
                    Hip = y.Hip,
                    Chest = y.Chest,
                    UpperArm = y.UpperArm,
                    Thigh = y.Thigh,
                    Neck = y.Neck,
                    PhotoPath = y.PhotoPath
                })
                .ToListAsync();
            return Ok(list);
        }

        [HttpPost("body-measurements")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> AddBodyMeasurement([FromForm] BodyMeasurementCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var entity = new BodyMeasurement
            {
                ApplicationUserId = userId,
                MeasuredAt = dto.MeasuredAt,
                Waist = dto.Waist,
                Hip = dto.Hip,
                Chest = dto.Chest,
                UpperArm = dto.UpperArm,
                Thigh = dto.Thigh,
                Neck = dto.Neck
            };

            if (dto.Photo != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Photo.FileName);
                var filepath = Path.Combine(_env.WebRootPath, "Uploads", "Measurements", fileName);
                Directory.CreateDirectory(filepath);

                var path = Path.Combine(filepath, fileName);

                await using var stream = new FileStream(path, FileMode.Create);
                await dto.Photo.CopyToAsync(stream);
                entity.PhotoPath = Path.Combine("Uploads", "Measurements", fileName);
            }

            _context.BodyMeasurements.Add(entity);
            await _context.SaveChangesAsync();
            return Created("", new { entity.ApplicationUserId });
        }




        [HttpPost("dietitian-review")]
        [Authorize(Roles = "Danisan")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var entity = new DietitianReview
            {
                DietitianId = dto.DietitianId,
                ReviewerId = userId,
                Comment = dto.Comment,
                Rating = dto.Rating,
                CreatedAt = DateTime.UtcNow
            };

            _context.DietitianReviews.AddAsync(entity);
            await _context.SaveChangesAsync();
            return Created("", new { entity.Id });


        }
        [HttpGet("dietitian-review")]
        //[Authorize(Roles = "Danisan")]
        public async Task<IActionResult> GetReviews(string dietitianId)
        {
            var reviews = await _context.DietitianReviews
               .Include(r => r.Reviewer)
               .Where(r => r.DietitianId == dietitianId)
               .OrderByDescending(r => r.CreatedAt)
               .Select(r => new ReviewDto
               {
                   Id = r.Id,
                   ReviewerName = r.Reviewer.UserName,
                   Rating = r.Rating,
                   Comment = r.Comment,
                   CreatedAt = r.CreatedAt
               })
               .ToListAsync();

            return Ok(reviews);
        }

    }
}
