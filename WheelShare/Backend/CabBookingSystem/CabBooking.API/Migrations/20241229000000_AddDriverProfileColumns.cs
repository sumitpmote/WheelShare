using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CabBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDriverProfileColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "DriverProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "DriverProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullName",
                table: "DriverProfiles");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "DriverProfiles");
        }
    }
}