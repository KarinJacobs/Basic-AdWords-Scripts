var timeZone = AdWordsApp.currentAccount().getTimeZone();
var now = new Date();
var from = new Date(now.getTime() - (60 * 1000 * 60 * 60 * 24));
var to = new Date(now.getTime());
var DATEFROM = Utilities.formatDate(from, timeZone, 'yyyyMMdd')
var DATETO = Utilities.formatDate(to, timeZone, 'yyyyMMdd')
var DATE_RANGE = DATEFROM + ", " + DATETO;

//Edit to your goal CPA
var GOAL_CPA = '15';

function main() {
    adjustKeywordBids(0, 3, 0, (GOAL_CPA - 2, 5) * 1000000, 0, 0.85, 1.1);
    adjustKeywordBids(3, 20, 0, (GOAL_CPA - 2, 5) * 1000000, 0, 1, 1.1);
    adjustKeywordBids(0, 3, (GOAL_CPA - 2, 5) * 1000000, (GOAL_CPA + 2, 5) * 1000000, 0, 0.85, 1.05);
    adjustKeywordBids(3, 20, (GOAL_CPA - 2, 5) * 1000000, (GOAL_CPA + 2, 5) * 1000000, 0.85, 1, 1.05);
    adjustKeywordBids(0, 3, (GOAL_CPA + 2, 5) * 1000000, 100000000, 0, 1, 0.9);
    adjustKeywordBids(3, 20, (GOAL_CPA + 2, 5) * 1000000, 100000000, 0.85, 1, 0.9);
    pauseKeywords(0, 0, 500, 3, 20, (GOAL_CPA + 2, 5) * 1000000, 100000000, 0, 0.85);
    pauseKeywords(25, -1, 1, 0, 20, 0, 100000000, 0, 1);
    sendMail();
}

//Adjust keyword bids based on average position, CPA and impression share
function adjustKeywordBids(minAP, maxAP, minCPA, maxCPA, minSIS, maxSIS, bidAdjustment) {
    var keywords = AdWordsApp.keywords()
        .withCondition('Status = ENABLED')
        .withCondition('AdGroupStatus = ENABLED')
        .withCondition('Conversions > 0')
        .withCondition('AveragePosition > ' + minAP)
        .withCondition('AveragePosition < ' + maxAP)
        .withCondition('CostPerConversion > ' + minCPA)
        .withCondition('CostPerConversion < ' + maxCPA)
        .withCondition('SearchImpressionShare > ' + minSIS)
        .withCondition('SearchImpressionShare < ' + maxSIS)
        .forDateRange(DATE_RANGE)
        .get();
  
  Logger.log("CPC"+keywords);

    while (keywords.hasNext()) {
        var keyword = keywords.next();
        var cpc = keyword.bidding().getCpc();
        keyword.bidding().setCpc(cpc * bidAdjustment);
    }
}

//Pause keywords based on average position, CPA and impression share
function pauseKeywords(costs, minConversions, maxConversions, minAP, maxAP, minCPA, maxCPA, minSIS, maxSIS) {
    var keywords = AdWordsApp.keywords()
        .withCondition('Status = ENABLED')
        .withCondition('AdGroupStatus = ENABLED')
        .withCondition('CampaignStatus = ENABLED')
        .withCondition('Conversions > ' + minConversions)
        .withCondition('Conversions < ' + maxConversions)
        .withCondition('AveragePosition > ' + minAP)
        .withCondition('AveragePosition < ' + maxAP)
        .withCondition('CostPerConversion > ' + minCPA)
        .withCondition('CostPerConversion < ' + maxCPA)
        .withCondition('SearchImpressionShare > ' + minSIS)
        .withCondition('SearchImpressionShare < ' + maxSIS)
        .withCondition('Cost >' + costs)
        .forDateRange(DATE_RANGE)
        .get();
  
  Logger.log("PAUSE"+keywords);

    while (keywords.hasNext()) {
        var keyword = keywords.next();
        keyword.pause();
    }
}

//Send mail when the script has run
// Insert your own emailadres below
function sendMail() {
    MailApp.sendEmail("example@company.com", "Keyword Bidding Script", "The keyword bidding script is executed for account " + AdWordsApp.currentAccount().getName());
}