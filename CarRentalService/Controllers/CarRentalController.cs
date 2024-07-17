using System;
using System.Linq;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarRentalService.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
        public async Task<IActionResult> RentCar([FromBody] RentCarRequest request)
        {
            if (!Request.Cookies.ContainsKey("userId"))
            {
                return Unauthorized("User ID not found in cookies");
            }

            var userId = Guid.Parse(Request.Cookies["userId"]);

            var car = await _context.Cars.FindAsync(request.CarId);
            if (car == null)
            {
                return NotFound("Car not found.");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var carRental = new CarRental
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CarId = request.CarId,
                RentalDate = request.RentalDate,
                ReturnDate = request.ReturnDate
            };

            try
            {
                _context.CarRentals.Add(carRental);
                await _context.SaveChangesAsync();
                return Ok(carRental);
            }
            catch (DbUpdateException ex)
            {
                Console.Error.WriteLine(ex.InnerException?.Message ?? ex.Message);
                return StatusCode(500, "Internal server error while saving the rental.");
            }
        }

        [HttpGet("myRentals")]
        public async Task<IActionResult> GetMyRentals()
        {
            if (!Request.Cookies.ContainsKey("userId"))
            {
                return Unauthorized("User ID not found in cookies");
            }

            var userId = Guid.Parse(Request.Cookies["userId"]);
            var rentals = await _context.CarRentals
                .Where(r => r.UserId == userId)
                .Include(r => r.Car)
                .ThenInclude(car => car.City)
                .ThenInclude(city => city.Country)
                .ToListAsync();

            return Ok(rentals);
        }
    }

    public class RentCarRequest
    {
        public Guid CarId { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}
