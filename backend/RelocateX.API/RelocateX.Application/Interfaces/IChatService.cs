using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RelocateX.Domain.Entities;

namespace RelocateX.Application.Interfaces
{
    public interface IChatService
    {
        Task<string> GetAnswer(string question);
    }
}
