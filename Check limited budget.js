//Emailaddress to get the email
var email = "example@company.com";
//An iterator for the subject line of the email
var n = 0;

function main () {
  checkLimitedBudgets();
}

function checkLimitedBudgets() {

//select all accounts with the following conditions
  var accountSelector = MccApp.accounts();
  var accountIterator = accountSelector
  .withCondition('Impressions > 0')
  .withCondition('SearchBudgetLostImpressionShare > 0')
  .forDateRange('LAST_7_DAYS')
  .get();

//iterate through the accounts and add them to the list
    var accountList = "";
  while(accountIterator.hasNext()) {
    var account = accountIterator.next().getName();
    accountList += account + "\n";
    n = n + 1;
  }
  
//if there are limited Campaigns, send this email:  
  if(accountList.length !=0) { 
    
    var subject = "Hey, " + n + " accounts are overspending their budget.";
    var body = "The following accounts have a limited budget:" + "\n" + accountList;
    
    sendEmail(email,subject,body);
  } 
//if there are 0 account limited, send this email:
  else {

    var subject = "Hey, 0 accounts are overspending their budget.";
    var body = "Nice job! None of your accounts are limited by budget.";
    
    sendEmail(email,subject,body)

  }
}

function sendEmail(email,subject,body) {
  Logger.log("Sending email, subject: " + subject + body);
  MailApp.sendEmail(email,subject,body);
}

