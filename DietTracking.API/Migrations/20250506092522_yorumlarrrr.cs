using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DietTracking.API.Migrations
{
    /// <inheritdoc />
    public partial class yorumlarrrr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DietitianReviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DietitianId = table.Column<string>(type: "TEXT", nullable: false),
                    ReviewerId = table.Column<string>(type: "TEXT", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    Comment = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietitianReviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DietitianReviews_AspNetUsers_DietitianId",
                        column: x => x.DietitianId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DietitianReviews_AspNetUsers_ReviewerId",
                        column: x => x.ReviewerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DietitianReviews_DietitianId",
                table: "DietitianReviews",
                column: "DietitianId");

            migrationBuilder.CreateIndex(
                name: "IX_DietitianReviews_ReviewerId",
                table: "DietitianReviews",
                column: "ReviewerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DietitianReviews");
        }
    }
}
