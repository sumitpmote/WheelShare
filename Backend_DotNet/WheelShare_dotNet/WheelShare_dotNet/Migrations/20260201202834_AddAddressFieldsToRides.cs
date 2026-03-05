using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WheelShare_dotNet.Migrations
{
    /// <inheritdoc />
    public partial class AddAddressFieldsToRides : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DestinationAddress",
                table: "Rides",
                type: "varchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SourceAddress",
                table: "Rides",
                type: "varchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DestinationAddress",
                table: "Rides");

            migrationBuilder.DropColumn(
                name: "SourceAddress",
                table: "Rides");
        }
    }
}
