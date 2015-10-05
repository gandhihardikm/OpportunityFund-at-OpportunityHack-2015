var	constants = require('../helper/constants');
var	mq_client = require('../rpc/client');

var QUEUE_NAME = constants.QUEUE_NAME;


module.exports = function(req,res){
	//console.log(req);
	console.log("Compare function");
	if(req.body == ""){
		res.status(400).json({
			status : 400,
			message : constants.RES_MSG[400]
		});
	}else{

		var requested_loan = req.body.requested_loan;
		var downpayment_percent	= req.body.downpayment_percent;
		var months = req.body.months;
		var interest_rate = req.body.interest_rate;
		var frequency = req.body.frequency;
		
		
		var msg_payload = {
			operation : "compare",
			message : {
				requested_loan : requested_loan,
				downpayment_percent : downpayment_percent,
				months : months,
				years : years,
				frequency : frequency
			}
		};
		console.log(QUEUE_NAME.COMPARE);
		mq_client.make_request(QUEUE_NAME.COMPARE,msg_payload, function(err,results){
			if(err){
				res.status(err.status).json(err);
			}
			else 
			{
				res.status(200).json({
					status : 200,
					message : constants.RES_MSG[200]
				});
			}  
		});
	}
};