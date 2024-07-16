using System;
using CarRentalService.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRentalService.Data
{
	public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<CarRental> CarRentals { get; set; }
    }
}

