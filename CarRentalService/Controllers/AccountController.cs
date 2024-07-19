using System;
using System.Linq;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Models;
using CarRentalService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using CarRentalService.Helpers;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace CarRentalService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IUserSessionService _userSessionService;
        private readonly EmailSettings _emailSettings;


        public AccountController(ApplicationDBContext context, IUserSessionService userSessionService, IOptions<EmailSettings> emailSettings)
        {
            _context = context;
            _userSessionService = userSessionService;
            _emailSettings = emailSettings.Value;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_context.Users.Any(u => u.Email == user.Email))
            {
                return BadRequest("User with this email already exists.");
            }

            user.UserId = Guid.NewGuid();
            user.Role = "user";
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            string htmlBody = $@"
            <html>
            <body>
                <p>Dear {user.Name},</p>
                <p>Welcome to our premier car rental service. Discover our extensive range of vehicles and enjoy a smooth and hassle-free rental experience.</p>
            </body>
            </html>";

            await SendEmail(user.Email, "Welcome to Car Rental Service!", htmlBody);

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var user = _context.Users.SingleOrDefault(u => u.Email == loginModel.Email && u.Password == loginModel.Password);

            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            var session = new UserSession { UserId = user.UserId, IsAuthenticated = true };
            _userSessionService.SetUserSession(session);

            Response.Cookies.Append("userId", user.UserId.ToString(), new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });

            return Ok();
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            if (HttpContext.Request.Cookies.ContainsKey("userId"))
            {
                var userId = Guid.Parse(HttpContext.Request.Cookies["userId"]);
                _userSessionService.ClearUserSession(userId);

                Response.Cookies.Delete("userId");
            }

            return Ok();
        }

        [HttpGet("isAuthenticated")]
        public IActionResult IsAuthenticated()
        {
            try
            {
                var userId = Guid.Parse(HttpContext.Request.Cookies["userId"]);
                var session = _userSessionService.GetUserSession(userId);

                return Ok(session != null && session.IsAuthenticated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("isAdmin")]
        public IActionResult IsAdmin()
        {
            try
            {
                var userId = Guid.Parse(HttpContext.Request.Cookies["userId"]);
                var session = _userSessionService.GetUserSession(userId);
                var user = _context.Users.Where(u => u.UserId == userId).FirstOrDefault();

                if (user != null && user.Role == "admin")
                {
                    return Ok(session != null && session.IsAuthenticated);
                }
                else
                {
                    return StatusCode(StatusCodes.Status403Forbidden, "User is not an admin");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
    }
}
