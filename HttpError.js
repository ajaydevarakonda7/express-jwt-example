class HttpError extends Error {
    /**
     * 
     * @param {String} message      Error message.
     * @param {Number} statusCode   Http status code.
     * @param {Error} errorObject   Error object if any, to get the stack from.
     */
    constructor(message, statusCode, errorObject) {
        super();
        this.name = "HttpError"
        this.message =  message

        if (statusCode) {
            this.statusCode = statusCode
        }

        if (errorObject) {
            this.stack = errorObject.stack
        }
    }
}

module.exports = HttpError