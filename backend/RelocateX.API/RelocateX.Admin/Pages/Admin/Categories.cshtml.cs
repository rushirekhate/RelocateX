using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace RelocateX.Admin.Pages.Admin
{
    public class CategoriesModel : PageModel
    {
        private readonly IConfiguration _config;

        public CategoriesModel(IConfiguration config)
        {
            _config = config;
        }

        public List<CategoryItem> Categories { get; set; } = new();

        [BindProperty]
        public CategoryItem Category { get; set; } = new();

        public IActionResult OnGet()
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            LoadCategories();
            return Page();
        }

        // ── Add Category ──
        public IActionResult OnPostAdd()
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            if (string.IsNullOrWhiteSpace(Category.Name))
            {
                TempData["Error"] = "Category name is required.";
                return RedirectToPage();
            }

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                using var cmd = new SqlCommand(@"
                    INSERT INTO Categories (Name, Description, IsActive, CreatedAt)
                    VALUES (@name, @desc, 1, GETDATE())", con);

                cmd.Parameters.AddWithValue("@name", Category.Name.Trim());
                cmd.Parameters.AddWithValue("@desc", (object?)Category.Description?.Trim() ?? DBNull.Value);
                cmd.ExecuteNonQuery();

                TempData["Success"] = $"Category '{Category.Name}' added successfully!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to add category. Please try again.";
                Console.WriteLine($"Add Category Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── Edit Category ──
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
                    UPDATE Categories
                    SET Name        = @name,
                        Description = @desc,
                        IsActive    = @active
                    WHERE Id = @id", con);

                cmd.Parameters.AddWithValue("@name", Category.Name ?? "");
                cmd.Parameters.AddWithValue("@desc", (object?)Category.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@active", Category.IsActive);
                cmd.Parameters.AddWithValue("@id", Category.Id);
                cmd.ExecuteNonQuery();

                TempData["Success"] = $"Category '{Category.Name}' updated!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to update category.";
                Console.WriteLine($"Edit Category Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── Delete Category ──
        public IActionResult OnPostDelete(int categoryId)
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                using var cmd = new SqlCommand("DELETE FROM Categories WHERE Id = @id", con);
                cmd.Parameters.AddWithValue("@id", categoryId);
                cmd.ExecuteNonQuery();

                TempData["Success"] = "Category deleted successfully!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Cannot delete category. It may be in use.";
                Console.WriteLine($"Delete Category Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        // ── Toggle Active ──
        public IActionResult OnPostToggleStatus(int categoryId, bool isActive)
        {
            if (HttpContext.Session.GetString("AdminUser") == null)
                return RedirectToPage("/Admin/Login");

            try
            {
                var connStr = _config.GetConnectionString("DefaultConnection");
                using var con = new SqlConnection(connStr);
                con.Open();

                using var cmd = new SqlCommand(
                    "UPDATE Categories SET IsActive = @active WHERE Id = @id", con);
                cmd.Parameters.AddWithValue("@active", isActive);
                cmd.Parameters.AddWithValue("@id", categoryId);
                cmd.ExecuteNonQuery();

                TempData["Success"] = "Category status updated!";
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to update status.";
                Console.WriteLine($"ToggleStatus Error: {ex.Message}");
            }

            return RedirectToPage();
        }

        private void LoadCategories()
        {
            var connStr = _config.GetConnectionString("DefaultConnection");
            using var con = new SqlConnection(connStr);
            con.Open();

            using var cmd = new SqlCommand(@"
                SELECT Id, Name, Description, IsActive, CreatedAt
                FROM Categories
                ORDER BY CreatedAt DESC", con);

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                Categories.Add(new CategoryItem
                {
                    Id = reader.GetInt32(0),
                    Name = reader["Name"]?.ToString(),
                    Description = reader["Description"]?.ToString(),
                    IsActive = reader.GetBoolean(3),
                    CreatedAt = reader["CreatedAt"] as DateTime?
                });
            }
        }
    }

    public class CategoryItem
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? CreatedAt { get; set; }
    }
}