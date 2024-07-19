using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarRentalService.Migrations
{
    /// <inheritdoc />
    public partial class AddRentalTypeToCarRental : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RentalType",
                table: "CarRentals",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentalType",
                table: "CarRentals");
        }
    }
}
