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
    public class CitiesController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public CitiesController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCities(Guid? countryId)
        {
            IQueryable<City> query = _context.Cities.Include(c => c.Country);

            if (countryId.HasValue)
            {
                query = query.Where(c => c.CountryId == countryId);
            }

            var cities = await query.ToListAsync();
            return Ok(cities);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCity(Guid id)
        {
            var city = await _context.Cities.Include(c => c.Country).FirstOrDefaultAsync(c => c.Id == id);
            if (city == null)
            {
                return NotFound();
            }
            return Ok(city);
        }

        [HttpPost]
        public async Task<IActionResult> PostCity([FromBody] City city)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            city.Id = Guid.NewGuid();
            _context.Cities.Add(city);
            await _context.SaveChangesAsync();

            return Ok(city);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCity(Guid id, [FromBody] City city)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCity = await _context.Cities.FindAsync(id);
            if (existingCity == null)
            {
                return NotFound();
            }

            existingCity.Name = city.Name;
            existingCity.CountryId = city.CountryId;

            await _context.SaveChangesAsync();
            return Ok(existingCity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCity(Guid id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                return NotFound();
            }

            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();
            return Ok(city);
        }
    }
}
