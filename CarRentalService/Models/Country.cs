using System;
using System.ComponentModel.DataAnnotations;

namespace CarRentalService.Models
{
	public class Country
	{
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}

