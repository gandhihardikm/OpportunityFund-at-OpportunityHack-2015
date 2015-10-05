var constants = require('../helper/constants');
var finance = require('node-finance');
/**Compare**/
function compare(msg,callback){
	
//	var queryParam = {
//			requested_loan		: msg.requested_loan,
//			downpayment_percent	: msg.downpayment_percent,
//			months		: msg.months,
//			years		: msg.years,
//			frequency	: msg.frequency
//
//	};
	
	
//	
	callback({status : 200,message : constants.RES_MSG[200]});
/*
	mysql.query("UPDATE ?? SET ? WHERE ?? = ?",['person',queryParam,'person_id',msg.person_id],function(err,response) {
		if (err) {
			console.log("Error while perfoming query !!!");
			callback({status : 500,message : constants.RES_MSG[500]});
		} else{
			callback({status : 200,message : constants.RES_MSG[200]});
		}
	});
	*/
}


function calculate(msg,callback){
  // console.log(msg.requested_loan);
   
   var loan_amount = msg.requested_loan;
   var down_percent = msg.downpayment_percent;
   var loan_type= msg.loan_use;
   var frequency = msg.frequency;
   var months = msg.months;
   var loan_fee = msg.loan_fee;
   var interest_rate = msg.interest_rate;
   
   //var first_slab = require('./app').FIRST_SLAB;
   var total_downpayment = (down_percent/100)*loan_amount;
   
   var cash_needed = loan_amount - total_downpayment;   
   console.log("loan_fee"+loan_fee);
   var amount_financed = parseInt(cash_needed)+parseInt(loan_fee);
   console.log("Total_downpayment :"+total_downpayment+"cash needed:"+cash_needed);
   console.log("Amount financed : "+ amount_financed);
   
   
   var payment;
   rate = interest_rate/100;
   //console.log(frequency.localeCompare("monthly"));
   if(!frequency.localeCompare("monthly"))
   {
	  // console.log("monthly");
       payment = PMT(rate/12,months,amount_financed*-1);
   }
   else if(frequency.localeCompare("bi-weekly"))
   {
       payment = PMT(rate/26,months/12*26,amount_financed*-1);
   }
   else{
       payment = PMT(rate/52,months/12*52,amount_financed*-1);
   }
   console.log("Interest rate:"+interest_rate+"months:"+months);
   console.log(payment);
  // var pay = finance.CUMIPMT(interest_rate/12,months,amount_financed,1,months,0);
   //console.log(pay);
   
   var total_payment_loan = PMT(rate/12,months,amount_financed*-1) * months;
   console.log("total_payment_loan: " + total_payment_loan);
    //var total_interest = CUMIPMT(interest_rate/12,months,amount_financed,1,months,0)*-1;
    //console.log("Total_interest: " + total_interest);
    var total_interest = total_payment_loan - amount_financed;
    var res = {};
    res.total_downpayment = total_downpayment;
    res.amount_financed = amount_financed;
    res.frequency = frequency;
    res.payment_frequency = payment; 
    res.total_interest = total_interest;
    res.total_payment = total_payment_loan;
    res.apr = rate*100;	
    callback({status : 200,message : res}); 
}




//function CUMIPMT(rate, periods, value, start, end, type) {
//	console.log("reached here");
//	  // Credits: algorithm inspired by Apache OpenOffice
//	  // Credits: Hannes Stiebitzhofer for the translations of function and variable names
//	  // Requires getFutureValue() and getPartialPayment() from Formula.js [http://stoic.com/formula/]
//
//	  // Evaluate rate and periods (TODO: replace with secure expression evaluator)
//	  rate = eval(rate);
//	  periods = eval(periods);
//
//	  // Return error if either rate, periods, or value are lower than or equal to zero
//	 // if (rate <= 0 || periods <= 0 || value <= 0) return '#NUM!';
//
//	  // Return error if start < 1, end < 1, or start > end
//	  //if (start < 1 || end < 1 || start > end) return '#NUM!';
//
//	  // Return error if type is neither 0 nor 1
//	 // if (type !== 0 && type !== 1) return '#NUM!';
//
//	  // Compute cumulative interest
//	  var payment = getPartialPayment(rate, periods, value, 0, type);
//	  var interest = 0;
//	  interest = 0;
//	  if(start === 1) {
//	    if(type === 0) {
//	      interest = -value;
//	      start++;
//	    }
//	  }
//	  for (var i = start; i <= end; i++) {
//	    if (type === 1) {
//	      interest += getFutureValue(rate, i - 2, payment, value, 1 ) - payment;
//	    } else {
//	      interest += getFutureValue(rate, i - 1, payment, value, 0 );
//	    }
//	  }
//	  interest *= rate;
//
//	  // Return cumulative interest
//	  console.log("Interest: " + interest);
//	  return interest;
//}

function PMT(ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
	
	//console.log("reached pmt");
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0)
        return -(pv + fv)/np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * pv * (pvif + fv) / (pvif - 1);

    if (type === 1)
        pmt /= (1 + ir);
    console.log("pMT AMOUTN : " + pmt);
    return pmt;
}



/**
 * execute request handling
 */
exports.execute_request = function(req,callback){
	//'use strict';
	console.log(req);
	var operation = req.operation;
	var message = req.message;

	switch(operation){

	case "compare" : 
		compare(message,callback);
		break;
		
	case "calculate":
		calculate(message,callback);
		break;
		
	default : 
		callback({status : 400,message : constants.RES_MSG[400]});
	}
};

