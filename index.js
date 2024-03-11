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

const spoonacularAPI = axios.create({
	baseURL: 'https://api.spoonacular.com/recipes'
});

spoonacularAPI.interceptors.request.use(config => {
	config.headers['x-api-key'] = process.env.SPOONACULAR_CLIENT_ID;
	return config;
},
	error => Promise.reject(error)
);

spoonacularAPI.interceptors.response.use(response => response.data,
	error => Promise.reject(error)
);

app.get('/spoonacular/searchRecipe', async (req, res) => {
	try {
		const data = await spoonacularAPI.get('/complexSearch', { params: req.query });
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
})

app.get('/spoonacular/getRecipe', async (req, res) => {
	if (req.query.id === undefined || req.query.includeNutrition === undefined) {
		res.status(401).send('Not enough params');
		return;
	}

	try {
		const data = await spoonacularAPI.get(`/${req.query.id}/information?includeNutrition=${req.query.includeNutrition}`, { params: req.query });
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
})

app.get('/spoonacular/getRecipeTaste', async (req, res) => {
	if (req.query.id === undefined || req.query.normalize === undefined) {
		res.status(401).send('Not enough params');
		return;
	}

	try {
		const data = await spoonacularAPI.get(`/${req.query.id}/tasteWidget.json`, { params: req.query });
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
})

app.get('/spoonacular/randomRecipe', async (req, res) => {
	// if (number === undefined) {
	// 	res.status(401).send('Not enough params');
	// 	return;
	// }
	// limitLicense = undefined,
	// include_tags = undefined,
	// exclude_tags = undefined,

	try {
		const data = await spoonacularAPI.get('/random', { params: req.query });
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
})

app.listen(process.env.PORT, () => console.log(`Listening on http://localhost:${process.env.PORT}`));
