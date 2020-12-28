/* eslint-disable yoda */
/* eslint-disable no-shadow */
/* eslint-disable no-bitwise */
import reduce from 'reduce';

const request = {
	type: { json: 'application/json' },
	serialise: { 'application/json': JSON.stringify },
	parse: { 'application/json': JSON.parse },
};

function parseHeaders(headers) {
	const header = {};
	for (const prop in headers) {
		if (!headers[prop]) {
			// The current property is not a direct property of p
			continue;
		}
		header[prop.toLowerCase()] = headers[prop];
	}
	return header;
}

/**
 * @param {String} str content-type
 * @return {String} mime type for the given `str`.
 * @api private
 */
function type(str) {
	return str.split(/ *; */).shift();
}

/**
 * @param {String} str content-type
 * @return {Object} header field parameters.
 * @api private
 */
function params(str) {
	return reduce(
		str.split(/ *; */),
		(obj, str) => {
			const parts = str.split(/ *; */);
			const key = parts.shift();
			const val = parts.shift();

			if (key && val) {
				obj[key] = val;
			}
			return obj;
		},
		{},
	);
}

/**
 * @param {Object} res raw response object
 * @param {Object} req request object
 * @return {Object} a new `Response` with the given raw respose
 * @api private
 */
function Response(res, req) {
	this.req = req;
	this.res = res;
	this.code = res.status;
	this.status = res.status;
	this.headers = res.headers;
	this.header = parseHeaders(res.headers);
	this.statusText = res.statusText;
	this.isCached = res.isCached;
	this.setHeaderProperties(this, this.header);
	this.text = this.req.method !== 'HEAD' ? this.res.body : null;
	this.body =
		this.req.method !== 'HEAD'
			? this.parseBody(this, this.text || this.res.body)
			: null;
}

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {Object} self calling response object
 * @param {String} str response body
 * @return {Mixed} parsed body
 * @api private
 */
Response.prototype.parseBody = (self, str) => {
	const parse = request.parse[self.type];
	try {
		return parse && str && typeof str === 'string' ? parse(str) : str;
	} catch (e) {
		return undefined;
	}
};

/**
 * Get case-insensitive `field` value.
 * @param {Object} self calling response object
 * @param {String} field value
 * @return {String} case-insensitive field value
 * @api public
 */
Response.prototype.get = (self, field) => self.header[field.toLowerCase()];

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 * @param {Object} self calling response object
 * @param {Object} header value
 * @return {Object} undefined
 * @api private
 */
Response.prototype.setHeaderProperties = (self, header) => {
	// content-type
	const contentType = header['content-type'] || '';
	self.type = type(contentType);
	// params
	const obj = params(contentType);
	for (const key in obj) {
		self[key] = obj[key];
	}
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = (self, status) => {
	// handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	if (status === 1223) {
		status = 204;
	}

	const type = (status / 100) | 0;

	// status / class
	self.status = self.statusCode = status;
	self.statusType = type;

	// basics
	self.info = 1 === type;
	self.ok = 2 === type;
	self.clientError = 4 === type;
	self.serverError = 5 === type;
	self.error = 4 === type || 5 === type ? self.toError() : false;

	// sugar
	self.accepted = 202 === status;
	self.noContent = 204 === status;
	self.badRequest = 400 === status;
	self.unauthorized = 401 === status;
	self.notAcceptable = 406 === status;
	self.notFound = 404 === status;
	self.forbidden = 403 === status;
};

export default Response;
