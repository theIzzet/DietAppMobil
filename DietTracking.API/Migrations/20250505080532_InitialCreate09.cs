using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DietTracking.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate09 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DietitianCertificates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ApplicationUserId = table.Column<string>(type: "TEXT", nullable: false),
                    CertificateName = table.Column<string>(type: "TEXT", nullable: false),
                    FilePath = table.Column<string>(type: "TEXT", nullable: false),
                    DateReceived = table.Column<DateTime>(type: "TEXT", nullable: false),
                    QualificationUrl = table.Column<string>(type: "TEXT", nullable: false),
                    Issuer = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietitianCertificates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DietitianCertificates_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DietitianExperiences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ApplicationUserId = table.Column<string>(type: "TEXT", nullable: false),
                    Institution = table.Column<string>(type: "TEXT", nullable: false),
                    Position = table.Column<string>(type: "TEXT", nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietitianExperiences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DietitianExperiences_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DietitianPatients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DietitianId = table.Column<string>(type: "TEXT", nullable: false),
                    PatientId = table.Column<string>(type: "TEXT", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietitianPatients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DietitianPatients_AspNetUsers_DietitianId",
                        column: x => x.DietitianId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DietitianPatients_AspNetUsers_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DietitianProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ApplicationUserId = table.Column<string>(type: "TEXT", nullable: false),
                    About = table.Column<string>(type: "TEXT", nullable: false),
                    ProfilePhotoPath = table.Column<string>(type: "TEXT", nullable: true),
                    Specialties = table.Column<string>(type: "TEXT", nullable: false),
                    WorkHours = table.Column<string>(type: "TEXT", nullable: false),
                    ClinicName = table.Column<string>(type: "TEXT", nullable: false),
                    ServiceDiets = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietitianProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DietitianProfiles_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DietitianCertificates_ApplicationUserId",
                table: "DietitianCertificates",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DietitianExperiences_ApplicationUserId",
                table: "DietitianExperiences",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DietitianPatients_DietitianId",
                table: "DietitianPatients",
                column: "DietitianId");

            migrationBuilder.CreateIndex(
                name: "IX_DietitianPatients_PatientId",
                table: "DietitianPatients",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_DietitianProfiles_ApplicationUserId",
                table: "DietitianProfiles",
                column: "ApplicationUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DietitianCertificates");

            migrationBuilder.DropTable(
                name: "DietitianExperiences");

            migrationBuilder.DropTable(
                name: "DietitianPatients");

            migrationBuilder.DropTable(
                name: "DietitianProfiles");
        }
    }
}
