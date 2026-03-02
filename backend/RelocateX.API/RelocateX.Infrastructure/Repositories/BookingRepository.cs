using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using RelocateX.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RelocateX.Infrastructure.Repositories
{
    public class BookingRepository
    {
        private readonly IConfiguration _configuration;

        public BookingRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void CreateBooking(CreateBookingDto dto)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using SqlConnection con = new SqlConnection(connectionString);

            using SqlCommand cmd = new SqlCommand("sp_CreateBooking", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@FullName", dto.FullName);
            cmd.Parameters.AddWithValue("@Phone", dto.Phone);
            cmd.Parameters.AddWithValue("@Email", dto.Email);
            cmd.Parameters.AddWithValue("@City", dto.City);
            cmd.Parameters.AddWithValue("@PickupLocation", dto.PickupLocation);
            cmd.Parameters.AddWithValue("@DropLocation", dto.DropLocation);
            cmd.Parameters.AddWithValue("@ShiftDate", dto.ShiftDate);
            cmd.Parameters.AddWithValue("@HouseSize", dto.HouseSize);

            con.Open();
            cmd.ExecuteNonQuery();
        }
    }
}
