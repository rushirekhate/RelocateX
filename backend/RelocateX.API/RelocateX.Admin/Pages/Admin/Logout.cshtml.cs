using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RelocateX.Admin.Pages.Admin
{
    public class LogoutModel : PageModel
    {
        public IActionResult OnGet()
        {
            // Session clear karo - sab kuch hatao
            HttpContext.Session.Clear();
            return RedirectToPage("/Admin/Login");
        }
    }
}
