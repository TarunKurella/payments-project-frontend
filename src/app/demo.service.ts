import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from './account';
import { Bank } from './Bank';
import { Transaction } from './Transaction';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  constructor(private http: HttpClient) { }

  url:string="http://localhost:8282/accounts";
  accountUrl:string ="http://localhost:8282/getaccount/";
  bankUrl:string ="http://localhost:8282/getbank/";
  checkSdnUrl:string = "http://localhost:8282/checksdn/";

transactionUrl:string = "http://localhost:8282/transaction/";
  public getAllAccounts(): Observable<Account[]>{
    return this.http.get<Account[]>(this.url);
  }



  public getAccount(id: string): Observable<Account>{
    return this.http.get<Account>(this.accountUrl+id);
  }

  public getBank(bic: string): Observable<Bank>{
    return this.http.get<Bank>(this.bankUrl+bic);
  }

  public checkSdn(name: string): Observable<boolean>{
    return this.http.get<boolean>(this.checkSdnUrl+name);
  }

  addTransaction(transaction:Transaction): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(transaction);
    console.log(body)
    return this.http.post(this.transactionUrl, body,{'headers':headers});
  }

}
