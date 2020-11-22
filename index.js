const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extented: true}));

app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function (req,res) {

const fname= req.body.firstName
const lname= req.body.lastName;
const email= req.body.email;

const url="https://us7.api.mailchimp.com/3.0/lists/fa85fa2f7a";

var data={
  members: [{
    email_address:email,
    status:"subscribed",
    merge_fields: {
      LNAME: lname,
      FNAME: fname
    }
  }]
};

var jsonData = JSON.stringify(data);
const options = {method:"POST", auth:"anonymous:e4a226b3e7d687f9458b501319c9232c-us7"}

const request=https.request(url,options, function(response)
{
  response.on("data",function(data)
{
  console.log(JSON.parse(data));
});

if(response.statusCode==200)
{
  res.sendFile(__dirname+"/success.html");
}

else {
  res.sendFile(__dirname+"/failure.html");
}

});

request.write(jsonData);
request.end();



});


app.listen(process.env.PORT || 3000, function(){
  console.log("listening");
})
