using System;
using System.Linq;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Models;
using CarRentalService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace CarRentalService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IUserSessionService _userSessionService;

        public AccountController(ApplicationDBContext context, IUserSessionService userSessionService)
        {
            _context = context;
            _userSessionService = userSessionService;
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
    }
}
