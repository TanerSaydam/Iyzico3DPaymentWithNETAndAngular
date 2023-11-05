import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection | any;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                           .withUrl('https://localhost:7121/payment-callback')
                           .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err:any) => console.log('Error while starting connection: ' + err));
  }

  public addPaymentStatusListener = (updateStatus:any) => {
    this.hubConnection.on('ReceivePaymentStatus', (status:any) => {
      updateStatus(status);
    });
  }

  public registerTransactionId(transactionId: string) {
    this.hubConnection.invoke('RegisterTransactionId', transactionId)
      .catch((err:any) => console.error('Error while registering transaction ID: ', err));
  }
}
