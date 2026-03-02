using Microsoft.AspNetCore.Mvc;
using RelocateX.Application.DTOs;
using RelocateX.Application.Interfaces;

namespace RelocateX.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _service;

        public BookingController(IBookingService service)
        {
            _service = service;
        }

        [HttpPost("create")]
        public IActionResult CreateBooking([FromBody] CreateBookingDto dto)
        {
            _service.CreateBooking(dto);
            return Ok(new { message = "Booking Created Successfully" });
        }
    }
}
