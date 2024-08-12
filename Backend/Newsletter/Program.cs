using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Supabase;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddAuthentication(auth =>
{
    auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    { 
        ValidateIssuer = true,
        ValidIssuer = "https://localhost:3000",
        ValidateAudience = true,
        ValidAudience = "http://localhost:3000",
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT_Token"])),
        RoleClaimType = "roles"
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("WriteAccess", policy => policy.RequireRole("ADMIN", "WRITER"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<Supabase.Client>(_ =>
new Supabase.Client(
    builder.Configuration["SupabaseUrl"],
    builder.Configuration["SupabaseKey"],
    new SupabaseOptions
    {
        AutoConnectRealtime = true,
        AutoRefreshToken = true,
    }));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
