import AsyncStorage from '@react-native-community/async-storage';
import Request from './request';
import Response from './response';

function req(method, url, data, header) {
    // eslint-disable-next-line no-shadow
    const req = new Request(method, url);
	data && req.send(req, data);
	header && req.set(req, header);
	return req.end(req).then((res) => new Response(res, req));
}

// Use `get()` and pass header as second parameter if you want to add a custom header
export function get(url, header) {
	if (header) {
		return sendRequestWithCustomHeader(url, header);
	}
	return req('GET', url);
}

export function head(url) {
	return req('HEAD', url);
}

export function del(url, data) {
	return req('DELETE', url, data);
}

export function patch(url, data) {
	return req('PATCH', url, data);
}

export function post(url, data, header) {
	return req('POST', url, data, header);
}

export function put(url, data) {
	return req('PUT', url, data);
}

/**
 * Upload image to server 'image/jpg'
 * @param {*} url
 * @param {*} param1
 */
export function uploadImage(url, { name, imageURL, fileName }) {
	// eslint-disable-next-line no-shadow
	const req = new Request('POST', url);
	req.attach(req, name, imageURL, fileName, 'image/jpg');
	return req.end(req).then((res) => new Response(res, req));
}

// made this function private. Use `get()` and pass header as second parameter
function sendRequestWithCustomHeader(url, header) {
	// eslint-disable-next-line no-shadow
	const req = new Request('GET', url);
	req.set(req, header);
	return req.end(req).then((res) => new Response(res, req));
}

export function cachedGet(cacheIdentifier, cacheExpiryDuration, url, callback) {
	AsyncStorage.getItem(cacheIdentifier, (err, res) => {
		res = JSON.parse(res);
		const lastUpdatedTime = res && res.updatedAt ? res.updatedAt : 0;
		const cacheDuration = Date.now() - lastUpdatedTime;
		if (!res || cacheDuration > cacheExpiryDuration) {
			get(url)
				.then((resp) => {
					// eslint-disable-next-line no-shadow
					const { body: res } = resp || {};
					__DEV__ &&
						console.log('response for ' + url + ':' + JSON.stringify(res));
					if (res) {
						res.updatedAt = Date.now();
						AsyncStorage.setItem(cacheIdentifier, JSON.stringify(res));
					}
					callback(null, res);
				})
				// eslint-disable-next-line no-shadow
				.catch((err) => {
					callback(err, null);
				});
		} else {
			callback(err, res);
		}
	});
}

// The above function `cachedGet` caches just the body, hence reimplementing logic here
export async function cachedGetPromise(
	cacheIdentifier,
	cacheExpiryDuration,
	url,
) {
	let cachedObject;
	try {
		cachedObject = JSON.parse(await AsyncStorage.getItem(cacheIdentifier));
	} catch (e) {
		cachedObject = null;
	}

	const { response, lastUpdated = 0 } = cachedObject || {};
	const cacheDuration = Date.now() - lastUpdated;

	if (response && cacheDuration < cacheExpiryDuration) {
		return response;
	}

	let networkResponse;
	try {
		networkResponse = await get(url);
	} catch (e) {
		throw e;
	}

	cachedObject = {
		response: networkResponse,
		lastUpdated: Date.now(),
	};

	AsyncStorage.setItem(cacheIdentifier, JSON.stringify(cachedObject));

	return networkResponse;
}

export function exponentialBackoff(
	retryMethod,
	maxNumberOfTries,
	initialDelay,
	delayMultiplier = 2,
) {
	if (!retryMethod || !initialDelay) {
		return;
	}
	retryMethod()
		.then(({ shouldContinue }) => {
			if (!shouldContinue) {
				return;
			}
			if (maxNumberOfTries > 0) {
				setTimeout(function () {
					exponentialBackoff(
						retryMethod,
						--maxNumberOfTries,
						initialDelay * delayMultiplier,
						delayMultiplier,
					);
				}, initialDelay);
			}
		})
		.catch();
}
