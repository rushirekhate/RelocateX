using RelocateX.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RelocateX.Infrastructure.Repositories
{
    public class AdminRepository
    {
        private static List<AdminUser> users = new List<AdminUser>
        {
            new AdminUser { Id = 1, Username = "admin", Password = "1234" }
        };

        public AdminUser Validate(string username, string password)
        {
            return users.FirstOrDefault(x => x.Username == username && x.Password == password);
        }
    }
}
