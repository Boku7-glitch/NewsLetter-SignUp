const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ],
        update_existing: true
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/753c8fa3c4";

    const options = {
        method: "POST",
        auth: "saba1:5f657891fcaa77a5d06e12971f247818-us5",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": jsonData.length
        }
    };

    const request = https.request(url, options, (response) => {
        let responseData = "";

        response.on("data", (chunk) => {
            responseData += chunk;
        });

        response.on("end", () => {
            console.log(JSON.parse(responseData));

            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });

    request.write(jsonData);
    request.end();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});