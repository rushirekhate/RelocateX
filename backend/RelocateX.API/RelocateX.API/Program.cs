using RelocateX.Application.Interfaces;
using RelocateX.Infrastructure.Repositories;
using RelocateX.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// --------------------
// Add services to container
// --------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --------------------
// CORS for React (Vite runs on 5173)
// --------------------

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// --------------------
// Dependency Injection
// --------------------

builder.Services.AddScoped<BookingRepository>();
builder.Services.AddScoped<IBookingService, BookingService>();

var app = builder.Build();

// --------------------
// Configure HTTP pipeline
// --------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();