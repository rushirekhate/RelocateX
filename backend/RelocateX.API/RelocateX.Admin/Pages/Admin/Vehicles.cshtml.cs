using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace RelocateX.Admin.Pages.Admin
{
    public class VehiclesModel : PageModel
    {
        private readonly IConfiguration _config;

        public VehiclesModel(IConfiguration config)
        {
            _config = config;
        }

        // ── Data ──
        public List<VehicleItem> Vehicles { get; set; } = new();

        [BindProperty]
        public VehicleItem Vehicle { get; set; } = new();

        // ── GET ──
        public IActionResult OnGet()
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            LoadVehicles();
            return Page();
        }

        // ── POST: Add Vehicle ──
        public IActionResult OnPostAdd()
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                using var cmd = new SqlCommand(@"
                    INSERT INTO Vehicles (Name, Description, Capacity, IsActive)
                    VALUES (@name, @desc, @cap, 1)", con);

                cmd.Parameters.AddWithValue("@name", Vehicle.Name ?? "");
                cmd.Parameters.AddWithValue("@desc", (object?)Vehicle.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@cap", Vehicle.Capacity ?? "");

                cmd.ExecuteNonQuery();
                TempData["Success"] = $"Vehicle '{Vehicle.Name}' added successfully!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to add vehicle. Please try again.";
                Console.WriteLine($"Add Vehicle Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── POST: Edit Vehicle ──
        public IActionResult OnPostEdit()
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                using var cmd = new SqlCommand(@"
                    UPDATE Vehicles
                    SET Name        = @name,
                        Description = @desc,
                        Capacity    = @cap,
                        IsActive    = @active
                    WHERE Id = @id", con);

                cmd.Parameters.AddWithValue("@name", Vehicle.Name ?? "");
                cmd.Parameters.AddWithValue("@desc", (object?)Vehicle.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@cap", Vehicle.Capacity ?? "");
                cmd.Parameters.AddWithValue("@active", Vehicle.IsActive);
                cmd.Parameters.AddWithValue("@id", Vehicle.Id);

                cmd.ExecuteNonQuery();
                TempData["Success"] = $"Vehicle '{Vehicle.Name}' updated successfully!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to update vehicle. Please try again.";
                Console.WriteLine($"Edit Vehicle Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── POST: Toggle Active/Inactive ──
        public IActionResult OnPostToggleStatus(int vehicleId, bool isActive)
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                using var cmd = new SqlCommand(
                    "UPDATE Vehicles SET IsActive = @active WHERE Id = @id", con);
                cmd.Parameters.AddWithValue("@active", isActive);
                cmd.Parameters.AddWithValue("@id", vehicleId);
                cmd.ExecuteNonQuery();

                TempData["Success"] = $"Vehicle status updated successfully!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to update status.";
                Console.WriteLine($"ToggleStatus Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── POST: Delete Vehicle ──
        public IActionResult OnPostDelete(int vehicleId)
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                // VehiclePricing cascade delete hoga (FK ON DELETE CASCADE set hai)
                using var cmd = new SqlCommand(
                    "DELETE FROM Vehicles WHERE Id = @id", con);
                cmd.Parameters.AddWithValue("@id", vehicleId);
                cmd.ExecuteNonQuery();

                TempData["Success"] = "Vehicle deleted successfully!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Cannot delete vehicle. It may have bookings linked to it.";
                Console.WriteLine($"Delete Vehicle Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── Load all vehicles ──
        private void LoadVehicles()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var con = new SqlConnection(connStr);
            con.Open();

            using var cmd = new SqlCommand(@"
                SELECT Id, Name, Description, Capacity, IsActive, CreatedAt
                FROM Vehicles
                ORDER BY CreatedAt DESC", con);

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                Vehicles.Add(new VehicleItem
                {
                    Id = reader.GetInt32(0),
                    Name = reader["Name"]?.ToString(),
                    Description = reader["Description"]?.ToString(),
                    Capacity = reader["Capacity"]?.ToString(),
                    IsActive = reader.GetBoolean(4),
                    CreatedAt = reader["CreatedAt"] as DateTime?
                });
            }
        }
    }

    // ── Vehicle Model ──
    public class VehicleItem
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Capacity { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? CreatedAt { get; set; }
    }
}
