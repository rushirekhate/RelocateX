using Microsoft.AspNetCore.Mvc;
using RelocateX.Application.Interfaces;

namespace RelocateX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Question))
                return BadRequest("Question is required");

            var answer = await _chatService.GetAnswer(request.Question);

            return Ok(new { answer });
        }
    }

    public class ChatRequest
    {
        public string Question { get; set; }
    }
}
