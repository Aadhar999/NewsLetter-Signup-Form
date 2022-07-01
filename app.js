const express = require('express');
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing"); // 
const AccountExportApi = require('@mailchimp/mailchimp_marketing/src/api/AccountExportApi');

mailchimp.setConfig({
  apiKey: "f03214ef2242170b76bbb7b49d784d6b-us17",
  server: "us17",
});


const listId = "6921f954eb";

 

app.use(express.static("public")); // for serving static folder containing css and image files.

app.use(express.urlencoded({extended: true}));

app.get('/',function(req,res) {
    res.sendFile(__dirname + '/signup.html');
});



app.post('/',function(req,res) {
    // console.log(req.body);
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    // console.log(fname,lname,email);

    // seting up mailchimp 

    // we put all this in try-catch block so that if there is any failure we can catch the error and send response accordingly..

    async function run() {
        try{                      
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: fname,
            LNAME: lname
          }
        });

        console.log(
            `Successfully added contact as an audience member. The contact's id is ${
              response.status
            }.`
          );

        // res.send("You have subscribed successfully.");
        // sending sucess.html file instead

        res.sendFile(__dirname + '/success.html');

        }
        catch (err) {
            console.log(err); // also we can set different response to send according to different error codes we get in error.
            // res.send("You have not subscribed successfully.");
            // sending failure.html file instead
            res.sendFile(__dirname + '/failure.html');

        }

        }
        
        run();


});


app.post('/failure',function(req,res) {
    res.redirect('/'); // will redirect to server root page when posted to /failure route.
});


app.listen(3000,function (){
    console.log('Server Started at port 3000');
});

                        // how to serve up local files like css and image files  -------


// In order for our server to serve up static files/local files such as CSS and images, then we need to use a special function of Express, and that's something called static.
// So we need to say app.use(express.static), and inside the parentheses we're going to add the name
// of a folder that we're going to keep as our static folder,
// and I'm going to call it public.
// So now, inside my Newsletter-Signup, I'm going to create a new folder called public, and inside this folder
// I'm going to add a new folder called css, and I'm going to place my styles.css inside there.
// Now I'm also going to drag my images so that it's also inside our public folder.
// And now I have all of my static files in one place under a particular folder name.
// So imagining that we're currently inside the public folder, in order to get to our style sheet,
// we have to go to the css/styles.css.if we have made a folder css inside otherwise if put just inside public folder then it is exact same no difference in relative file path.Now for images also, it’s exactly the same, inside the images folder.



                            // How to setup mailchimp API used above-----

// first we need to install npm module "npm install @mailchimp/mailchimp_marketing".

// after that we will require it by ---

// const mailchimp = require("@mailchimp/mailchimp_marketing"); 

/*

now we will configure our mailchimp with our api-key and server-prefix that we can get by logging to our mailchimp Account
and server-prefix is actually last four digit of api-key itself. so set it up like ---

mailchimp.setConfig({
    apiKey: "f03214ef2242170b76bbb7b49d784d6b-us17",
    server: "us17",
  });

  now after setting it up we can get list_id from the account itself by default when we craeted a mailchimp account it automatically created a main list whose id we can get their. If we want we can create a new list as well. list is audience that means list of all the contacts subscribed to a particular event . we may have different event's so we can create different audience/list for each event u can read it in documentation its super easy documentation is in bookmark.
  but for now we wont be craeting a new list or event we only want to add contacts that fill the form to our list. for this also i have used documentation and used told methods if u want u can read again by going their.
 
const listId = "6921f954eb";

    // seting up mailchimp making a sync fucntion run
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: email, // pass email getted from "form"
          status: "subscribed", // that means it will set contact as subscribed.
          merge_fields: {
            FNAME: fname,  // pass first name
            LNAME: lname    // pass last name
          }
        });

        console.log(
            `Successfully added contact as an audience member. The contact's id is ${
              response.id // will return the added contact id if successfully added.
            }.`
          );
        }
        
        run();   // calling the function.

we will pass data {email , fname and lname} getted from form to this and it will add that contact to our list.

*/

