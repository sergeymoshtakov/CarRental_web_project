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

            decimal totalPrice = CalculateRentalPrice(request.RentalDate, request.ReturnDate, car.PricePerDay);

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
                    <li><strong>Rental Date:</strong> {request.RentalDate.ToString("dd.MM.yyyy")}</li>
                    <li><strong>Return Date:</strong> {request.ReturnDate.ToString("dd.MM.yyyy")}</li>
                    <li><strong>Total Price:</strong> ${totalPrice.ToString("0.00")}</li>
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

        private decimal CalculateRentalPrice(DateTime rentalDate, DateTime returnDate, decimal pricePerDay)
        {
            TimeSpan rentalPeriod = returnDate.Date - rentalDate.Date;
            int rentalDays = rentalPeriod.Days;

            decimal totalPrice = rentalDays * pricePerDay;

            return totalPrice;
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
    }

    public class RentCarRequest
    {
        public Guid CarId { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}