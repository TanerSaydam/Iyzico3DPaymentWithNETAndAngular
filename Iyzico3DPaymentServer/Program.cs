using Iyzico3DPaymentServer;
using Iyzico3DPaymentServer.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(configure =>
{
    configure
    .AddDefaultPolicy(
        policy =>
            policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(policy => true));
});

builder.Services.AddScoped<SignalRService>();

builder.Services.AddSignalR();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<MessageHub>("/payment-callback");

app.Run();