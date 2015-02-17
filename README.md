# gavagai-node

Node.js helper library for Gavagai API

## Install

    $ npm install gavagai

## Credentials

Get your own api key for free at [Gavagai Developer Portal](https://developer.gavagai.se).

## Usage

    var gavagai = require('gavagai');
    var client = gavagai('GAVAGAI_API_KEY');

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

    client.topics(texts); // returns a set of topics found in texts.

