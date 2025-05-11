using DietTracking.API.Entities;
using DietTracking.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DietTracking.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser,IdentityRole,string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<PersonalInfo> PersonalInfos { get; set; }
        public DbSet<PhysicalActivity> PhysicalActivities { get; set; }
        public DbSet<Lifestyle> Lifestyles { get; set; }
        public DbSet<FoodHabit> FoodHabits { get; set; }
        public DbSet<Goal> Goals { get; set; }
        public DbSet<MedicalHistory> MedicalHistories { get; set; }
        public DbSet<TestResult> TestResults { get; set; }
        public DbSet<BodyMeasurement> BodyMeasurements { get; set; }
        public DbSet<WeightMeasurement> WeightMeasurements { get; set; }
        public DbSet<DietitianReview> DietitianReviews { get; set; }


        // Diyetisyen paneli tabloları
        public DbSet<DietitianProfile> DietitianProfiles { get; set; }
        public DbSet<DietitianCertificate> DietitianCertificates { get; set; }
        public DbSet<DietitianExperience> DietitianExperiences { get; set; }
        public DbSet<DietitianPatient> DietitianPatients { get; set; }
        //public DbSet<DietList> DietLists { get; set; }
        public DbSet<DietPlan> DietPlans { get; set; }
        
        public DbSet<DietPlanEntry> DietPlanEntries { get; set; }

        public DbSet<ChatMessage> ChatMessages { get; set; }





    }
}
