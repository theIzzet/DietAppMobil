using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DietTracking.API.Migrations
{
    /// <inheritdoc />
    public partial class DemandUpdateMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Demands_AspNetUsers_ClientId",
                table: "Demands");

            migrationBuilder.DropForeignKey(
                name: "FK_Demands_DietitianProfiles_DietitienId",
                table: "Demands");

            migrationBuilder.RenameColumn(
                name: "DietitienId",
                table: "Demands",
                newName: "DietitianId");

            migrationBuilder.RenameColumn(
                name: "ClientId",
                table: "Demands",
                newName: "SenderId");

            migrationBuilder.RenameIndex(
                name: "IX_Demands_DietitienId",
                table: "Demands",
                newName: "IX_Demands_DietitianId");

            migrationBuilder.RenameIndex(
                name: "IX_Demands_ClientId",
                table: "Demands",
                newName: "IX_Demands_SenderId");

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "Demands",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Demands_AspNetUsers_SenderId",
                table: "Demands",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Demands_DietitianProfiles_DietitianId",
                table: "Demands",
                column: "DietitianId",
                principalTable: "DietitianProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Demands_AspNetUsers_SenderId",
                table: "Demands");

            migrationBuilder.DropForeignKey(
                name: "FK_Demands_DietitianProfiles_DietitianId",
                table: "Demands");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "Demands");

            migrationBuilder.RenameColumn(
                name: "SenderId",
                table: "Demands",
                newName: "ClientId");

            migrationBuilder.RenameColumn(
                name: "DietitianId",
                table: "Demands",
                newName: "DietitienId");

            migrationBuilder.RenameIndex(
                name: "IX_Demands_SenderId",
                table: "Demands",
                newName: "IX_Demands_ClientId");

            migrationBuilder.RenameIndex(
                name: "IX_Demands_DietitianId",
                table: "Demands",
                newName: "IX_Demands_DietitienId");

            migrationBuilder.AddForeignKey(
                name: "FK_Demands_AspNetUsers_ClientId",
                table: "Demands",
                column: "ClientId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Demands_DietitianProfiles_DietitienId",
                table: "Demands",
                column: "DietitienId",
                principalTable: "DietitianProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
