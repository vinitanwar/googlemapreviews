// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

async function fetchReviews(placeId, apiKey) {
  let allReviews = [];
  let nextPageToken = null;
const links = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=reviews&language=en&pagetoken=${nextPageToken || ''}`
console.log
  try {
    do {
      const response = await axios.get(`${links}`);
      
      const { result, status } = response.data;
      if (status !== 'OK') {
        throw new Error('Google Places API request failed');
      }
      
      const reviews = result.reviews || [];
      allReviews = allReviews.concat(reviews);
      console.log(reviews)
      nextPageToken = result.next_page_token;
    } while (nextPageToken);

    return allReviews;
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    throw new Error('Internal Server Error');
  }
}


app.get('/api/google-reviews', async (req, res) => {
  try {
    const placeId = "ChIJSVD7Y4mDGjkRSnZM3ca4iEE";
    const apiKey = "AIzaSyD-LPUhqM4jZ6O5YVt07jyeEuNOLT5ObIM";
    // const placeId = req.query.placeId;
    // const apiKey = req.query.apiKey;
    
    const reviews = await fetchReviews(placeId, apiKey);
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
