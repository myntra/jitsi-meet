import { NativeModules, Platform } from 'react-native';

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
	return obj === Object(obj);
}

function isEmpty(obj) {
	return Object.getOwnPropertyNames(obj).length === 0;
}

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
	this.method = method;
	this.url = url;
	this._header = {};
	this._data = null;
	this._fields = {};
}

Request.prototype.xmlend = (self) => {
    const httpClient = NativeModules.APIRequest;
    if (isEmpty(self._fields)) {
        return httpClient.xmlRequest(
			self.method,
			self.url,
			self._data,
            self._header,
		);
	}
};

Request.prototype.end = (self) => {
    const httpClient = NativeModules.APIRequest;
    if (isEmpty(self._fields)) {
        return httpClient.request(
			self.method,
			self.url,
			self._data
				? Platform.OS === 'ios'
					? self._data
					: JSON.stringify(self._data)
				: null,
			self._header,
		);
	}
};
/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = (self, field, val) => {
	if (isObject(field)) {
		for (const key in field) {
			self.set(self, key, field[key]);
		}
		return self;
	}
	self._header[field.toLowerCase()] = val;
	return self;
};

Request.prototype.attach = (self, name, fileURL, fileName, mimeType) => {
	self._fields.name = name;
	self._fields.fileURL = fileURL;
	self._fields.fileName = fileName;
	self._fields.mimeType = mimeType;
	return self;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = (self, field) => {
	delete self._header[field.toLowerCase()];
	return self;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = (self, field) =>
	self._header[field.toLowerCase()];

Request.prototype.send = (self, data) => {
	self._data = data;
	return self;
};

export default Request;
