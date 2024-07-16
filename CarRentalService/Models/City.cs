using System;
using System.ComponentModel.DataAnnotations;

namespace CarRentalService.Models
{
	public class City
	{
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public Guid CountryId { get; set; }
        public Country Country { get; set; }
    }
}

