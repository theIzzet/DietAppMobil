using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DietTracking.API.Migrations
{
    /// <inheritdoc />
    public partial class activityUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PhysicalActivities_ApplicationUserId",
                table: "PhysicalActivities");

            migrationBuilder.CreateIndex(
                name: "IX_PhysicalActivities_ApplicationUserId",
                table: "PhysicalActivities",
                column: "ApplicationUserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PhysicalActivities_ApplicationUserId",
                table: "PhysicalActivities");

            migrationBuilder.CreateIndex(
                name: "IX_PhysicalActivities_ApplicationUserId",
                table: "PhysicalActivities",
                column: "ApplicationUserId");
        }
    }
}
