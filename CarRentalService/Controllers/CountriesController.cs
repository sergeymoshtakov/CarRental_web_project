﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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

        [HttpPost]
        public IActionResult Post(Country country)
        {
            country.Id = Guid.NewGuid();
            _context.Countries.Add(country);
            _context.SaveChanges();
            return Ok(country);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            Country country = _context.Countries.FirstOrDefault(x => x.Id == new Guid(id));
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

