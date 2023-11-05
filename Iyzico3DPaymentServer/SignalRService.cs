using Iyzico3DPaymentServer.Controllers;
using Iyzico3DPaymentServer.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Iyzico3DPaymentServer;

public sealed class SignalRService
{
    private readonly IHubContext<MessageHub> _hubContext;

    public SignalRService(IHubContext<MessageHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendPaymentStatus(string transactionId, CallbackData data)
    {
        await _hubContext.Clients.Client(MessageHub.TransactionConnections[data.ConversationId]).SendAsync("ReceivePaymentStatus", data);
    }
}