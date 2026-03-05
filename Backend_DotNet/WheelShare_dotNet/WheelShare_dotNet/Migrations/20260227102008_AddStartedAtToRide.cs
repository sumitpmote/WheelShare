using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WheelShare_dotNet.Migrations
{
    /// <inheritdoc />
    public partial class AddStartedAtToRide : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "StartedAt",
                table: "Rides",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CarpoolRequests",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    OriginalRideId = table.Column<int>(type: "int", nullable: false),
                    RequestingCustomerId = table.Column<int>(type: "int", nullable: false),
                    SourceLat = table.Column<double>(type: "double", nullable: false),
                    SourceLng = table.Column<double>(type: "double", nullable: false),
                    SourceAddress = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DestinationLat = table.Column<double>(type: "double", nullable: false),
                    DestinationLng = table.Column<double>(type: "double", nullable: false),
                    DestinationAddress = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RequestedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarpoolRequests", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK_CarpoolRequests_Rides_OriginalRideId",
                        column: x => x.OriginalRideId,
                        principalTable: "Rides",
                        principalColumn: "RideId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CarpoolRequests_Users_RequestingCustomerId",
                        column: x => x.RequestingCustomerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_CarpoolRequests_OriginalRideId",
                table: "CarpoolRequests",
                column: "OriginalRideId");

            migrationBuilder.CreateIndex(
                name: "IX_CarpoolRequests_RequestingCustomerId",
                table: "CarpoolRequests",
                column: "RequestingCustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarpoolRequests");

            migrationBuilder.DropColumn(
                name: "StartedAt",
                table: "Rides");
        }
    }
}
