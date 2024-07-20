using System;
namespace CarRentalService.Models
{
	public class CarDto
	{
        public Guid Id { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string LicensePlate { get; set; }
        public decimal PricePerDay { get; set; }
        public Guid CityId { get; set; }
    }
}

