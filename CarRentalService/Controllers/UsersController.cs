using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Models;
using Microsoft.AspNetCore.Mvc;

namespace CarRentalService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : Controller
    {
        private readonly ApplicationDBContext _context;
        public UsersController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            return _context.Users.ToList();
        }

        [HttpGet("{id}")]
        public IActionResult Get(Guid id)
        {
            var user = _context.Users.FirstOrDefault(x => x.UserId == id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public IActionResult Post(User user)
        {
            user.UserId = Guid.NewGuid();
            user.Role = "user";
            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(user);
        }

        [HttpPut("{id}")]
        public IActionResult Put(Guid id, [FromBody] User user)
        {
            var existingUser = _context.Users.FirstOrDefault(x => x.UserId == id);
            if (existingUser == null)
            {
                return NotFound();
            }
            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            existingUser.Phone = user.Phone;
            existingUser.Role = user.Role;
            existingUser.Password = user.Password;

            _context.SaveChanges();
            return Ok(existingUser);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var user = _context.Users.FirstOrDefault(x => x.UserId == id);
            if (user == null)
            {
                return NotFound();
            }
            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok(user);
        }
    }
}
