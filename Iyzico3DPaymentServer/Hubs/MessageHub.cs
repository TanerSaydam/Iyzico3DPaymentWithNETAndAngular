using Iyzico3DPaymentServer.Controllers;
using Microsoft.AspNetCore.SignalR;

namespace Iyzico3DPaymentServer.Hubs;

public sealed class MessageHub : Hub
{
    public async Task SendPaymentStatus(CallbackData data)
    {
        await Clients.All.SendAsync("ReceivePaymentStatus", data);
    }
}