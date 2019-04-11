if (process.env.NODE_ENV === 'production') {
    module.exports = require('./production_keys');
} else {
    module.exports = require('./development_keys');
}