using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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
        public async Task<IActionResult> GetCities(Guid countryId)
        {
            var cities = await _context.Cities
                .Where(c => c.CountryId == countryId)
                .ToListAsync();
            return Ok(cities);
        }

        [HttpGet]
        public IEnumerable<City> Get()
        {
            return _context.Cities.ToList();
        }

        [HttpPost]
        public IActionResult Post(City city)
        {
            city.Id = Guid.NewGuid();
            _context.Cities.Add(city);
            _context.SaveChanges();
            return Ok(city);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            City city = _context.Cities.FirstOrDefault(x => x.Id == new Guid(id));
            if (city == null)
            {
                return NotFound();
            }
            _context.Cities.Remove(city);
            _context.SaveChanges();
            return Ok(city);
        }
    }
}

