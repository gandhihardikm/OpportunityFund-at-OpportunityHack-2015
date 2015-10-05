var	constants = require('../helper/constants');
var	mq_client = require('../rpc/client');

var QUEUE_NAME = constants.QUEUE_NAME;


module.exports = function(req,res){
	console.log("Calculate : " + req);
	
	if(req.body == ""){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{
		console.log("else");
		var loan_use = req.body.loan_use;
		var requested_loan = req.body.requested_loan;
		var downpayment_percent	= req.body.downpayment_percent;
		var months = req.body.months;
		var frequency = req.body.frequency;
		var interest_rate = req.body.interest_rate;
		var loan_fee = req.body.loan_fee;
		
		
		var msg_payload = {
			operation : "calculate",
			message : {
				loan_use : loan_use,
				requested_loan : requested_loan,
				downpayment_percent : downpayment_percent,
				months : months,
				frequency : frequency,
				interest_rate : interest_rate,
				loan_fee : loan_fee
				
			}
		};
		console.log(QUEUE_NAME.CALCULATE);
		mq_client.make_request(QUEUE_NAME.CALCULATE,msg_payload, function(err,results){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				console.log(results.message);
				res.status(200).json({
					status : 200,
					message : results.message
				});
			}  
		});
	}
};