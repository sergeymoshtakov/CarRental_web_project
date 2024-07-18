using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRentalService.Data;
using CarRentalService.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarRentalService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CarsController : Controller
    {
        private readonly ApplicationDBContext _context;
        public CarsController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Car> Get()
        {
            return _context.Cars.ToList();
        }

        [HttpPost]
        public IActionResult Post(Car car)
        {
            car.Id = Guid.NewGuid();
            _context.Cars.Add(car);
            _context.SaveChanges();
            return Ok(car);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            Car car = _context.Cars.FirstOrDefault(x => x.Id == new Guid(id));
            if (car == null)
            {
                return NotFound();
            }
            _context.Cars.Remove(car);
            _context.SaveChanges();
            return Ok(car);
        }
    }
}

