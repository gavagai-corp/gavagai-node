var gavagai = require('../lib');
var client = gavagai('GAVAGAI_APIKEY'); // get your own apikey at https://developer.gavagai.se

client.lexicon('good', function (err, data) {
    if (err) {
        console.error('error:', err);
    }
    console.log('lexicon returned:', data);
});

/*
data = {
    "wordInformation": {...}
    "semanticallySimilarWords": [...],
    "leftSideNeighbours": [...],
    "rightSideNeighbours": [...],
    "associations": [...],
    "stringSimilarWords": [...],
    "startsWithWords": [...],
    "endsWithWords": [...],
    "nGrams": [...],
    "semanticallySimilarWordFilaments": [...],
    "topicalFilaments": [...]
}
*/
