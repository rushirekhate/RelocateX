using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace RelocateX.Admin.Pages.Admin
{
    public class BookingsModel : PageModel
    {
        private readonly IConfiguration _config;

        public BookingsModel(IConfiguration config)
        {
            _config = config;
        }

        // ── Data ──
        public List<BookingDetail> Bookings { get; set; } = new();
        public int TotalCount { get; set; }

        // ── Filters ──
        public string? SearchTerm { get; set; }
        public string? StatusFilter { get; set; }
        public string? DateFilter { get; set; }

        // ── GET - Load bookings with filters ──
        public IActionResult OnGet(string? search, string? status, string? shiftDate)
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            SearchTerm = search;
            StatusFilter = status;
            DateFilter = shiftDate;

            LoadBookings();
            return Page();
        }

        // ── POST - Update booking status ──
        public IActionResult OnPostUpdateStatus(int bookingId, string newStatus)
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                using var cmd = new SqlCommand(
                    "UPDATE Bookings SET Status = @status WHERE Id = @id", con);
                cmd.Parameters.AddWithValue("@status", newStatus);
                cmd.Parameters.AddWithValue("@id", bookingId);
                cmd.ExecuteNonQuery();

                TempData["Success"] = $"Booking #{bookingId} status updated to '{newStatus}' successfully!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to update status. Please try again.";
                Console.WriteLine($"UpdateStatus Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── Load bookings from DB with dynamic filters ──
        private void LoadBookings()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var con = new SqlConnection(connStr);
            con.Open();

            // Build dynamic WHERE clause
            var where = new List<string>();
            if (!string.IsNullOrWhiteSpace(SearchTerm))
                where.Add("(FullName LIKE @search OR Phone LIKE @search OR City LIKE @search OR Email LIKE @search)");
            if (!string.IsNullOrWhiteSpace(StatusFilter))
                where.Add("Status = @status");
            if (!string.IsNullOrWhiteSpace(DateFilter))
                where.Add("CAST(ShiftDate AS DATE) = @shiftDate");

            var whereClause = where.Any() ? "WHERE " + string.Join(" AND ", where) : "";

            // Count query
            using (var countCmd = new SqlCommand($"SELECT COUNT(*) FROM Bookings {whereClause}", con))
            {
                if (!string.IsNullOrWhiteSpace(SearchTerm))
                    countCmd.Parameters.AddWithValue("@search", $"%{SearchTerm}%");
                if (!string.IsNullOrWhiteSpace(StatusFilter))
                    countCmd.Parameters.AddWithValue("@status", StatusFilter);
                if (!string.IsNullOrWhiteSpace(DateFilter))
                    countCmd.Parameters.AddWithValue("@shiftDate", DateFilter);

                TotalCount = (int)countCmd.ExecuteScalar();
            }

            // Data query
            var sql = $@"
                SELECT Id, FullName, Phone, Email, City,
                       PickupLocation, DropLocation, ShiftDate,
                       HouseSize, Status, Notes, TotalCharge,
                       CreatedDate
                FROM Bookings
                {whereClause}
                ORDER BY CreatedDate DESC";

            using var cmd = new SqlCommand(sql, con);
            if (!string.IsNullOrWhiteSpace(SearchTerm))
                cmd.Parameters.AddWithValue("@search", $"%{SearchTerm}%");
            if (!string.IsNullOrWhiteSpace(StatusFilter))
                cmd.Parameters.AddWithValue("@status", StatusFilter);
            if (!string.IsNullOrWhiteSpace(DateFilter))
                cmd.Parameters.AddWithValue("@shiftDate", DateFilter);

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                Bookings.Add(new BookingDetail
                {
                    Id = reader.GetInt32(0),
                    FullName = reader["FullName"]?.ToString(),
                    Phone = reader["Phone"]?.ToString(),
                    Email = reader["Email"]?.ToString(),
                    City = reader["City"]?.ToString(),
                    PickupLocation = reader["PickupLocation"]?.ToString(),
                    DropLocation = reader["DropLocation"]?.ToString(),
                    ShiftDate = reader["ShiftDate"] as DateTime?,
                    HouseSize = reader["HouseSize"]?.ToString(),
                    Status = reader["Status"]?.ToString() ?? "Pending",
                    Notes = reader["Notes"]?.ToString(),
                    TotalCharge = reader["TotalCharge"] as decimal?,
                    CreatedDate = reader["CreatedDate"] as DateTime?
                });
            }
        }
    }

    // ── Full Booking Model ──
    public class BookingDetail
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? City { get; set; }
        public string? PickupLocation { get; set; }
        public string? DropLocation { get; set; }
        public DateTime? ShiftDate { get; set; }
        public string? HouseSize { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
        public decimal? TotalCharge { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
