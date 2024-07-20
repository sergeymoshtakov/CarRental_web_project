using System;
using System.ComponentModel.DataAnnotations;

namespace CarRentalService.Models
{
	public class CityDto
	{
        public string Name { get; set; }

        [Required]
        public Guid CountryId { get; set; }
    }
}

