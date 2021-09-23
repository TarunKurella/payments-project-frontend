import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Account } from './account';
import { DemoService } from './demo.service';
import { Transaction } from './Transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'first';
  accounts = new Array<Account>();
 
  public id: string = "";
  account: any;
  public bic: string = "";
  isAccountActive: boolean = false;


  bank: any;
  isBankActive: boolean = false;
  bankAccount: boolean = false;
  public accountHolderName: string = "";
  public accountHolderNumber: string = "";
  notInSdn: boolean = true;
  isAmountOk: boolean = true;

  transferType: string = "";
  amount:number= 0;
  transferFee:number = 0;
  finalBalance:number = 0;

  finalCheck : boolean = false;


  

  public fetchId(){
    if(this.id==""){
      return;
    }
    
     this.demoService.getAccount(this.id).subscribe( (response)=>{
      console.log("before");
       console.log(response);
       console.log("after");
      this.account = response;
      if(response.isBank=="YES"){
        this.bankAccount=true;
        this.transferType= "Bank Internal A/C";
      }else{
        this.bankAccount=false;
        this.transferType= "Customer A/C"
      }
      this.isAccountActive=true;
      this.finalCheck=(((this.isAmountOk&&this.notInSdn)&&this.isAccountActive))&&(this.isBankActive||this.bankAccount);
    },     (error) => {       
      alert(" Customer ID not Found");                    //Error callback
      console.error('error caught in component')});
      this.isAccountActive=false;
    
  }

  public fetchBank(){
    if(this.bic==""){
      return;
    }
    this.demoService.getBank(this.bic).subscribe( (response)=>{
     console.log("before");
      console.log(response);
      console.log("after");
     this.bank = response;
     this.isBankActive=true;
     this.finalCheck=(((this.isAmountOk&&this.notInSdn)&&this.isAccountActive))&&(this.isBankActive||this.bankAccount);
   },     (error) => {       
     alert(" Bank not Found");      
     this.isBankActive=false;          //Error callback
     console.error('error caught in component')});
   
 }

 public checkwithSdn(){
  if(this.accountHolderName==""){
    return;
  }
  this.demoService.checkSdn(this.accountHolderName).subscribe( (response)=>{

   this.notInSdn = !response;
   if(!this.notInSdn){
    alert(" Name FOUND in SDN . TRANSACTION CANNOT BE PROCEEDED FURTHER.");  
   }
   this.finalCheck=(((this.isAmountOk&&this.notInSdn)&&this.isAccountActive))&&(this.isBankActive||this.bankAccount);
 },     (error) => {       
   alert(" Bank not Found");      
   this.isBankActive=false;          //Error callback
   console.error('error caught in component')});
 
}

public postTransaction(Form:NgForm){
  let transaction  = new Transaction(Date.now(),this.id,this.amount,this.accountHolderNumber,this.accountHolderName,this.bic,Form.value.mssgCode);
  console.log(Form);
  this.demoService.addTransaction(transaction).subscribe((response:any)=>{alert(response)})
}


 public calFeeNBal(){
   
 this.transferFee=  (this.amount*0.25);

console.log(this.amount+"  "+this.transferFee+" "+this.account.clearBalance);
 this.finalBalance = this.account.clearBalance-this.amount-this.transferFee;
 if(this.finalBalance<0){
  if(this.account.isOverdraft=="NO"){
    alert("amount Exceeded");
    this.isAmountOk=false;
   
   }
 }else{
  this.isAmountOk=true;
 }

 this.finalCheck=(((this.isAmountOk&&this.notInSdn)&&this.isAccountActive))&&(this.isBankActive||this.bankAccount);
 }
  
  constructor(private demoService:DemoService){
   demoService.getAllAccounts().subscribe( (response: any[])=>{
      this.accounts = response.map( (item) => {
        return new Account(item.customerID,item.name,item.clearBalance,item.isOverdraft,item.isBank)
      });
    });
  }
}
