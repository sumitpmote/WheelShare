using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WheelShare_dotNet.Data;
using WheelShare_dotNet.Helpers;
using WheelShare_dotNet.Services;
using Amazon.S3;
using Amazon.Extensions.NETCore.Setup;

namespace WheelShare_dotNet
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
                ));

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
                        )
                    };
                });

            // ✅ FIXED CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact", policy =>
                {
                    policy
                        .WithOrigins(
                            "http://localhost:5173",
                            "http://localhost:5174"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            builder.Services.AddScoped<JwtHelper>();
            builder.Services.AddScoped<FareHelper>();
            builder.Services.AddScoped<EmailService>();
            builder.Services.AddScoped<AdminSeederService>();
            builder.Services.AddScoped<S3Service>();
            
            // AWS S3 Configuration - uses AWS credentials chain (environment variables, IAM roles, etc.)
            try
            {
                builder.Services.AddAWSService<IAmazonS3>();
            }
            catch
            {
                // AWS not configured - S3Service will fallback to local storage
            }

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Serve static files from uploads directory
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
                RequestPath = "/uploads"
            });

            app.UseCors("AllowReact");   // 🔑 important

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            
            // Seed admin user
            using (var scope = app.Services.CreateScope())
            {
                var adminSeeder = scope.ServiceProvider.GetRequiredService<AdminSeederService>();
                await adminSeeder.SeedAdminUserAsync();
            }
            
            app.Run();
        }
    }
}
