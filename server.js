var path = require('path');
var exphbs = require('express-handlebars');
var express = require('express');
var app = express();
var data = require('./data');
var mongoClient = require("mongodb").MongoClient;
var mongoHost = "classmongo.engr.oregonstate.edu";
var mongoPort = 27017;
var mongoUsername = "cs290_matsumon";
var mongoPassword = "cs290_matsumon";
var mongoDBName = "cs290_matsumon";
var mongoURL = "mongodb://" + mongoUsername + ":" + mongoPassword + "@" + 
mongoHost + ":" + mongoPort + "/" + mongoDBName;
var mongoDB = null;
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.set('port', (process.env.PORT || 3434));
app.post('/:personId/person',function(req,res)
		{
		console.log("made it into Post",req.params.personId);
		var collection = mongoDB.collection(req.params.personId);
		collection.insertOne(req.body);


		});
app.get('/:personId', function (req, res) {
	if(req.url ==="/favicon.ico")
{
res.end();
}
else
{
	console.log("req",req.url);
	var cursor = mongoDB.collection(req.params.personId).find(
		req.params.personId);
	var post;
	cursor.toArray(function(err,docs)
		{
			if(err)
	{
		alert("mongo no work");
	}
		else
	{
		console.log(" in else docs",docs);

	res.status(200).render('index',{post:docs});
		post = docs;
	}
			});
	context = {post};

	console.log("GET",post);

//	res.status(200).render('index',post);
}
});
//res.status(200).render('index', collection);
//});

app.get('*', function (req, res) {
	res.status(200).render('404');
});

app.listen(app.get('port'), function(){
	mongoClient.connect(mongoURL,function(err,client)
		{
			if(err)
	{
		throw err;
	}
			else
	{
		mongoDB = client.db(mongoDBName);
		console.log("mongo and server connected. port 3434");
	}
		});	
});
