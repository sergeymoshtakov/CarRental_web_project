using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Models;
using CarRentalService.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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

            // Устанавливаем куку с UserId
            Response.Cookies.Append("userId", user.UserId.ToString(), new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None, // Настройте по необходимости
                Secure = true // Настройте по необходимости
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

                // Удаляем куку
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

                if (session != null && session.IsAuthenticated)
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
