using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Helpers;
using CarRentalService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CarRentalService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CarRentalController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly EmailSettings _emailSettings;

        public CarRentalController(ApplicationDBContext context, IOptions<EmailSettings> emailSettings)
        {
            _context = context;
            _emailSettings = emailSettings.Value;
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

            if (request.RentalDate < DateTime.Now)
            {
                return BadRequest("Rental date cannot be in the past.");
            }

            if (request.ReturnDate <= request.RentalDate)
            {
                return BadRequest("Return date must be after the rental date.");
            }

            decimal totalPrice = CalculateRentalPrice(request.RentalDate, request.ReturnDate, car.PricePerDay, request.RentalType);

            var carRental = new CarRental
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CarId = request.CarId,
                RentalDate = request.RentalDate,
                ReturnDate = request.ReturnDate,
                RentalType = request.RentalType
            };

            try
            {
                _context.CarRentals.Add(carRental);
                await _context.SaveChangesAsync();

                var city = await _context.Cities
                    .Where(c => c.Id == car.CityId)
                    .FirstOrDefaultAsync();

                var country = await _context.Countries
                    .Where(c => c.Id == city.CountryId)
                    .FirstOrDefaultAsync();

                string htmlBody = $@"
        <html>
        <body>
            <p>Dear {user.Name},</p>
            <p>You have successfully rented a car.</p>
            <p><strong>Rental Details:</strong></p>
            <ul>
                <li><strong>Car:</strong> {car.Make} {car.Model}</li>
                <li><strong>Place:</strong> {city.Name}, {country.Name}</li>
                <li><strong>Rental Date:</strong> {request.RentalDate:dd.MM.yyyy HH:mm}</li>
                <li><strong>Return Date:</strong> {request.ReturnDate:dd.MM.yyyy HH:mm}</li>
                <li><strong>Total Price:</strong> ${totalPrice:0.00}</li>
            </ul>
        </body>
        </html>";

                await SendEmail(user.Email, "Car Rental Confirmation", htmlBody);

                return Ok(carRental);
            }
            catch (DbUpdateException ex)
            {
                Console.Error.WriteLine(ex.InnerException?.Message ?? ex.Message);
                return StatusCode(500, "Internal server error while saving the rental.");
            }
        }

        private decimal CalculateRentalPrice(DateTime rentalDate, DateTime returnDate, decimal pricePerDay, string rentalType)
        {
            TimeSpan rentalPeriod = returnDate - rentalDate;
            decimal totalPrice = 0;

            switch (rentalType)
            {
                case "Daily":
                    int rentalDays = rentalPeriod.Days;
                    totalPrice = rentalDays * pricePerDay;
                    break;
                case "Hourly":
                    decimal pricePerHour = pricePerDay / 24;
                    totalPrice = (decimal)rentalPeriod.TotalHours * pricePerHour;
                    break;
                case "ByMinute":
                    decimal pricePerMinute = pricePerDay / (24 * 60);
                    totalPrice = (decimal)rentalPeriod.TotalMinutes * pricePerMinute;
                    break;
                default:
                    throw new ArgumentException("Invalid rental type");
            }

            return totalPrice;
        }

        [HttpGet("myRentals")]
        public async Task<IActionResult> GetMyRentals([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            if (!Request.Cookies.ContainsKey("userId"))
            {
                return Unauthorized("User ID not found in cookies");
            }

            var userId = Guid.Parse(Request.Cookies["userId"]);
            var totalRentals = await _context.CarRentals.CountAsync(r => r.UserId == userId);
            var totalPages = (int)Math.Ceiling((double)totalRentals / size);

            var rentals = await _context.CarRentals
                .Where(r => r.UserId == userId)
                .Include(r => r.Car)
                .ThenInclude(car => car.City)
                .ThenInclude(city => city.Country)
                .OrderBy(r => r.RentalDate)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            var result = new
            {
                items = rentals,
                totalPages
            };

            return Ok(result);
        }

        private async Task SendEmail(string toEmail, string subject, string body)
        {
            try
            {
                MailAddress from = new MailAddress(_emailSettings.FromAddress, _emailSettings.FromName);
                MailAddress to = new MailAddress(toEmail);
                MailMessage m = new MailMessage(from, to)
                {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                SmtpClient smtp = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort)
                {
                    Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword),
                    EnableSsl = true
                };
                await smtp.SendMailAsync(m);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Failed to send email. Error message: {ex.Message}");
            }
        }

        [HttpGet]
        public IEnumerable<CarRental> Get()
        {
            return _context.CarRentals.ToList();
        }

        [HttpPost]
        public IActionResult Post(CarRental carRental)
        {
            carRental.Id = Guid.NewGuid();
            _context.CarRentals.Add(carRental);
            _context.SaveChanges();
            return Ok(carRental);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            CarRental carRental = _context.CarRentals.FirstOrDefault(x => x.Id == new Guid(id));
            if (carRental == null)
            {
                return NotFound();
            }
            _context.CarRentals.Remove(carRental);
            _context.SaveChanges();
            return Ok(carRental);
        }

        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> CancelRental(Guid id)
        {
            if (!Request.Cookies.ContainsKey("userId"))
            {
                return Unauthorized("User ID not found in cookies");
            }

            var userId = Guid.Parse(Request.Cookies["userId"]);
            var rental = await _context.CarRentals
                .Include(r => r.Car)
                .ThenInclude(car => car.City)
                .ThenInclude(city => city.Country)
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (rental == null)
            {
                return NotFound("Rental not found or you do not have permission to cancel it.");
            }

            _context.CarRentals.Remove(rental);

            try
            {
                await _context.SaveChangesAsync();

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                string htmlBody = $@"
            <html>
            <body>
                <p>Dear {user.Name},</p>
                <p>Your car rental has been successfully cancelled.</p>
                <p><strong>Rental Details:</strong></p>
                <ul>
                    <li><strong>Car:</strong> {rental.Car.Make} {rental.Car.Model}</li>
                    <li><strong>Place:</strong> {rental.Car.City.Name}, {rental.Car.City.Country.Name}</li>
                    <li><strong>Rental Date:</strong> {rental.RentalDate:dd.MM.yyyy HH:mm}</li>
                    <li><strong>Return Date:</strong> {rental.ReturnDate:dd.MM.yyyy HH:mm}</li>
                </ul>
            </body>
            </html>";

                await SendEmail(user.Email, "Car Rental Cancellation", htmlBody);

                return Ok("Rental cancelled successfully.");
            }
            catch (DbUpdateException ex)
            {
                Console.Error.WriteLine(ex.InnerException?.Message ?? ex.Message);
                return StatusCode(500, "Internal server error while canceling the rental.");
            }
        }

        [HttpGet("userStatistics")]
        public async Task<IActionResult> GetUserStatistics()
        {
            if (!Request.Cookies.ContainsKey("userId"))
            {
                return Unauthorized("User ID not found in cookies");
            }

            var userId = Guid.Parse(Request.Cookies["userId"]);

            var rentals = await _context.CarRentals
                .Include(r => r.Car)
                .ThenInclude(car => car.City)
                .ThenInclude(city => city.Country)
                .Where(r => r.UserId == userId)
                .ToListAsync();

            var totalSpent = rentals.Sum(r => CalculateRentalPrice(r.RentalDate, r.ReturnDate, r.Car.PricePerDay, r.RentalType));
            var uniqueCarsRented = rentals.Select(r => r.CarId).Distinct().Count();
            var totalDaysRented = rentals.Sum(r => (r.ReturnDate - r.RentalDate).Days);
            var totalHoursRented = rentals.Sum(r => (r.ReturnDate - r.RentalDate).TotalHours);

            var rentalsByCity = rentals
                .GroupBy(r => r.Car.City.Name)
                .ToDictionary(g => g.Key, g => g.Count());

            var rentalsByCar = rentals
                .GroupBy(r => r.Car.Make + " " + r.Car.Model)
                .ToDictionary(g => g.Key, g => g.Count());

            var moneyByCity = rentals
                .GroupBy(r => r.Car.City.Name)
                .ToDictionary(g => g.Key, g => g.Sum(r => CalculateRentalPrice(r.RentalDate, r.ReturnDate, r.Car.PricePerDay, r.RentalType)));

            var moneyByCar = rentals
                .GroupBy(r => r.Car.Make + " " + r.Car.Model)
                .ToDictionary(g => g.Key, g => g.Sum(r => CalculateRentalPrice(r.RentalDate, r.ReturnDate, r.Car.PricePerDay, r.RentalType)));

            var timeByCity = rentals
                .GroupBy(r => r.Car.City.Name)
                .ToDictionary(g => g.Key, g => g.Sum(r => (r.ReturnDate - r.RentalDate).TotalHours));

            var timeByCar = rentals
                .GroupBy(r => r.Car.Make + " " + r.Car.Model)
                .ToDictionary(g => g.Key, g => g.Sum(r => (r.ReturnDate - r.RentalDate).TotalHours));

            var statistics = new
            {
                totalSpent,
                uniqueCarsRented,
                totalDaysRented,
                totalHoursRented,
                rentalsByCity,
                rentalsByCar,
                moneyByCity,
                moneyByCar,
                timeByCity,
                timeByCar
            };

            return Ok(statistics);
        }

    }

    public class RentCarRequest
    {
        public Guid CarId { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public string RentalType { get; set; } 
    }

}