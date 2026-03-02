using RelocateX.Application.DTOs;
using RelocateX.Application.Interfaces;
using RelocateX.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RelocateX.Infrastructure.Services
{
    public class BookingService : IBookingService
    {
        private readonly BookingRepository _repository;

        public BookingService(BookingRepository repository)
        {
            _repository = repository;
        }

        public void CreateBooking(CreateBookingDto dto)
        {
            // Future business logic can go here
            _repository.CreateBooking(dto);
        }
    }
}
