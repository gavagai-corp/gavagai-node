# gavagai-node

Node.js helper library for Gavagai API

## Install

    $ npm install gavagai

## Credentials

Get your own api key for free at [Gavagai Developer Portal](https://developer.gavagai.se).

## Use

See [Gavagai API documentation](https://developer.gavagai.se/docs) for details about available API resources.

### Stories

    var gavagai = require('gavagai');
    var client = gavagai('GAVAGAI_APIKEY');

    var texts = [
        'Stayed here for 3 nights at the beginning of a trip of California. Could not say enough good things about the hotel Monaco. Amazing staff, amazing rooms and the location is brilliant! First stay at a Kimpton hotel, but definitely not the last!!!',
        'I did a lot of research looking for a hotel suite for our family vacation in San Francisco. The Hotel Monaco was a perfect choice. What friendly and delightful staff. I will miss the Grand Cafe, but I will make sure to come back to see their new offerings.',
        'My partner and I spent four nights here over New Years and loved it. Super staff; lovely, quiet room; excellent location within easy walking to much of Downtown and an overall experience that was perfect.'
    ];

    // return a set of significant stories found among the input strings.
    client.stories(texts, function(err, data) {
        if (err) {
            console.error('error:', err);
        }
        console.log('stories returned:', data);
    });

Documents may have a specific id; then you can use an array of objects having properties `body` and `id`.

    var texts = [
        {
          id: '1',
          body: 'Stayed here for 3 nights at the beginning of a trip of California. Could not say enough good things about the hotel Monaco. Amazing staff, amazing rooms and the location is brilliant! First stay at a Kimpton hotel, but definitely not the last!!!',
        },
        {
          id: '2',
          body: 'I did a lot of research looking for a hotel suite for our family vacation in San Francisco. The Hotel Monaco was a perfect choice. What friendly and delightful staff. I will miss the Grand Cafe, but I will make sure to come back to see their new offerings.',
        },
        {
          id: '3',
          body: 'My partner and I spent four nights here over New Years and loved it. Super staff; lovely, quiet room; excellent location within easy walking to much of Downtown and an overall experience that was perfect.'
        }
    ];

### Topics

    // returns a set of topics found in texts.
    client.topics(texts, function(err, data) {
        if (err) {
           console.error('error:', err);
        }
        console.log('stories returned:', data);
    });

### Tonality

In addition to arrays, the Tonality resource accepts single string as input.

    // analyze tonality in a text, or set of texts.
    client.tonality("it’s beautiful and makes me want to cry", function(err, data) {
        if (err) {
           console.error('error:', err);
        }
        console.log('stories returned:', data);
    });

## Options
All methods accepts options as a second paramter. Options are corresponding to API parameters.
E.g. if I have a set of french texts that I want to analyze:

    client.topics(texts, { language: 'fr' }, function(err, data) {
        if (err) {
           console.error('error:', err);
        }
        console.log('stories returned:', data);
    });








