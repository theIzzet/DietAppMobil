using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DietTracking.API.Migrations
{
    /// <inheritdoc />
    public partial class CommentMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DietitianProfileId",
                table: "DietitianExperiences",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DietitianProfileId",
                table: "DietitianCertificates",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    CommentId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CommentText = table.Column<string>(type: "TEXT", nullable: true),
                    PublishedOn = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    DPId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.CommentId);
                    table.ForeignKey(
                        name: "FK_Comments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_DietitianProfiles_DPId",
                        column: x => x.DPId,
                        principalTable: "DietitianProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DietitianExperiences_DietitianProfileId",
                table: "DietitianExperiences",
                column: "DietitianProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_DietitianCertificates_DietitianProfileId",
                table: "DietitianCertificates",
                column: "DietitianProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_DPId",
                table: "Comments",
                column: "DPId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_UserId",
                table: "Comments",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DietitianCertificates_DietitianProfiles_DietitianProfileId",
                table: "DietitianCertificates",
                column: "DietitianProfileId",
                principalTable: "DietitianProfiles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DietitianExperiences_DietitianProfiles_DietitianProfileId",
                table: "DietitianExperiences",
                column: "DietitianProfileId",
                principalTable: "DietitianProfiles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DietitianCertificates_DietitianProfiles_DietitianProfileId",
                table: "DietitianCertificates");

            migrationBuilder.DropForeignKey(
                name: "FK_DietitianExperiences_DietitianProfiles_DietitianProfileId",
                table: "DietitianExperiences");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_DietitianExperiences_DietitianProfileId",
                table: "DietitianExperiences");

            migrationBuilder.DropIndex(
                name: "IX_DietitianCertificates_DietitianProfileId",
                table: "DietitianCertificates");

            migrationBuilder.DropColumn(
                name: "DietitianProfileId",
                table: "DietitianExperiences");

            migrationBuilder.DropColumn(
                name: "DietitianProfileId",
                table: "DietitianCertificates");
        }
    }
}
