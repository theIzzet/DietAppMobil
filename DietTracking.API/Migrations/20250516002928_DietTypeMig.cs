using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DietTracking.API.Migrations
{
    /// <inheritdoc />
    public partial class DietTypeMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DietTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    About = table.Column<string>(type: "TEXT", nullable: true),
                    PicturePath = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DietTypeDietitianProfile",
                columns: table => new
                {
                    DietTypesId = table.Column<int>(type: "INTEGER", nullable: false),
                    DiyetisyenProfilesId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietTypeDietitianProfile", x => new { x.DietTypesId, x.DiyetisyenProfilesId });
                    table.ForeignKey(
                        name: "FK_DietTypeDietitianProfile_DietTypes_DietTypesId",
                        column: x => x.DietTypesId,
                        principalTable: "DietTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DietTypeDietitianProfile_DietitianProfiles_DiyetisyenProfilesId",
                        column: x => x.DiyetisyenProfilesId,
                        principalTable: "DietitianProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DietTypeDietitianProfile_DiyetisyenProfilesId",
                table: "DietTypeDietitianProfile",
                column: "DiyetisyenProfilesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DietTypeDietitianProfile");

            migrationBuilder.DropTable(
                name: "DietTypes");
        }
    }
}
