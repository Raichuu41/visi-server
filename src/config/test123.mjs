import request from 'request';

request('http://129.206.117.194:8023', {json: true}, (err, res, body) => {
    if (err) {return console.log(err)}
    console.log(body.url);
    console.log(body.explanationString);
})