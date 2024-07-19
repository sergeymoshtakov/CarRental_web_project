using System;
using System.ComponentModel.DataAnnotations;

namespace CarRentalService.Models
{
    public class CarRental
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid UserId { get; set; }
        public User User { get; set; }
        [Required]
        public Guid CarId { get; set; }
        public Car Car { get; set; }
        [Required]
        public DateTime RentalDate { get; set; }
        [Required]
        public DateTime ReturnDate { get; set; }
        [Required]
        public string RentalType { get; set; }  // Changed from enum to string
    }
}
