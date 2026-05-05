using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace RelocateX.Admin.Pages.Admin
{
    public class DashboardModel : PageModel
    {
        private readonly IConfiguration _config;

        public DashboardModel(IConfiguration config)
        {
            _config = config;
        }

        // ── Stats ──
        public int TotalBookings { get; set; }
        public int PendingBookings { get; set; }
        public int ConfirmedBookings { get; set; }
        public int CompletedBookings { get; set; }
        public int CancelledBookings { get; set; }
        public int TotalUsers { get; set; }

        // ── Recent Bookings ──
        public List<BookingRow> RecentBookings { get; set; } = new();

        public IActionResult OnGet()
        {
            // Session check - login nahi hai toh login page pe bhejo
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            LoadDashboardData();
            return Page();
        }

        private void LoadDashboardData()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var con = new SqlConnection(connStr);
            con.Open();

            // ── Total Bookings ──
            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM Bookings", con))
                TotalBookings = (int)cmd.ExecuteScalar();

            // ── Pending ──
            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM Bookings WHERE Status = 'Pending'", con))
                PendingBookings = (int)cmd.ExecuteScalar();

            // ── Confirmed ──
            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM Bookings WHERE Status = 'Confirmed'", con))
                ConfirmedBookings = (int)cmd.ExecuteScalar();

            // ── Completed ──
            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM Bookings WHERE Status = 'Completed'", con))
                CompletedBookings = (int)cmd.ExecuteScalar();

            // ── Cancelled ──
            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM Bookings WHERE Status = 'Cancelled'", con))
                CancelledBookings = (int)cmd.ExecuteScalar();

            // ── Total Users ──
            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM Users", con))
                TotalUsers = (int)cmd.ExecuteScalar();

            // ── Recent 8 Bookings ──
            using var recentCmd = new SqlCommand(@"
                SELECT TOP 8
                    Id, FullName, Phone, City,
                    ShiftDate, HouseSize, Status
                FROM Bookings
                ORDER BY CreatedDate DESC", con);

            using var reader = recentCmd.ExecuteReader();
            while (reader.Read())
            {
                RecentBookings.Add(new BookingRow
                {
                    Id = reader.GetInt32(0),
                    FullName = reader["FullName"]?.ToString(),
                    Phone = reader["Phone"]?.ToString(),
                    City = reader["City"]?.ToString(),
                    ShiftDate = reader["ShiftDate"] as DateTime?,
                    HouseSize = reader["HouseSize"]?.ToString(),
                    Status = reader["Status"]?.ToString() ?? "Pending"
                });
            }
        }

        // Progress bar percentage helper
        public int GetPercent(int value)
        {
            if (TotalBookings == 0) return 0;
            return (int)Math.Round((double)value / TotalBookings * 100);
        }
    }

    // ── Booking Row Model ──
    public class BookingRow
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? City { get; set; }
        public DateTime? ShiftDate { get; set; }
        public string? HouseSize { get; set; }
        public string? Status { get; set; }
    }
}
