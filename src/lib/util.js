export const stringify = (query) => {
    if(typeof query == 'string') return query;

    var i;
    var result = [];

    for (i in query) {
        if (query.hasOwnProperty(i)) {
            result.push(i + '=' + encodeURIComponent(query[i]));
        }
    }

    return result.join('&');
}
