var amqp 		= require('amqp'),
	compare 	= require('./services/compare'),
	constants	= require('./helper/constants');

var QUEUE_NAME = constants.QUEUE_NAME;

var cnn = amqp.createConnection({host:'localhost'});

cnn.on('ready', function(){
	console.log("listening on queues");
	
	/**Compare Service**/
	cnn.queue(QUEUE_NAME.COMPARE, function(q){
		console.log(QUEUE_NAME.COMPARE);
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			compare.execute_request(message, function(res){
				//console.log("Hello World123");
				publishQueue(cnn,m,res);
			});
		});
	});
	
	cnn.queue(QUEUE_NAME.CALCULATE, function(q){
		console.log(QUEUE_NAME.CALCULATE);
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("Message: "+JSON.stringify(message));
			compare.execute_request(message, function(res){
				//console.log("Hello World123");
				publishQueue(cnn,m,res);
			});
		});
	});

	
	
});

function publishQueue(conn,m,response){
	conn.publish(m.replyTo, response, {
		contentType:'application/json',
		contentEncoding:'utf-8',
		correlationId:m.correlationId
	});
}