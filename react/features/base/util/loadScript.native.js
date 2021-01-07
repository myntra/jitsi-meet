// @flow
import { get } from './APIRequest';
/**
 * Default timeout for loading scripts.
 */
const DEFAULT_TIMEOUT = 5000;

/**
 * Loads a script from a specific URL. React Native cannot load a JS
 * file/resource/URL via a <script> HTML element, so the implementation
 * fetches the specified {@code url} as plain text using {@link fetch()} and
 * then evaluates the fetched string as JavaScript code (using {@link eval()}).
 *
 * @param {string} url - The absolute URL from which the script is to be
 * (down)loaded.
 * @param {number} [timeout] - The timeout in millisecnods after which the
 * loading of the specified {@code url} is to be aborted/rejected (if not
 * settled yet).
 * @param {boolean} skipEval - Wether we want to skip evaluating the loaded content or not.
 * @returns {void}
 */
export async function loadScript(
        url: string, timeout: number = DEFAULT_TIMEOUT, skipEval: boolean = false): Promise<any> {
    // XXX The implementation of fetch on Android will throw an Exception on
    // the Java side which will break the app if the URL is invalid (which
    // the implementation of fetch on Android calls 'unexpected url'). In
    // order to try to prevent the breakage of the app, try to fail on an
    // invalid URL as soon as possible.
    const { hostname, pathname, protocol } = new URL(url);

    // XXX The standard URL implementation should throw an Error if the
    // specified URL is relative. Unfortunately, the polyfill used on
    // react-native does not.
    if (!hostname || !pathname || !protocol) {
        throw new Error(`unexpected url: ${url}`);
    }

    const controller = new AbortController();
    const signal = controller.signal;

    // Swetank - Modified for Mlive
    // const timer = setTimeout(() => {
    //     controller.abort();
    // }, timeout);
    // // const headers = { 'user-agent': 'M-LiveAndroid/1.0', 'clientid': 'M-Live-8a891f20-fcd2-4833-a777-c92d553d7fb0', 'cookie': 'xbu=1; xtp=1; stb=1', 'at': 'ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqRXdPQ0o5LmV5SmhjSEJPWVcxbElqb2liWGx1ZEhKaElpd2lhWE56SWpvaVNVUkZRU0lzSW5SdmEyVnVYM1I1Y0dVaU9pSmhkQ0lzSW5OMGIzSmxTV1FpT2lJeU1qazNJaXdpYkhOcFpDSTZJalppT1RCbU16SXhMVEk0TUdZdE5EazNOQzA0Wm1KakxXUTROV1l3TlRSaU1qQXpNaTB4TmpBNU9UQTJNVGszT1RVNUlpd2ljQ0k2SWpJeU9UY2lMQ0p3Y0hNaU9qVXdNQ3dpWTJsa2VDSTZJazB0VEdsMlpTMDRZVGc1TVdZeU1DMW1ZMlF5TFRRNE16TXRZVGMzTnkxak9USmtOVFV6WkRkbVlqQWlMQ0p6ZFdKZmRIbHdaU0k2TUN3aWMyTnZjR1VpT2lKUVQxSlVRVXdpTENKbGVIQWlPakUyTURrNU1EazNPVGNzSW01cFpIZ2lPaUprWkRGall6ZzFPQzAwWlRnNExURXhaV0l0T0RRM09DMHdNREJrTTJGbU1qZzFOakVpTENKcFlYUWlPakUyTURrNU1EWXhPVGNzSW5WcFpIZ2lPaUkxTVRBNFpUSXpaaTQxWWpFekxqUTNNamd1WVRWaU1pNWpNakEzWVdJM1lXTmtNMlJRUzNSa2RIaEpVWGhwSW4wLlN4SGpVTTUxODRjcHZ6ejFGaFh6S2tlQjBkeVNLZGp6dndoZGY4TEIzLTJPSTI3WFp5Z0V4Mmt5V05RRVpCaS00V3B0Qmk3VC1uc3diMXBac1dQRmFCWEJlUEd4a0tzVTF4d2lMNFduNmd2bENGRnJNdkRaMXVyUUFtWFdrel9qZ2lDZFZXYjRraE9Bci1Xay1ZLXhwY2tXczloNzFQLTlIV2NtNTBIQTZXcw==' }
    // // const response = await fetch(url, { headers, signal })
    // // Existing call
    // const response = await fetch(url, { signal });
    // // If the timeout hits the above will raise AbortError.
    // clearTimeout(timer);

    // New call
    const response = await get(url)

    switch (response.status) {
    case 200: {
        // const txt = await response.text();
        const txt = await response.body;
        if (skipEval) {
            return txt;
        }

        return eval.call(window, txt); // eslint-disable-line no-eval
    }
    default:
        throw new Error(`loadScript error: ${response.statusText}`);
    }
}
