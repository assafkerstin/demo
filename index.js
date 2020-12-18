const http = require("http");
const fs = require("fs");
const express = require("express");

const app = express();

app.get("/", function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  const myReadStream = fs.createReadStream(__dirname + "/input.html", "utf8");
  myReadStream.pipe(res);
});

app.get("/submit", function (req, res) {
  const { amount, buyrate: buyRate, sellrate: sellRate, trg, src } = req.query;
  const targetAmount = parseFloat(amount) / parseFloat(buyRate);

  let response = `Converting ${amount} ${src} to ${targetAmount} ${trg} at exchange rate of ${buyRate}.<br>`;

  const marketRate = (parseFloat(buyRate) + parseFloat(sellRate)) / 2;
  const cost = (parseFloat(buyRate) - parseFloat(marketRate)) * amount;

  response += `Market exchange rate is ${marketRate}.<br> Exchange Difference Cost for this transaction is ${cost} ${src}.`;

  res.send(response);
});

app.listen(3000);

console.log("listening to port 3000");

function SpotTransaction(
  sourceCurrency,
  targetCurrency,
  sourceAmount,
  buyRate,
  sellRate
) {
  this.sourceCurrency = sourceCurrency;
  this.targetCurrency = targetCurrency;
  this.sourceAmount = sourceAmount;
  this.buyRate = buyRate;
  this.sellRate = sellRate;

  //Add function to check if the input is valid
  this.inputValid = function () {
    if (
      this.sourceCurrency != 0 &&
      this.targetCurrency != 0 &&
      this.sourceAmount > 0 &&
      this.buyRate > 0 &&
      this.sellRate > 0
    )
      return true;
    else return false;
  };

  //Calculate The Transaction cost
  this.calcTransactionCost = function () {
    this.rateCost = (this.sourceAmount * (this.buyRate - this.sellRate)) / 2;
    this.info =
      "Transaction: Converting " +
      this.sourceAmount +
      " " +
      this.sourceCurrency +
      " To " +
      this.targetCurrency +
      ".   |Buy Rate: " +
      this.buyRate +
      "|   |SellRate: " +
      this.sellRate +
      "|\n\nCurrency Rate Transaction Cost:";
  };
}

const spot1 = new SpotTransaction("ILS", "USD", 10000, 3.52, 3.56);

if (spot1.inputValid()) console.log(spot1);
else console.log("Invalid Input");

spot1.calcTransactionCost();

console.log(spot1.info);
