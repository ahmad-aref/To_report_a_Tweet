const express = require('express');
const Twitter = require('twit');
var request = require("request");
var qs = require("querystring");
var moment = require('moment');
var app = express();
app.set('view enging','ejs')
var fs = require('fs'),
    path = require('path')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(express.static('./public'))
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://test:test@ds153958.mlab.com:53958/todoahmad', { useNewUrlParser: true })
function log(item){
   return console.log(item);
}

var Accounts = new Schema({
   access_token:{
     type: String

  },
    access_token_secret:{
     type: String

  },
    userName:{
     type: String

  },
    userProfile:{
     type: String

  }
});

var AccountsReported = new Schema({
    accountName:{
        type:String
    },
    check:{
       type:String 
    }
})
module.exports = mongoose.model('accountsReported', AccountsReported);
var accountsReported = mongoose.model('accountsReported');

module.exports = mongoose.model('accounts', Accounts);
var account = mongoose.model('accounts');


test()


function test(){
	
var requestTokenUrl = "https://api.twitter.com/oauth/request_token";
var CONSUMER_KEY;
var CONSUMER_SECRET ;
	CONSUMER_KEY = "your CONSUMER_KEY ";//like jPY9PU5lvw********
	CONSUMER_SECRET = "your CONSUMER_SECRET ";
	
var oauth = {
  callback : "http://localhost:5000/signin-with-twitter",
  consumer_key  : CONSUMER_KEY,
  consumer_secret : CONSUMER_SECRET
}

var oauthToken = "";
var oauthTokenSecret = "";
	
app.get('/', function (req, res) {
	request.post({url : requestTokenUrl, oauth : oauth}, function (e, r, body){
    //Parsing the Query String containing the oauth_token and oauth_secret.
    var reqData = qs.parse(body);
    oauthToken = reqData.oauth_token;
    oauthTokenSecret = reqData.oauth_token_secret;		
    var url = 'https://api.twitter.com/oauth/authenticate'
    + '?' + qs.stringify({oauth_token: oauthToken})	
res.render('index.ejs',{url:url}) 		 
	})
  });



app.get("/signin-with-twitter", function(req, res){
var CONSUMER_KEY;
var CONSUMER_SECRET;
CONSUMER_KEY = "your CONSUMER_KEY";
CONSUMER_SECRET = "your CONSUMER_SECRET";
	
var oauth = {
  callback : "http://localhost:5000/signin-with-twitter",
  consumer_key  : CONSUMER_KEY,
  consumer_secret : CONSUMER_SECRET
}

var authReqData = req.query;
oauth.token = authReqData.oauth_token;
oauth.token_secret = oauthTokenSecret;
oauth.verifier = authReqData.oauth_verifier;

var accessTokenUrl = "https://api.twitter.com/oauth/access_token";
request.post({url : accessTokenUrl , oauth : oauth}, function(e, r, body){
var authenticatedData = qs.parse(body);
var oauth_token = authenticatedData.oauth_token
var oauth_token_secret = authenticatedData.oauth_token_secret
var userName = authenticatedData.screen_name ;
var userProfile = `twitter.com/${authenticatedData.screen_name}`;



	


var new_user =  {
    access_token: oauth_token.replace(/"/g,""),
    access_token_secret:oauth_token_secret.replace(/"/g,""),
    userName:userName,
    userProfile:userProfile
    };
    
    
    
            
		account.create(new_user, function(err, res) {
    if (err) throw err;
    log("1 document inserted");
log(res)
  });
	
    

    
    
    
    
})
	res.redirect('/')
});
}

/************************************************* GET POST ******************************************************************/


app.post('/report',urlencodedParser,function(req,res){
    log(req.body)
    
    var check = req.body.check;
    var name = req.body.name;
    
    var new_accountsReported = {
        accountName:name,
        check:check
    }
    if(check == '0'){
        
        
        account.find({}, function(err, users) {

for(var i = 0 ;i<users.length;i++){
var config = {
"consumer_key": "your CONSUMER_KEY",
"consumer_secret": "your consumer_secret",
"access_token": users[i].access_token,
"access_token_secret": users[i].access_token_secret
}

log(config)
var T = new Twitter(config)
T.post('users/report_spam',{screen_name:name,perform_block:false},function(err,response){
log("report_spam done")
log(err)
})
}
});
        log('0 test')
accountsReported.create(new_accountsReported, function(err, res) {
    if (err) throw err;
    log("1 document inserted");
  });
        
    }
    else if(check == '1'){
account.find({}, function(err, users) {

    for(var i = 0 ;i<users.length;i++){
        var config = {
            "consumer_key": "your consumer_key",
            "consumer_secret": "your consumer_secret",
            "access_token": users[i].access_token,
            "access_token_secret": users[i].access_token_secret
        }

        log(config)
        var T = new Twitter(config)
        T.post('users/report_spam',{screen_name:name,perform_block:true},function(err,response){
            log("blocks and report_spam done")
            log(err)
        })
    }
});
        log('1 test ')     
		accountsReported.create(new_accountsReported, function(err, res) {
    if (err) throw err;
    log("1 document inserted");
  });
        
    }else{
        log("error")
    }  
})


app.get('/history',function(req,res){
     accountsReported.find({},function(err, result) {
    if (err) throw err;
   res.render('history.ejs',{accounts:result})
  });
    
})


app.get('/manageAccounts',function(req,res){
         account.find({},function(err, result) {
    if (err) throw err;
   res.render('manageAccounts.ejs',{accounts:result})
  });
})

app.post('/delete',urlencodedParser,function(req,res){
    console.log(req.body.id)
    account.deleteOne({_id:req.body.id}, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
        res.end()
  });
    
})

app.post('/Clean',function(req,res){
    accountsReported.find({},function(err, result) {
    if (err) throw err;
result.forEach(function(element) {
      accountsReported.deleteOne({_id:element._id}, function(err, obj) {
    if (err) throw err;     
  });
});
        res.end()
  }); 
})
/************************************************* GET POST ******************************************************************/
	
  account.find({},function(err, result) {
    if (err) throw err;
   //log(result);
  });
/*


*/
































app.listen(process.env.PORT || 5000);
log("app runnneg")
