using RelocateX.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RelocateX.Application.Interfaces
{
    public interface IBookingService
    {

        void CreateBooking(CreateBookingDto dto);
    }
}
