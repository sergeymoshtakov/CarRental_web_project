using System;
using System.ComponentModel.DataAnnotations;

namespace CarRentalService.Models
{
	public class User
	{
        public Guid UserId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }
    }
}

