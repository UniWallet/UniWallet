// @flow

const BackgroundTask = {
    _definition: null,

    define: function(task) {
        this._definition = task
    },

    schedule: function(options = {}) {
       //TODO:
    },

    finish: function() {
        //TODO:
    },

    cancel: function() {
        //TODO:
    },

    statusAsync: function() {
        return new Promise(resolve => {
            return resolve({
                available: false,
            })
        })
    }
}

module.exports = BackgroundTask
