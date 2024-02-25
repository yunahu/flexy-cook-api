require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors())
app.use(express.json());

app.post('/todoist_token', async (req, res) => {
	try {
		const code = req.body.code;
		const response = await axios.post(`https://todoist.com/oauth/access_token?client_id=${process.env.TODOIST_CLIENT_ID}&client_secret=${process.env.TODOIST_CLIENT_SECRET}&code=${code}`);
		
		res.send(response.data.access_token);
	} catch (err) {
		console.error(err.message);
	}
});

app.listen(process.env.PORT, () => console.log(`Listening on http://localhost:${process.env.PORT}`));
