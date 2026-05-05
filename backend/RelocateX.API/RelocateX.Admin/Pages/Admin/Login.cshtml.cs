using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using System.ComponentModel.DataAnnotations;

namespace RelocateX.Admin.Pages.Admin
{
    public class LoginModel : PageModel
    {
        private readonly IConfiguration _config;

        public LoginModel(IConfiguration config)
        {
            _config = config;
        }

        [BindProperty]
        public LoginInput Input { get; set; } = new();

        public string? ErrorMessage { get; set; }

        // GET - sirf page dikhao
        public IActionResult OnGet()
        {
            // Agar already logged in hai toh dashboard pe bhejo
            if (HttpContext.Session.GetString("AdminUser") != null)
                return RedirectToPage("/Admin/Dashboard");

            return Page();
        }

        // POST - login check karo
        public IActionResult OnPost()
        {
            if (!ModelState.IsValid)
                return Page();

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");

                using var con = new SqlConnection(connStr);
                con.Open();

                // AdminUsers table se check karo
                using var cmd = new SqlCommand(
                    "SELECT Id, FullName, Username FROM AdminUsers WHERE Username = @u AND PasswordHash = @p",
                    con);

                cmd.Parameters.AddWithValue("@u", Input.Username.Trim());
                cmd.Parameters.AddWithValue("@p", Input.Password);  // Production mein BCrypt use karo

                using var reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    // Login successful — session set karo
                    HttpContext.Session.SetString("AdminUser", reader["Username"].ToString()!);
                    HttpContext.Session.SetString("AdminName", reader["FullName"]?.ToString() ?? "Admin");
                    HttpContext.Session.SetInt32("AdminId", Convert.ToInt32(reader["Id"]));

                    return RedirectToPage("/Admin/Dashboard");
                }
                else
                {
                    ErrorMessage = "Invalid username or password. Please try again.";
                    return Page();
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = "Something went wrong. Please try again.";
                // Log karo production mein
                Console.WriteLine($"Login Error: {ex.Message}");
                return Page();
            }
        }
    }

    // Input Model with Validation
    public class LoginInput
    {
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }
}
