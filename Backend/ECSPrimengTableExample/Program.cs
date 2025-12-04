using Data.PrimengTableReusableComponent;
using ECSPrimengTableExample.Interfaces;
using ECSPrimengTableExample.Repository;
using ECSPrimengTableExample.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.SwaggerDoc("v1", new OpenApiInfo {
        Title = "PrimeNG table reusable component",
        Version = "1.0",
        Description = "This is the demo API to show how to use the PrimeNG table reusable component.",
        Contact = new OpenApiContact {
            Name = "Eternal CODE Studio",
            Email = "eternalcodestudio@gmail.com"
        }
    });
    options.EnableAnnotations();
});

#region CONFIGURE DB CONTEXT
builder.Services.AddDbContext<primengTableReusableComponentContext>(
    options => {
        options.UseSqlServer(builder.Configuration.GetConnectionString("DB_primengtablereusablecomponent"));
    }
);
#endregion
#region INJECT SERVICES
builder.Services.AddScoped<ITestService, TestService>();
builder.Services.AddScoped<ITestRepository, TestRepository>();
#endregion
builder.Services.AddCors();
WebApplication app = builder.Build();
app.UseCors(
    options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
);
// Configure the HTTP request pipeline.
if(app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
await app.RunAsync();