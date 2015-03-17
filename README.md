# gavagai-node

Node.js helper library for Gavagai API

## Install

```bash
$ npm install gavagai
```

## Api key

Get your own api key for free at [Gavagai Developer Portal](https://developer.gavagai.se).

## Use

See [Gavagai API documentation](https://developer.gavagai.se/docs) for details about available API resources.

### Stories
Given a set of texts, return summaries as a set of stories.

```javascript
var gavagai = require('gavagai');
var client = gavagai('GAVAGAI_APIKEY');

var texts = [
    'Stayed here for 3 nights at the beginning of a trip of California. Could not say enough good things about the hotel Monaco. Amazing staff, amazing rooms and the location is brilliant! First stay at a Kimpton hotel, but definitely not the last!!!',
    'I did a lot of research looking for a hotel suite for our family vacation in San Francisco. The Hotel Monaco was a perfect choice. What friendly and delightful staff. I will miss the Grand Cafe, but I will make sure to come back to see their new offerings.',
    'My partner and I spent four nights here over New Years and loved it. Super staff; lovely, quiet room; excellent location within easy walking to much of Downtown and an overall experience that was perfect.'
];

client.stories(texts, function(err, data) {
    if (err) {
        console.error('error:', err);
    }
    console.log('stories returned:', data);
});
```


### Topics
Given a set of texts, return significant topics and keywords.

```javascript
client.topics(texts, function(err, data) {
    if (err) {
       console.error('error:', err);
    }
    console.log('stories returned:', data);
});
```

### Keywords
Extract salient concepts from a collection of texts. Order by number of occurrences.

```javascript
client.keywords(texts, function(err, data) {
    if (err) {
       console.error('error:', err);
    }
    console.log('keywords returned:', data);
});
```

### Tonality
For each text, return their tonality based on lexical analysis in multiple dimensions.
This method accepts either a single string, or an array of texts as input.

```javascript
client.tonality("it’s beautiful and makes me want to cry", function(err, data) {
    if (err) {
       console.error('error:', err);
    }
    console.log('stories returned:', data);
});
```

### Options
All methods accepts options as a second paramter. Options are corresponding to API parameters.
E.g. if I have a set of french texts that I want to analyze:

```javascript
client.topics(texts, { language: 'fr' }, function(err, data) {
    if (err) {
       console.error('error:', err);
    }
    console.log('stories returned:', data);
});
```

### Document IDs
In some situations documents have a specific identifiers. In that case, you can use an array of
objects that have properties `id` and `body`.

```javascript
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
```

### Promises
One method for for handling the common problem with deeply nested callbacks, is to use promises.
Gavagai-node uses the [Q library](https://github.com/kriskowal/q) to provide an alternative to callbacks.

See example in [promises.js](examples/promises.js) for how to make an api call with promises.

## Running tests
Start by install [grunt-cli](https://www.npmjs.com/package/grunt-cli):

```bash
$ npm install -g grunt-cli
```

Execute specs:

```bash
$ grunt
```

Execute smoke tests against live API:.

```bash
$ grunt smoke
```






