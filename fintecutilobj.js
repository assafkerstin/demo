var http=require("http");
var fs=require("fs");
var express=require("express");

var app = express();

app.get("/", function(req, res){
    res.writeHead(200,{"Content-Type":"text/html"});
    var myReadStream = fs.createReadStream(__dirname + "/input.html" , "utf8");
    myReadStream.pipe(res);
});

app.get("/submit", function(req, res){
    var amount=parseFloat(req.query.amount);
    var buyRate=parseFloat(req.query.buyrate);
    var sellRate=parseFloat(req.query.sellrate);
    var targetAmount=(amount/buyRate);
    var trg=req.query.trg;
    var src=req.query.src;
    var response = "Converting " + amount + " " + src ;
    response += " To " + targetAmount + " " + trg ;
    response += " at exchange rate of " + buyRate + ".<br>";
    var marketRate=(buyRate + sellRate)/2;
    response += "Market exchange rate is " + marketRate + ".<br>";
    var cost=(buyRate-marketRate)*amount;
    response += "Exchange Difference Cost for this transaction is " + cost + " " + src + ".";
    //console.log(response);
  res.send(response);
});

//var server = http.createServer(function(req, res){
//  res.writeHead(200,{"Content-Type":"text/html"});
//  var myReadStream = fs.createReadStream(__dirname + "/input.html" , "utf8");
//  myReadStream.pipe(res);
//});

//server.listen(3000,"127.0.0.1");
app.listen(3000);
console.log("listening to port 3000");

function SpotTransaction(sourceCurrency,targetCurrency,sourceAmount,buyRate,sellRate){
    this.sourceCurrency=sourceCurrency;
    this.targetCurrency=targetCurrency;
    this.sourceAmount=sourceAmount;
    this.buyRate=buyRate;
    this.sellRate=sellRate;

    //Add function to check if the input is valid
    this.inputValid = function(){
      if ((this.sourceCurrency!=0)&&(this.targetCurrency!=0)&&(this.sourceAmount>0)&&(this.buyRate>0)&&(this.sellRate>0))
        return true;
      else return false;
    };

    //Calculate The Transaction cost
    this.calcTransactionCost=function(){
      this.rateCost = this.sourceAmount * (this.buyRate-this.sellRate)/2 ;
      this.info = "Transaction: Converting " + this.sourceAmount + " " + this.sourceCurrency +
      " To " + this.targetCurrency + ".   |Buy Rate: " + this.buyRate + "|   |SellRate: " + this.sellRate +
      "|\n\nCurrency Rate Transaction Cost:"
    };
};

var spot1 = new SpotTransaction("ILS","USD",10000,3.52,3.56);

if(spot1.inputValid()) console.log(spot1);
else console.log("Invalid Input");

spot1.calcTransactionCost();

console.log(spot1.info);

//console.log(spot1.inputValid());
