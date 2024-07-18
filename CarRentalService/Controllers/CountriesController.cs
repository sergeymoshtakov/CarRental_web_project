using System;
using System.Collections.Generic;
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
    public class CountriesController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public CountriesController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCountries()
        {
            var countries = await _context.Countries.ToListAsync();
            return Ok(countries);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCountry(Guid id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound();
            }
            return Ok(country);
        }

        [HttpPost]
        public IActionResult Post(Country country)
        {
            country.Id = Guid.NewGuid();
            _context.Countries.Add(country);
            _context.SaveChanges();
            return Ok(country);
        }

        [HttpPut("{id}")]
        public IActionResult Put(Guid id, [FromBody] Country country)
        {
            var existingCountry = _context.Countries.FirstOrDefault(x => x.Id == id);
            if (existingCountry == null)
            {
                return NotFound();
            }
            existingCountry.Name = country.Name;

            _context.SaveChanges();
            return Ok(existingCountry);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var country = _context.Countries.FirstOrDefault(x => x.Id == id);
            if (country == null)
            {
                return NotFound();
            }
            _context.Countries.Remove(country);
            _context.SaveChanges();
            return Ok(country);
        }
    }
}
