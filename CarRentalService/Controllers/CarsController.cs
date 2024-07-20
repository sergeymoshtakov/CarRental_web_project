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
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public CarsController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Car>> Get()
        {
            var cars = _context.Cars.Include(c => c.City).ToList();
            return Ok(cars);
        }

        [HttpGet("{id}")]
        public ActionResult<Car> Get(Guid id)
        {
            var car = _context.Cars.Include(c => c.City).FirstOrDefault(x => x.Id == id);
            if (car == null)
            {
                return NotFound();
            }
            return Ok(car);
        }

        [HttpPost]
        public ActionResult<Car> Post([FromBody] CarDto carDto)
        {
            if (carDto == null)
            {
                return BadRequest("Car data is null.");
            }

            var city = _context.Cities.FirstOrDefault(c => c.Id == carDto.CityId);
            if (city == null)
            {
                return BadRequest("City not found.");
            }

            var car = new Car
            {
                Id = Guid.NewGuid(),
                Make = carDto.Make,
                Model = carDto.Model,
                Year = carDto.Year,
                LicensePlate = carDto.LicensePlate,
                PricePerDay = carDto.PricePerDay,
                City = city
            };

            _context.Cars.Add(car);
            _context.SaveChanges();

            return CreatedAtAction(nameof(Get), new { id = car.Id }, car);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] CarDto carDto)
        {
            if (id != carDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            var existingCar = await _context.Cars.Include(c => c.City).FirstOrDefaultAsync(c => c.Id == id);
            if (existingCar == null)
            {
                return NotFound();
            }

            var city = await _context.Cities.FirstOrDefaultAsync(c => c.Id == carDto.CityId);
            if (city == null)
            {
                return BadRequest("City not found.");
            }

            existingCar.Make = carDto.Make;
            existingCar.Model = carDto.Model;
            existingCar.Year = carDto.Year;
            existingCar.LicensePlate = carDto.LicensePlate;
            existingCar.PricePerDay = carDto.PricePerDay;
            existingCar.City = city;

            _context.Entry(existingCar).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var car = _context.Cars.FirstOrDefault(x => x.Id == id);
            if (car == null)
            {
                return NotFound();
            }
            _context.Cars.Remove(car);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
