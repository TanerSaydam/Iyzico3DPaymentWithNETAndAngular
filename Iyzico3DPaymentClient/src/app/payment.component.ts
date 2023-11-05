import { Component, OnInit, Sanitizer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SignalRService } from './signal-r.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h1>Payment Component</h1>
  <button (click)="pay()">Pay</button>
  <iframe *ngIf="safeResourceUrl != undefined" width="500" height="500" [src]="safeResourceUrl"></iframe>
  `
})
export class PaymentComponent implements OnInit {  
  safeResourceUrl: SafeResourceUrl | undefined;
  transactionId: string = "";
  callBackData: CallBackData = new CallBackData();
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private signalR: SignalRService
  ){}

  ngOnInit(): void {
    this.signalR.startConnection();
    this.signalR.addPaymentStatusListener((data:any)=> {
      this.callBackData = data;
      console.log(data); 
        if(this.callBackData.status === "success"){
          this.safeResourceUrl = undefined;
        }       
    })
  }

  pay(){
    this.http.get("https://localhost:7121/api/Payments/GetPaymentWith3D")
    .subscribe((res:any)=> {
      this.transactionId = res.conversationId;
      console.log(this.transactionId);
      
      this.signalR.registerTransactionId(res.conversationId);
      const contentHtml = res.content;
      const blob = new Blob([contentHtml], { type: 'text/html' });
      const objectURL = URL.createObjectURL(blob);
      this.safeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);      
    });
  } 
}


export class CallBackData{
  conversationData: string = "";
  conversationId: string = "";
  mdStatus: string = "";
  paymentId: string = "";
  status: string = "";
}
