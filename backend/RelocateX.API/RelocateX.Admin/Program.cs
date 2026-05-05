// Program.cs - Apne existing Program.cs mein yeh changes karo

var builder = WebApplication.CreateBuilder(args);

// Razor Pages add karo
builder.Services.AddRazorPages();

// Session add karo (login ke liye zaroori)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // 30 min mein logout
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Session middleware - UseRouting ke baad, UseAuthorization se pehle
app.UseSession();

app.UseAuthorization();

app.MapRazorPages();

// Default route - Login page pe bhejo
app.MapGet("/", context =>
{
    context.Response.Redirect("/Admin/Login");
    return Task.CompletedTask;
});

app.Run();
