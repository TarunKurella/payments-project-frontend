export class Transaction{
    constructor(public transDateTime :number, public fromAccount :string, public amount:number,public toAccount:string,public toName:string,public bic:string,public mssgCode:string,){}
}