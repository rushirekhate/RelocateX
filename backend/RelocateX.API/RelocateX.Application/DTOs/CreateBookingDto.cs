using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RelocateX.Application.DTOs
{
    public class CreateBookingDto
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? City { get; set; }
        public string? PickupLocation { get; set; }
        public string? DropLocation { get; set; }
        public DateTime ShiftDate { get; set; }
        public string? HouseSize { get; set; }
    }
}
