using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DietTracking.API.Migrations
{
    /// <inheritdoc />
    public partial class PhysicalActivityUpdateMig2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhysicalActivities_AspNetUsers_ApplicationUserId",
                table: "PhysicalActivities");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "PhysicalActivities",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_PhysicalActivities_AspNetUsers_ApplicationUserId",
                table: "PhysicalActivities",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhysicalActivities_AspNetUsers_ApplicationUserId",
                table: "PhysicalActivities");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "PhysicalActivities",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PhysicalActivities_AspNetUsers_ApplicationUserId",
                table: "PhysicalActivities",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
