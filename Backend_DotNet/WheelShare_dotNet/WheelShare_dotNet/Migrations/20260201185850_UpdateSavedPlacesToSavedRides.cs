using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WheelShare_dotNet.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSavedPlacesToSavedRides : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PlaceType",
                table: "SavedPlaces",
                newName: "RideName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "SavedPlaces",
                newName: "PickupAddress");

            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "SavedPlaces",
                newName: "PickupLongitude");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "SavedPlaces",
                newName: "PickupLatitude");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "SavedPlaces",
                newName: "DropAddress");

            migrationBuilder.AddColumn<double>(
                name: "DropLatitude",
                table: "SavedPlaces",
                type: "double",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "DropLongitude",
                table: "SavedPlaces",
                type: "double",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DropLatitude",
                table: "SavedPlaces");

            migrationBuilder.DropColumn(
                name: "DropLongitude",
                table: "SavedPlaces");

            migrationBuilder.RenameColumn(
                name: "RideName",
                table: "SavedPlaces",
                newName: "PlaceType");

            migrationBuilder.RenameColumn(
                name: "PickupLongitude",
                table: "SavedPlaces",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "PickupLatitude",
                table: "SavedPlaces",
                newName: "Latitude");

            migrationBuilder.RenameColumn(
                name: "PickupAddress",
                table: "SavedPlaces",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "DropAddress",
                table: "SavedPlaces",
                newName: "Address");
        }
    }
}
