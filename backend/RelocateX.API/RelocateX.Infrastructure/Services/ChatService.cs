using OpenAI;
using OpenAI.Chat;
using Microsoft.Extensions.Configuration;
using RelocateX.Application.Interfaces;
using RelocateX.Domain.Entities;

namespace RelocateX.Infrastructure.Services
{
    public class ChatService : IChatService
    {
        private readonly IConfiguration _config;

        public ChatService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<String> GetAnswer(string question)
        {
            var apiKey = _config["OpenAI:ApiKey"];

            var client = new OpenAIClient(apiKey);

            var chat = new ChatClient(model: "gpt-4o-mini", apiKey);

            var response = await chat.CompleteChatAsync(question);

            return response.Value.Content[0].Text;
        }
    }
}