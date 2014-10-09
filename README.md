#TODO API

##How to run:

1. Download
2. create a folder named config, then crate a config.js inside the folder

content will be:

```
'use strict';

module.exports = {
    "base_url": "http://localhost:3000",
    "test_token": "YOUR_API_TOKEN",
    "db": {
        "production": "mongodb link",
        "development": "mongodb link",
        "test": "mongodb link"
    },
    "logger": {
        "api": "logs/api.log",
        "exception": "logs/exceptions.log"
    }
};
```

mongodb link will be like this:

```
mongodb://localhost:27017/TODOs
```

Then run `npm install`

global package:

```
$ npm install -g nodemon 
```

##Run Server

```
// Production mode
$ node ./bin/server.js production

// development mode
$ node ./bin/server.js development

// test mode
$ node ./bin/server.js test
```

##Test flow

1. `nodemon ./bin/server.js test`
2. use another terminal or use `screen` or use `tmux`, whatever, then run `npm test`

