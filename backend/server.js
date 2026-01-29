require('dotenv').config();
const express = require('express');
const connectDB = require('./lib/connectDB');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(
	cors({
	  origin: [process.env.FRONTEND_URL],
	  credentials: true,
	})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log("Server is running on Port " + PORT);
	// connectDB();
});

app.get('/', (req, res) => {
	res.send('this is root');
});

app.get('/health', (req, res) => {
	res.status(200).send("API is healthy");
});

// auth routes
app.use("/api/auth", require('./routes/auth'));

// aws routes
app.use("/api/aws", require('./routes/aws'));