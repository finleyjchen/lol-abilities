//from here https://stackoverflow.com/questions/9422756/search-a-javascript-object-for-a-property-with-a-specific-value

function searchObj (obj, query) {

    for (var key in obj) {
        var value = obj[key];

        if (typeof value === 'object') {
            searchObj(value, query);
        }

        if (value === query) {
            console.log('property=' + key + ' value=' + value);
        }

    }

}

exports.searchObj = searchObj;
