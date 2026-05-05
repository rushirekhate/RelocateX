using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace RelocateX.Admin.Pages.Admin
{
    public class PricingModel : PageModel
    {
        private readonly IConfiguration _config;

        public PricingModel(IConfiguration config)
        {
            _config = config;
        }

        public List<PricingRow> PricingRules { get; set; } = new();
        public List<VehicleDropdown> Vehicles { get; set; } = new();

        [BindProperty]
        public PricingRow Pricing { get; set; } = new();

        public IActionResult OnGet()
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            LoadVehicles();
            LoadPricing();
            return Page();
        }

        // ── Add Pricing Rule ──
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
                    INSERT INTO VehiclePricing (VehicleId, MinKm, MaxKm, PerKmCharge, BaseCharge, IsActive)
                    VALUES (@vid, @minKm, @maxKm, @price, @base, 1)", con);

                cmd.Parameters.AddWithValue("@vid", Pricing.VehicleId);
                cmd.Parameters.AddWithValue("@minKm", Pricing.MinKm);
                cmd.Parameters.AddWithValue("@maxKm", (object?)Pricing.MaxKm ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@price", Pricing.PricePerKm);
                cmd.Parameters.AddWithValue("@base", Pricing.BaseCharge);
                cmd.ExecuteNonQuery();

                TempData["Success"] = "Pricing rule added successfully!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to add pricing rule.";
                Console.WriteLine($"Add Pricing Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── Edit Pricing Rule ──
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
                    UPDATE VehiclePricing
                    SET VehicleId   = @vid,
                        MinKm       = @minKm,
                        MaxKm       = @maxKm,
                        PerKmCharge = @price,
                        BaseCharge  = @base,
                        IsActive    = @active
                    WHERE Id = @id", con);

                cmd.Parameters.AddWithValue("@vid", Pricing.VehicleId);
                cmd.Parameters.AddWithValue("@minKm", Pricing.MinKm);
                cmd.Parameters.AddWithValue("@maxKm", (object?)Pricing.MaxKm ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@price", Pricing.PricePerKm);
                cmd.Parameters.AddWithValue("@base", Pricing.BaseCharge);
                cmd.Parameters.AddWithValue("@active", Pricing.IsActive);
                cmd.Parameters.AddWithValue("@id", Pricing.Id);
                cmd.ExecuteNonQuery();

                TempData["Success"] = "Pricing rule updated!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to update pricing rule.";
                Console.WriteLine($"Edit Pricing Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── Delete ──
        public IActionResult OnPostDelete(int pricingId)
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                using var cmd = new SqlCommand("DELETE FROM VehiclePricing WHERE Id = @id", con);
                cmd.Parameters.AddWithValue("@id", pricingId);
                cmd.ExecuteNonQuery();

                TempData["Success"] = "Pricing rule deleted!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to delete pricing rule.";
                Console.WriteLine($"Delete Pricing Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        private void LoadVehicles()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var con = new SqlConnection(connStr);
            con.Open();

            using var cmd = new SqlCommand("SELECT Id, Name FROM Vehicles WHERE IsActive = 1 ORDER BY Name", con);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                Vehicles.Add(new VehicleDropdown
                {
                    Id = reader.GetInt32(0),
                    Name = reader["Name"]?.ToString() ?? ""
                });
            }
        }

        private void LoadPricing()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var con = new SqlConnection(connStr);
            con.Open();

            using var cmd = new SqlCommand(@"
                SELECT vp.Id, vp.VehicleId, v.Name AS VehicleName,
                       vp.MinKm, vp.MaxKm, vp.PerKmCharge, vp.BaseCharge, vp.IsActive
                FROM VehiclePricing vp
                INNER JOIN Vehicles v ON v.Id = vp.VehicleId
                ORDER BY v.Name, vp.MinKm", con);

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                PricingRules.Add(new PricingRow
                {
                    Id = reader.GetInt32(0),
                    VehicleId = reader.GetInt32(1),
                    VehicleName = reader["VehicleName"]?.ToString(),
                    MinKm = reader.GetInt32(3),
                    MaxKm = reader["MaxKm"] as int?,
                    PricePerKm = Convert.ToDecimal(reader["PerKmCharge"]),
                    BaseCharge = Convert.ToDecimal(reader["BaseCharge"]),
                    IsActive = reader.GetBoolean(7)
                });
            }
        }
    }

    public class PricingRow
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public string? VehicleName { get; set; }
        public int MinKm { get; set; }
        public int? MaxKm { get; set; }       // null = unlimited (above X km)
        public decimal PricePerKm { get; set; }
        public decimal BaseCharge { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class VehicleDropdown
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
    }
}
