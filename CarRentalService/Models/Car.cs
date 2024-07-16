using System;
using System.ComponentModel.DataAnnotations;

namespace CarRentalService.Models
{
	public class Car
	{
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Make { get; set; }
        [Required]
        public string Model { get; set; }
        [Required]
        public int Year { get; set; }
        [Required]
        public string LicensePlate { get; set; }
        [Required]
        public decimal PricePerDay { get; set; }
        [Required]
        public Guid CityId { get; set; }
        public City City { get; set; }
    }
}

