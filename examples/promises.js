// When callbacks are stacking up, forming a callback pyramid,
// a better option is to use a promises instead of callbacks.

var gavagai = require('../lib');
var client = gavagai('GAVAGAI_APIKEY');

var texts = [
    'Stayed here for 3 nights at the beginning of a trip of California. Could not say enough good things about the hotel Monaco. Amazing staff, amazing rooms and the location is brilliant! First stay at a Kimpton hotel, but definitely not the last!!!',
    'I did a lot of research looking for a hotel suite for our family vacation in San Francisco. The Hotel Monaco was a perfect choice. What friendly and delightful staff. I will miss the Grand Cafe, but I will make sure to come back to see their new offerings.',
    'My partner and I spent four nights here over New Years and loved it. Super staff; lovely, quiet room; excellent location within easy walking to much of Downtown and an overall experience that was perfect.'
];

// This is how to chain a topics call with a subsequent tonality
// call, using api function tonality.fromTopics.
client.topics(texts)
    .then(client.tonality.fromTopics)
    .then(function (data) {
        console.log('tonality scores for first topic:', data.texts[0].tonality);

    })
    .catch(function(error) {
        console.error('error:', error);
    })
    .done();
