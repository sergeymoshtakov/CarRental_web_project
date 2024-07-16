using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarRentalService.Controllers
{
    public class CarRentalController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public CarRentalController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchCars(Guid countryId, Guid cityId)
        {
            var cars = await _context.Cars
                .Where(c => c.City.CountryId == countryId && c.CityId == cityId)
                .Include(c => c.City)
                .ThenInclude(city => city.Country)
                .ToListAsync();

            return Ok(cars);
        }

        [HttpPost("rent")]
        [Authorize]
        public async Task<IActionResult> RentCar(Guid carId, DateTime rentalDate, DateTime returnDate)
        {
            var userId = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value);
            var carRental = new CarRental
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CarId = carId,
                RentalDate = rentalDate,
                ReturnDate = returnDate
            };

            _context.CarRentals.Add(carRental);
            await _context.SaveChangesAsync();

            return Ok(carRental);
        }

        [HttpGet("myRentals")]
        [Authorize]
        public async Task<IActionResult> GetMyRentals()
        {
            var userId = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value);
            var rentals = await _context.CarRentals
                .Where(r => r.UserId == userId)
                .Include(r => r.Car)
                .ThenInclude(car => car.City)
                .ThenInclude(city => city.Country)
                .ToListAsync();

            return Ok(rentals);
        }
    }
}

