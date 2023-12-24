const express = require('express');
const bodyParser = require('body-parser');
const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, PutCommand, ScanCommand} = require("@aws-sdk/lib-dynamodb");

const app = express();
const port = 3000;
const path = require('path');


// DynamoDB Client Setup
const dynamoDBClient = new DynamoDBClient({region: "us-west-2"}); // Replace with your region
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

const fs = require('fs');
const readline = require('readline');


// Middleware to parse the body of POST requests and to serve static files
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function getRandomName(fileName) {
    try {
        const fileStream = fs.createReadStream(fileName);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const names = [];
        for await (const line of rl) {
            // Split the line by comma and trim whitespace from each name
            const lineNames = line.split(',').map(name => name.trim());
            names.push(...lineNames); // Spread operator to add individual names
        }
        // Remove empty strings (names with only whitespace)
        const filteredNames = names.filter(name => name.trim() !== '');

        if (filteredNames.length === 0) {
            throw new Error('No valid names found in the file.');
        }

        return filteredNames[Math.floor(Math.random() * filteredNames.length)];
    } catch (err) {
        console.error(`Error reading from ${fileName}:`, err.message);
        return ''; // Return an empty string or any default value
    }
}

// Route to display items and a form for adding new items
app.get('/', async (req, res) => {
    try {
        const data = await dynamoDB.send(new ScanCommand({TableName: "matt-table"}));
        const randomFirstName = await getRandomName('public/data/firstNames.csv');
        const randomLastName = await getRandomName('public/data/lastNames.csv');
        res.render('index', {
            data: data,
            randomFirstName: randomFirstName,
            randomLastName: randomLastName
        });
    } catch (err) {
        console.error("Error fetching data from DynamoDB:", err);
        res.render('index', {
            data: null,
            randomFirstName: '',
            randomLastName: ''
        });
    }
});

// Route to handle form submission
app.post('/submit', async (req, res) => {
    const newItem = {
        id: req.body.id,
        first: req.body.first,
        last: req.body.last,
        age: parseInt(req.body.age)
    };

    try {
        await dynamoDB.send(new PutCommand({
            TableName: "matt-table",
            Item: newItem
        }));
        res.redirect('/');
    } catch (err) {
        res.status(500).send(`Error adding item: ${err.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

