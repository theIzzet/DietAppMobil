using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DietTracking.API.Migrations
{
    /// <inheritdoc />
    public partial class EntitiesUpdatedMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodHabits_AspNetUsers_ApplicationUserId",
                table: "FoodHabits");

            migrationBuilder.DropForeignKey(
                name: "FK_Goals_AspNetUsers_ApplicationUserId",
                table: "Goals");

            migrationBuilder.DropForeignKey(
                name: "FK_Lifestyles_AspNetUsers_ApplicationUserId",
                table: "Lifestyles");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalHistories_AspNetUsers_ApplicationUserId",
                table: "MedicalHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonalInfos_AspNetUsers_ApplicationUserId",
                table: "PersonalInfos");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "PersonalInfos",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "MedicalHistories",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "Lifestyles",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "Goals",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "FoodHabits",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FoodHabits_AspNetUsers_ApplicationUserId",
                table: "FoodHabits",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Goals_AspNetUsers_ApplicationUserId",
                table: "Goals",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lifestyles_AspNetUsers_ApplicationUserId",
                table: "Lifestyles",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalHistories_AspNetUsers_ApplicationUserId",
                table: "MedicalHistories",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PersonalInfos_AspNetUsers_ApplicationUserId",
                table: "PersonalInfos",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodHabits_AspNetUsers_ApplicationUserId",
                table: "FoodHabits");

            migrationBuilder.DropForeignKey(
                name: "FK_Goals_AspNetUsers_ApplicationUserId",
                table: "Goals");

            migrationBuilder.DropForeignKey(
                name: "FK_Lifestyles_AspNetUsers_ApplicationUserId",
                table: "Lifestyles");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalHistories_AspNetUsers_ApplicationUserId",
                table: "MedicalHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonalInfos_AspNetUsers_ApplicationUserId",
                table: "PersonalInfos");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "PersonalInfos",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "MedicalHistories",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "Lifestyles",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "Goals",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "FoodHabits",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_FoodHabits_AspNetUsers_ApplicationUserId",
                table: "FoodHabits",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Goals_AspNetUsers_ApplicationUserId",
                table: "Goals",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Lifestyles_AspNetUsers_ApplicationUserId",
                table: "Lifestyles",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalHistories_AspNetUsers_ApplicationUserId",
                table: "MedicalHistories",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonalInfos_AspNetUsers_ApplicationUserId",
                table: "PersonalInfos",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
