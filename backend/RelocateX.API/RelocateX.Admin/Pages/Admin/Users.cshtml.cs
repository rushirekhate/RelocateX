using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace RelocateX.Admin.Pages.Admin
{
    public class UsersModel : PageModel
    {
        private readonly IConfiguration _config;

        public UsersModel(IConfiguration config)
        {
            _config = config;
        }

        public List<UserRow> Users { get; set; } = new();
        public int TotalCount { get; set; }
        public string? SearchTerm { get; set; }

        public IActionResult OnGet(string? search)
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            SearchTerm = search;
            LoadUsers();
            return Page();
        }

        // ── Toggle Block/Unblock ──
        public IActionResult OnPostToggleBlock(int userId, bool isBlocked)
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                using var cmd = new SqlCommand(
                    "UPDATE Users SET IsBlocked = @blocked WHERE Id = @id", con);
                cmd.Parameters.AddWithValue("@blocked", isBlocked);
                cmd.Parameters.AddWithValue("@id", userId);
                cmd.ExecuteNonQuery();

                TempData["Success"] = isBlocked
                    ? $"User #{userId} blocked successfully."
                    : $"User #{userId} unblocked successfully.";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to update user status.";
                Console.WriteLine($"ToggleBlock Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        private void LoadUsers()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var con = new SqlConnection(connStr);
            con.Open();

            var where = string.IsNullOrWhiteSpace(SearchTerm)
                ? ""
                : "WHERE FullName LIKE @search OR Email LIKE @search OR PhoneNumber LIKE @search";

            // Count
            using (var countCmd = new SqlCommand($"SELECT COUNT(*) FROM Users {where}", con))
            {
                if (!string.IsNullOrWhiteSpace(SearchTerm))
                    countCmd.Parameters.AddWithValue("@search", $"%{SearchTerm}%");
                TotalCount = (int)countCmd.ExecuteScalar();
            }

            // Data
            var sql = $@"
                SELECT Id, FullName, Email, PhoneNumber, Role,
                       IsVerified, CreatedAt,
                       ISNULL(IsBlocked, 0) AS IsBlocked
                FROM Users
                {where}
                ORDER BY CreatedAt DESC";

            using var cmd = new SqlCommand(sql, con);
            if (!string.IsNullOrWhiteSpace(SearchTerm))
                cmd.Parameters.AddWithValue("@search", $"%{SearchTerm}%");

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                Users.Add(new UserRow
                {
                    Id = reader.GetInt32(0),
                    FullName = reader["FullName"]?.ToString(),
                    Email = reader["Email"]?.ToString(),
                    Phone = reader["PhoneNumber"]?.ToString(),
                    Role = reader["Role"]?.ToString() ?? "User",
                    IsVerified = Convert.ToBoolean(reader["IsVerified"]),
                    IsBlocked = Convert.ToBoolean(reader["IsBlocked"]),
                    CreatedAt = reader["CreatedAt"] as DateTime?
                });
            }
        }
    }

    public class UserRow
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Role { get; set; }
        public bool IsVerified { get; set; }
        public bool IsBlocked { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
