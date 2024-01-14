/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (() => {

    window.up = {
        version: '3.7.2'
    };
    
    
    /***/ }),
    /* 2 */
    /***/ (() => {
    
    up.mockable = function (originalFn) {
        if (window.jasmine) {
            let name = originalFn.name;
            let obj = { [name]: originalFn };
            let mockableFn = function () {
                return obj[name].apply(this, arguments);
            };
            mockableFn.mock = () => spyOn(obj, name);
            return mockableFn;
        }
        else {
            return originalFn;
        }
    };
    
    
    /***/ }),
    /* 3 */
    /***/ (() => {
    
    up.util = (function () {
        function noop() {
        }
        function asyncNoop() {
            return Promise.resolve();
        }
        function memoize(func) {
            let cachedValue, cached;
            return function (...args) {
                if (cached) {
                    return cachedValue;
                }
                else {
                    cached = true;
                    return cachedValue = func.apply(this, args);
                }
            };
        }
        const NORMALIZE_URL_DEFAULTS = {
            host: 'cross-domain',
        };
        function normalizeURL(url, options) {
            options = newOptions(options, NORMALIZE_URL_DEFAULTS);
            const parts = parseURL(url);
            let normalized = '';
            if (options.host === 'cross-domain') {
                options.host = isCrossOrigin(parts);
            }
            if (options.host) {
                normalized += parts.protocol + "//" + parts.host;
            }
            let { pathname } = parts;
            if (options.trailingSlash === false && pathname !== '/') {
                pathname = pathname.replace(/\/$/, '');
            }
            normalized += pathname;
            if (options.search !== false) {
                normalized += parts.search;
            }
            if (options.hash !== false) {
                normalized += parts.hash;
            }
            return normalized;
        }
        function matchURLs(leftURL, rightURL) {
            return normalizeURL(leftURL) === normalizeURL(rightURL);
        }
        const APP_PROTOCOL = location.protocol;
        const APP_HOSTNAME = location.hostname;
        function isCrossOrigin(urlOrAnchor) {
            if (isString(urlOrAnchor) && (urlOrAnchor.indexOf('//') === -1)) {
                return false;
            }
            const parts = parseURL(urlOrAnchor);
            return (APP_HOSTNAME !== parts.hostname) || (APP_PROTOCOL !== parts.protocol);
        }
        function parseURL(url) {
            if (url.pathname) {
                return url;
            }
            let link = document.createElement('a');
            link.href = url;
            return link;
        }
        function normalizeMethod(method) {
            return method ? method.toUpperCase() : 'GET';
        }
        function methodAllowsPayload(method) {
            return (method !== 'GET') && (method !== 'HEAD');
        }
        function iteratee(block) {
            if (isString(block)) {
                return item => item[block];
            }
            else {
                return block;
            }
        }
        function map(list, block) {
            if (list.length === 0) {
                return [];
            }
            block = iteratee(block);
            let mapped = [];
            let i = 0;
            for (let item of list) {
                mapped.push(block(item, i++));
            }
            return mapped;
        }
        function mapObject(array, pairer) {
            const merger = function (object, pair) {
                object[pair[0]] = pair[1];
                return object;
            };
            return map(array, pairer).reduce(merger, {});
        }
        function each(array, block) {
            let i = 0;
            for (let item of array) {
                block(item, i++);
            }
        }
        function isNull(object) {
            return object === null;
        }
        function isUndefined(object) {
            return object === undefined;
        }
        const isDefined = negate(isUndefined);
        function isMissing(object) {
            return isUndefined(object) || isNull(object);
        }
        const isGiven = negate(isMissing);
        function isBlank(value) {
            if (isMissing(value)) {
                return true;
            }
            if (isObject(value) && value[isBlank.key]) {
                return value[isBlank.key]();
            }
            if (isString(value) || isList(value)) {
                return value.length === 0;
            }
            if (isOptions(value)) {
                return Object.keys(value).length === 0;
            }
            return false;
        }
        isBlank.key = 'up.util.isBlank';
        function presence(value, tester = isPresent) {
            if (tester(value)) {
                return value;
            }
        }
        const isPresent = negate(isBlank);
        function isFunction(object) {
            return typeof (object) === 'function';
        }
        function isString(object) {
            return (typeof (object) === 'string') || object instanceof String;
        }
        function isBoolean(object) {
            return (typeof (object) === 'boolean') || object instanceof Boolean;
        }
        function isNumber(object) {
            return (typeof (object) === 'number') || object instanceof Number;
        }
        function isOptions(object) {
            return (typeof (object) === 'object') && !isNull(object) && (isUndefined(object.constructor) || (object.constructor === Object));
        }
        function isObject(object) {
            const typeOfResult = typeof (object);
            return ((typeOfResult === 'object') && !isNull(object)) || (typeOfResult === 'function');
        }
        function isElement(object) {
            return object instanceof Element;
        }
        function isRegExp(object) {
            return object instanceof RegExp;
        }
        function isError(object) {
            return object instanceof Error;
        }
        function isJQuery(object) {
            return up.browser.canJQuery() && object instanceof jQuery;
        }
        function isElementish(object) {
            return !!(object && (object.addEventListener || object[0]?.addEventListener));
        }
        function isPromise(object) {
            return isObject(object) && isFunction(object.then);
        }
        const { isArray } = Array;
        function isFormData(object) {
            return object instanceof FormData;
        }
        function toArray(value) {
            return isArray(value) ? value : copyArrayLike(value);
        }
        function isList(value) {
            return isArray(value) ||
                isNodeList(value) ||
                isArguments(value) ||
                isJQuery(value) ||
                isHTMLCollection(value);
        }
        function isNodeList(value) {
            return value instanceof NodeList;
        }
        function isHTMLCollection(value) {
            return value instanceof HTMLCollection;
        }
        function isArguments(value) {
            return Object.prototype.toString.call(value) === '[object Arguments]';
        }
        function nullToUndefined(value) {
            if (!isNull(value)) {
                return value;
            }
        }
        function wrapList(value) {
            if (isList(value)) {
                return value;
            }
            else if (isMissing(value)) {
                return [];
            }
            else {
                return [value];
            }
        }
        function copy(value) {
            if (isObject(value) && value[copy.key]) {
                value = value[copy.key]();
            }
            else if (isList(value)) {
                value = copyArrayLike(value);
            }
            else if (isOptions(value)) {
                value = Object.assign({}, value);
            }
            return value;
        }
        function copyArrayLike(arrayLike) {
            return Array.prototype.slice.call(arrayLike);
        }
        copy.key = 'up.util.copy';
        Date.prototype[copy.key] = function () { return new Date(+this); };
        function merge(...sources) {
            return Object.assign({}, ...sources);
        }
        function mergeDefined(...sources) {
            const result = {};
            for (let source of sources) {
                if (source) {
                    for (let key in source) {
                        const value = source[key];
                        if (isDefined(value)) {
                            result[key] = value;
                        }
                    }
                }
            }
            return result;
        }
        function newOptions(object, defaults) {
            if (defaults) {
                return merge(defaults, object);
            }
            else if (object) {
                return copy(object);
            }
            else {
                return {};
            }
        }
        function parseArgIntoOptions(args, argKey) {
            let options = extractOptions(args);
            if (isDefined(args[0])) {
                options = copy(options);
                options[argKey] = args[0];
            }
            return options;
        }
        function findInList(list, tester) {
            tester = iteratee(tester);
            let match;
            for (let element of list) {
                if (tester(element)) {
                    match = element;
                    break;
                }
            }
            return match;
        }
        function some(list, tester) {
            return !!findResult(list, tester);
        }
        function findResult(list, tester) {
            tester = iteratee(tester);
            let i = 0;
            for (let item of list) {
                const result = tester(item, i++);
                if (result) {
                    return result;
                }
            }
        }
        function every(list, tester) {
            tester = iteratee(tester);
            let match = true;
            let i = 0;
            for (let item of list) {
                if (!tester(item, i++)) {
                    match = false;
                    break;
                }
            }
            return match;
        }
        function compact(array) {
            return filterList(array, isGiven);
        }
        function filterMap(list, mapping) {
            return filterList(map(list, mapping), isDefined);
        }
        function compactObject(object) {
            return pickBy(object, isGiven);
        }
        function uniq(array) {
            if (array.length < 2) {
                return array;
            }
            return Array.from(new Set(array));
        }
        function uniqBy(array, mapper) {
            if (array.length < 2) {
                return array;
            }
            mapper = iteratee(mapper);
            const seenElements = new Set();
            return filterList(array, function (elem, index) {
                const mapped = mapper(elem, index);
                if (seenElements.has(mapped)) {
                    return false;
                }
                else {
                    seenElements.add(mapped);
                    return true;
                }
            });
        }
        function filterList(list, tester) {
            tester = iteratee(tester);
            const matches = [];
            each(list, function (element, index) {
                if (tester(element, index)) {
                    return matches.push(element);
                }
            });
            return matches;
        }
        function reject(list, tester) {
            tester = negate(iteratee(tester));
            return filterList(list, tester);
        }
        function intersect(array1, array2) {
            return filterList(array1, element => contains(array2, element));
        }
        function scheduleTimer(millis, callback) {
            return setTimeout(callback, millis);
        }
        function queueTask(task) {
            return setTimeout(task);
        }
        function queueMicrotask(task) {
            return Promise.resolve().then(task);
        }
        function last(value) {
            return value[value.length - 1];
        }
        function contains(value, subValue) {
            let indexOf = value.indexOf || Array.prototype.indexOf;
            return indexOf.call(value, subValue) >= 0;
        }
        function objectContains(object, subObject) {
            const reducedValue = pick(object, Object.keys(subObject));
            return isEqual(subObject, reducedValue);
        }
        function pick(object, keys) {
            const filtered = {};
            for (let key of keys) {
                if (key in object) {
                    filtered[key] = object[key];
                }
            }
            return filtered;
        }
        function pickBy(object, tester) {
            tester = iteratee(tester);
            const filtered = {};
            for (let key in object) {
                const value = object[key];
                if (tester(value, key, object)) {
                    filtered[key] = object[key];
                }
            }
            return filtered;
        }
        function omit(object, keys) {
            return pickBy(object, (_value, key) => !contains(keys, key));
        }
        function unresolvablePromise() {
            return new Promise(noop);
        }
        function remove(array, element) {
            const index = array.indexOf(element);
            if (index >= 0) {
                array.splice(index, 1);
                return element;
            }
        }
        function evalOption(value, ...args) {
            return isFunction(value) ? value(...args) : value;
        }
        function evalAutoOption(value, autoMeans, ...args) {
            value = evalOption(value, ...args);
            if (value === 'auto') {
                value = evalOption(autoMeans, ...args);
            }
            return value;
        }
        const ESCAPE_HTML_ENTITY_MAP = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#x27;'
        };
        function escapeHTML(string) {
            return string.replace(/[&<>"']/g, char => ESCAPE_HTML_ENTITY_MAP[char]);
        }
        function escapeRegExp(string) {
            return string.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
        }
        function pluckKey(object, key) {
            const value = object[key];
            delete object[key];
            return value;
        }
        function renameKey(object, oldKey, newKey) {
            return object[newKey] = pluckKey(object, oldKey);
        }
        function extractLastArg(args, tester) {
            if (tester(last(args))) {
                return args.pop();
            }
        }
        function extractCallback(args) {
            return extractLastArg(args, isFunction);
        }
        function extractOptions(args) {
            return extractLastArg(args, isOptions) || {};
        }
        function identity(arg) {
            return arg;
        }
        function sequence(functions) {
            functions = compact(functions);
            return (...args) => map(functions, fn => fn(...args));
        }
        function flatten(array) {
            const flattened = [];
            for (let object of array) {
                if (isList(object)) {
                    flattened.push(...object);
                }
                else {
                    flattened.push(object);
                }
            }
            return flattened;
        }
        function flatMap(array, block) {
            return flatten(map(array, block));
        }
        function always(promise, callback = identity) {
            return promise.then(callback, callback);
        }
        function newDeferred() {
            let resolveFn;
            let rejectFn;
            const nativePromise = new Promise(function (givenResolve, givenReject) {
                resolveFn = givenResolve;
                rejectFn = givenReject;
            });
            nativePromise.resolve = resolveFn;
            nativePromise.reject = rejectFn;
            return nativePromise;
        }
        function isBasicObjectProperty(k) {
            return Object.prototype.hasOwnProperty(k);
        }
        function isEqual(a, b) {
            if (a?.valueOf) {
                a = a.valueOf();
            }
            if (b?.valueOf) {
                b = b.valueOf();
            }
            if (typeof (a) !== typeof (b)) {
                return false;
            }
            else if (isList(a) && isList(b)) {
                return isEqualList(a, b);
            }
            else if (isObject(a) && a[isEqual.key]) {
                return a[isEqual.key](b);
            }
            else if (isOptions(a) && isOptions(b)) {
                const aKeys = Object.keys(a);
                const bKeys = Object.keys(b);
                if (isEqualList(aKeys, bKeys)) {
                    return every(aKeys, aKey => isEqual(a[aKey], b[aKey]));
                }
                else {
                    return false;
                }
            }
            else {
                return a === b;
            }
        }
        isEqual.key = 'up.util.isEqual';
        function isEqualList(a, b) {
            return (a.length === b.length) && every(a, (elem, index) => isEqual(elem, b[index]));
        }
        const PARSE_TOKEN_PATTERNS = {
            'space/or': /\s+(?:or\s+)?/,
            'or': /\s+or\s+/,
            'comma': /\s*,\s*/
        };
        function parseTokens(value, options = {}) {
            if (isString(value)) {
                value = value.trim();
                if (options.json && /^\[.*]$/.test(value)) {
                    return JSON.parse(value);
                }
                else {
                    let separator = options.separator || 'space/or';
                    let pattern = PARSE_TOKEN_PATTERNS[separator];
                    return value.split(pattern);
                }
            }
            else {
                return wrapList(value);
            }
        }
        function wrapValue(constructor, ...args) {
            return (args[0] instanceof constructor) ? args[0] : new constructor(...args);
        }
        let nextUid = 0;
        function uid() {
            return nextUid++;
        }
        function reverse(list) {
            return copy(list).reverse();
        }
        function renameKeys(object, renameKeyFn) {
            const renamed = {};
            for (let key in object) {
                renamed[renameKeyFn(key)] = object[key];
            }
            return renamed;
        }
        function camelToKebabCase(str) {
            return str.replace(/[A-Z]/g, char => '-' + char.toLowerCase());
        }
        function lowerCaseFirst(str) {
            return str[0].toLowerCase() + str.slice(1);
        }
        function upperCaseFirst(str) {
            return str[0].toUpperCase() + str.slice(1);
        }
        function defineDelegates(object, props, targetProvider) {
            for (let prop of props) {
                Object.defineProperty(object, prop, {
                    get() {
                        const target = targetProvider.call(this);
                        let value = target[prop];
                        if (isFunction(value)) {
                            value = value.bind(target);
                        }
                        return value;
                    },
                    set(newValue) {
                        const target = targetProvider.call(this);
                        target[prop] = newValue;
                    }
                });
            }
        }
        function stringifyArg(arg, placeholder = '%o') {
            let string;
            const maxLength = 200;
            if (placeholder === '%c') {
                return '';
            }
            if (placeholder === '%s' && isGiven(arg)) {
                arg = arg.toString();
            }
            if (isString(arg)) {
                string = arg.trim().replace(/[\n\r\t ]+/g, ' ');
                if (placeholder === '%o') {
                    string = JSON.stringify(string);
                }
            }
            else if (isUndefined(arg)) {
                string = 'undefined';
            }
            else if (isNumber(arg) || isFunction(arg)) {
                string = arg.toString();
            }
            else if (isArray(arg)) {
                string = `[${map(arg, stringifyArg).join(', ')}]`;
            }
            else if (isJQuery(arg)) {
                string = `$(${map(arg, stringifyArg).join(', ')})`;
            }
            else if (isElement(arg)) {
                string = `<${arg.tagName.toLowerCase()}`;
                for (let attr of ['id', 'up-id', 'name', 'class']) {
                    let value = arg.getAttribute(attr);
                    if (value) {
                        string += ` ${attr}="${value}"`;
                    }
                }
                string += ">";
            }
            else if (isRegExp(arg) || isError(arg)) {
                string = arg.toString();
            }
            else {
                try {
                    string = JSON.stringify(arg);
                }
                catch (error) {
                    if (error.name === 'TypeError') {
                        string = '(circular structure)';
                    }
                    else {
                        throw error;
                    }
                }
            }
            if (string.length > maxLength) {
                string = `${string.substr(0, maxLength)}…${last(string)}`;
            }
            return string;
        }
        const SPRINTF_PLACEHOLDERS = /%[oOdisfc]/g;
        function sprintf(message, ...args) {
            return message.replace(SPRINTF_PLACEHOLDERS, (placeholder) => stringifyArg(args.shift(), placeholder));
        }
        function negate(fn) {
            return function (...args) {
                return !fn(...args);
            };
        }
        function useMemoizeCacheEntry(cacheEntry) {
            if (cacheEntry.error) {
                throw cacheEntry.error;
            }
            else {
                return cacheEntry.value;
            }
        }
        function buildMemoizeCacheEntry(oldImpl, self, args) {
            try {
                return { value: oldImpl.apply(self, args) };
            }
            catch (e) {
                return { error: e };
            }
        }
        function memoizeMethod(object, propLiteral) {
            for (let prop in propLiteral) {
                let originalDescriptor = Object.getOwnPropertyDescriptor(object, prop);
                let oldImpl = originalDescriptor.value;
                let cachingImpl = function (...args) {
                    let cache = this[`__${prop}MemoizeCache`] ||= {};
                    let cacheKey = JSON.stringify(args);
                    cache[cacheKey] ||= buildMemoizeCacheEntry(oldImpl, this, args);
                    return useMemoizeCacheEntry(cache[cacheKey]);
                };
                object[prop] = cachingImpl;
            }
        }
        function safeStringifyJSON(value) {
            let json = JSON.stringify(value);
            return escapeHighASCII(json);
        }
        function escapeHighASCII(string) {
            let unicodeEscape = (char) => "\\u" + char.charCodeAt(0).toString(16).padStart(4, '0');
            return string.replace(/[^\x00-\x7F]/g, unicodeEscape);
        }
        function variant(source, changes = {}) {
            let variant = Object.create(source);
            Object.assign(variant, changes);
            return variant;
        }
        return {
            parseURL,
            normalizeURL,
            matchURLs,
            normalizeMethod,
            methodAllowsPayload,
            copy,
            copyArrayLike,
            merge,
            mergeDefined,
            options: newOptions,
            parseArgIntoOptions,
            each,
            map,
            flatMap,
            mapObject,
            findResult,
            some,
            every,
            find: findInList,
            filter: filterList,
            filterMap: filterMap,
            reject,
            intersect,
            compact,
            compactObject,
            uniq,
            uniqBy,
            last,
            isNull,
            isDefined,
            isUndefined,
            isGiven,
            isMissing,
            isPresent,
            isBlank,
            presence,
            isObject,
            isFunction,
            isString,
            isBoolean,
            isNumber,
            isElement,
            isJQuery,
            isElementish,
            isPromise,
            isOptions,
            isArray,
            isFormData,
            isList,
            isRegExp,
            timer: scheduleTimer,
            contains,
            objectContains,
            toArray,
            pick,
            pickBy,
            omit,
            unresolvablePromise,
            remove,
            memoize,
            pluckKey,
            renameKey,
            extractOptions,
            extractCallback,
            noop,
            asyncNoop,
            identity,
            escapeHTML,
            escapeRegExp,
            sequence,
            evalOption,
            evalAutoOption,
            flatten,
            newDeferred,
            always,
            isBasicObjectProperty,
            isCrossOrigin,
            task: queueTask,
            microtask: queueMicrotask,
            isEqual,
            parseTokens,
            wrapList,
            wrapValue,
            uid,
            upperCaseFirst,
            lowerCaseFirst,
            delegate: defineDelegates,
            reverse,
            camelToKebabCase,
            nullToUndefined,
            sprintf,
            renameKeys,
            negate,
            memoizeMethod,
            safeStringifyJSON,
            variant,
        };
    })();
    
    
    /***/ }),
    /* 4 */
    /***/ (() => {
    
    up.error = (function () {
        function fail(...args) {
            throw new up.Error(args);
        }
        function isCritical(error) {
            return (typeof error !== 'object') || ((error.name !== 'AbortError') && !(error instanceof up.RenderResult) && !(error instanceof up.Response));
        }
        function muteUncriticalRejection(promise) {
            return promise.catch(throwCritical);
        }
        function muteUncriticalSync(block) {
            try {
                return block();
            }
            catch (e) {
                throwCritical(e);
            }
        }
        function throwCritical(value) {
            if (isCritical(value)) {
                throw value;
            }
        }
        function report(error) {
            console.error('Uncaught %o', error);
            let event = new ErrorEvent('error', { error, message: 'Uncaught ' + error });
            window.dispatchEvent(event);
        }
        function guard(fn) {
            try {
                return fn();
            }
            catch (error) {
                report(error);
            }
        }
        function guardFn(fn) {
            return (...args) => guard(() => fn(...args));
        }
        return {
            fail,
            throwCritical,
            muteUncriticalRejection,
            muteUncriticalSync,
            guard,
            guardFn,
        };
    })();
    up.fail = up.error.fail;
    
    
    /***/ }),
    /* 5 */
    /***/ (() => {
    
    up.migrate = { config: {} };
    
    
    /***/ }),
    /* 6 */
    /***/ (() => {
    
    up.browser = (function () {
        const u = up.util;
        function submitForm(form) {
            form.submit();
        }
        function canPushState() {
            return up.protocol.initialRequestMethod() === 'GET';
        }
        function canJQuery() {
            return !!window.jQuery;
        }
        const canHasSelector = u.memoize(() => CSS.supports('selector(:has(*))'));
        function popCookie(name) {
            let value = document.cookie.match(new RegExp(name + "=(\\w+)"))?.[1];
            if (value) {
                document.cookie = name + '=;Max-Age=0;Path=/';
                return value;
            }
        }
        function assertConfirmed(options) {
            const confirmed = !options.confirm || window.confirm(options.confirm);
            if (!confirmed) {
                throw new up.Aborted('User canceled action');
            }
            return true;
        }
        return {
            submitForm,
            canPushState,
            canJQuery,
            assertConfirmed,
            popCookie,
            canHasSelector,
        };
    })();
    
    
    /***/ }),
    /* 7 */
    /***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
    
    __webpack_require__(8);
    up.element = (function () {
        const u = up.util;
        function first(...args) {
            const selector = args.pop();
            const root = args[0] || document;
            return root.querySelector(selector);
        }
        function subtree(root, selector) {
            const results = [];
            if (root.matches(selector)) {
                results.push(root);
            }
            results.push(...root.querySelectorAll(selector));
            return results;
        }
        function contains(root, selectorOrElement) {
            const element = getOne(selectorOrElement);
            return Node.prototype.contains.call(root, element);
        }
        function ancestor(element, selector) {
            return element.parentNode?.closest(selector);
        }
        function around(element, selector) {
            return getList(element.closest(selector), subtree(element, selector));
        }
        function getOne(...args) {
            const value = args.pop();
            if (u.isElement(value)) {
                return value;
            }
            else if (u.isString(value)) {
                return first(...args, value);
            }
            else if (u.isList(value)) {
                if (value.length > 1) {
                    up.fail('up.element.get(): Cannot cast multiple elements (%o) to a single element', value);
                }
                return value[0];
            }
            else {
                return value;
            }
        }
        function getList(...args) {
            return u.flatMap(args, valueToList);
        }
        function valueToList(value) {
            if (u.isString(value)) {
                return document.querySelectorAll(value);
            }
            else {
                return u.wrapList(value);
            }
        }
        function hide(element) {
            element.setAttribute('hidden', '');
        }
        function show(element) {
            element.removeAttribute('hidden');
            if (element.style.display === 'none') {
                element.style.display = '';
            }
        }
        function toggle(element, newVisible) {
            if (newVisible == null) {
                newVisible = !isVisible(element);
            }
            (newVisible ? show : hide)(element);
        }
        function toggleAttr(element, attr, value, newPresent) {
            if (newPresent == null) {
                newPresent = !element.hasAttribute(attr);
            }
            if (newPresent) {
                return element.setAttribute(attr, value);
            }
            else {
                return element.removeAttribute(attr);
            }
        }
        function setAttrs(element, attrs) {
            for (let key in attrs) {
                const value = attrs[key];
                if (u.isGiven(value)) {
                    element.setAttribute(key, value);
                }
                else {
                    element.removeAttribute(key);
                }
            }
        }
        function setTemporaryAttrs(element, attrs) {
            const oldAttrs = {};
            for (let key of Object.keys(attrs)) {
                oldAttrs[key] = element.getAttribute(key);
            }
            setAttrs(element, attrs);
            return () => setAttrs(element, oldAttrs);
        }
        function metaContent(name) {
            const selector = "meta" + attrSelector('name', name);
            return first(selector)?.getAttribute('content');
        }
        function insertBefore(existingElement, newElement) {
            existingElement.insertAdjacentElement('beforebegin', newElement);
        }
        function createFromSelector(selector, attrs = {}) {
            let { includePath } = parseSelector(selector);
            let rootElement;
            let depthElement;
            let previousElement;
            for (let includeSegment of includePath) {
                let { tagName, id, classNames, attributes } = includeSegment;
                if (!tagName || tagName === '*') {
                    tagName = 'div';
                }
                depthElement = document.createElement(tagName);
                if (!rootElement) {
                    rootElement = depthElement;
                }
                if (id) {
                    depthElement.id = id;
                }
                for (let className of classNames) {
                    depthElement.classList.add(className);
                }
                for (let attributeName in attributes) {
                    let attributeValue = attributes[attributeName];
                    depthElement.setAttribute(attributeName, attributeValue || '');
                }
                previousElement?.appendChild(depthElement);
                previousElement = depthElement;
            }
            for (let key in attrs) {
                let value = attrs[key];
                if (key === 'class') {
                    for (let klass of u.wrapList(value)) {
                        rootElement.classList.add(klass);
                    }
                }
                else if (key === 'style') {
                    setInlineStyle(rootElement, value);
                }
                else if (key === 'text') {
                    rootElement.textContent = value;
                }
                else if (key === 'content') {
                    rootElement.innerHTML = value;
                }
                else {
                    rootElement.setAttribute(key, value);
                }
            }
            return rootElement;
        }
        function parseSelector(selector) {
            let excludeRaw;
            const includeRaw = selector.replace(/:not\([^)]+\)/, function (match) {
                excludeRaw = match;
                return '';
            });
            const [includeSelectorWithoutAttrValues, attrValues] = removeAttrSelectorValues(includeRaw);
            const includeSegments = includeSelectorWithoutAttrValues.split(/[ >]+/);
            let includePath = includeSegments.map(function (depthSelector) {
                let parsed = {
                    tagName: null,
                    classNames: [],
                    id: null,
                    attributes: {}
                };
                depthSelector = depthSelector.replace(/^[\w-*]+/, function (match) {
                    parsed.tagName = match;
                    return '';
                });
                depthSelector = depthSelector.replace(/#([\w-]+)/, function (_match, id) {
                    parsed.id = id;
                    return '';
                });
                depthSelector = depthSelector.replace(/\.([\w-]+)/g, function (_match, className) {
                    parsed.classNames.push(className);
                    return '';
                });
                if (attrValues.length) {
                    depthSelector = replaceAttrSelectors(depthSelector, function ({ name }) {
                        parsed.attributes[name] = attrValues.shift();
                        return '';
                    });
                }
                if (depthSelector) {
                    up.fail('Cannot parse selector: ' + selector);
                }
                return parsed;
            });
            return {
                includePath,
                includeRaw,
                excludeRaw,
            };
        }
        const ATTR_SELECTOR_PATTERN = /\[([\w-]+)(?:([~|^$*]?=)(["'])?([^\3\]]*?)\3)?]/g;
        function replaceAttrSelectors(string, replacement) {
            return string.replace(ATTR_SELECTOR_PATTERN, function (_match, name, operator, quote, value) {
                if (value) {
                    value = value.replace(/\\([\\"'])/, '$1');
                }
                return replacement({ name, operator, quote, value });
            });
        }
        function removeAttrSelectorValues(selector) {
            let values = [];
            selector = replaceAttrSelectors(selector, function ({ name, value }) {
                values.push(value);
                return `[${name}]`;
            });
            return [selector, values];
        }
        function affix(parent, ...args) {
            let position, selector;
            const attributes = u.extractOptions(args);
            if (args.length === 2) {
                [position, selector] = args;
            }
            else {
                position = 'beforeend';
                selector = args[0];
            }
            const element = createFromSelector(selector, attributes);
            parent.insertAdjacentElement(position, element);
            return element;
        }
        const SINGLETON_TAG_NAMES = ['HTML', 'BODY', 'HEAD', 'TITLE'];
        const isSingleton = up.mockable(element => element.matches(SINGLETON_TAG_NAMES.join()));
        function elementTagName(element) {
            return element.tagName.toLowerCase();
        }
        function attrSelector(attribute, value) {
            if (u.isGiven(value)) {
                value = value.replace(/"/g, '\\"');
                return `[${attribute}="${value}"]`;
            }
            else {
                return `[${attribute}]`;
            }
        }
        function idSelector(id) {
            if (id.match(/^[a-z0-9\-_]+$/i)) {
                return `#${id}`;
            }
            else {
                return attrSelector('id', id);
            }
        }
        function classSelector(klass) {
            klass = klass.replace(/[^\w-]/g, '\\$&');
            return `.${klass}`;
        }
        function createBrokenDocumentFromHTML(html) {
            return new DOMParser().parseFromString(html, 'text/html');
        }
        function fixParserDamage(scriptish) {
            let clone = createFromHTML(scriptish.outerHTML);
            scriptish.replaceWith(clone);
        }
        function createFromHTML(html) {
            const range = document.createRange();
            range.setStart(document.body, 0);
            const fragment = range.createContextualFragment(html.trim());
            let elements = fragment.childNodes;
            if (elements.length !== 1) {
                throw new Error('HTML must have a single root element');
            }
            return elements[0];
        }
        function getRoot() {
            return document.documentElement;
        }
        function paint(element) {
            element.offsetHeight;
        }
        function concludeCSSTransition(element) {
            const undo = setTemporaryStyle(element, { transition: 'none' });
            paint(element);
            return undo;
        }
        function hasCSSTransition(elementOrStyleHash) {
            let styleHash;
            if (u.isOptions(elementOrStyleHash)) {
                styleHash = elementOrStyleHash;
            }
            else {
                styleHash = computedStyle(elementOrStyleHash);
            }
            const prop = styleHash.transitionProperty;
            const duration = styleHash.transitionDuration;
            const noTransition = ((prop === 'none') || ((prop === 'all') && (duration === 0)));
            return !noTransition;
        }
        function fixedToAbsolute(element) {
            const elementRectAsFixed = element.getBoundingClientRect();
            element.style.position = 'absolute';
            const offsetParentRect = element.offsetParent.getBoundingClientRect();
            setInlineStyle(element, {
                left: elementRectAsFixed.left - computedStyleNumber(element, 'margin-left') - offsetParentRect.left,
                top: elementRectAsFixed.top - computedStyleNumber(element, 'margin-top') - offsetParentRect.top,
                right: '',
                bottom: ''
            });
        }
        function setMissingAttrs(element, attrs) {
            for (let key in attrs) {
                setMissingAttr(element, key, attrs[key]);
            }
        }
        function setMissingAttr(element, key, value) {
            if (u.isMissing(element.getAttribute(key))) {
                element.setAttribute(key, value);
            }
        }
        function unwrap(wrapper) {
            preservingFocus(function () {
                const parent = wrapper.parentNode;
                const wrappedNodes = u.toArray(wrapper.childNodes);
                u.each(wrappedNodes, wrappedNode => parent.insertBefore(wrappedNode, wrapper));
                parent.removeChild(wrapper);
            });
        }
        function wrapChildren(element) {
            let childNode;
            const wrapper = document.createElement('up-wrapper');
            while ((childNode = element.firstChild)) {
                wrapper.appendChild(childNode);
            }
            element.appendChild(wrapper);
            return wrapper;
        }
        function isWrapper(element) {
            return element.matches('up-wrapper');
        }
        function preservingFocus(fn) {
            const oldFocusElement = document.activeElement;
            try {
                return fn();
            }
            finally {
                if (oldFocusElement && oldFocusElement !== document.activeElement) {
                    oldFocusElement.focus({ preventScroll: true });
                }
            }
        }
        function stringAttr(element, attribute) {
            return u.nullToUndefined(element.getAttribute(attribute));
        }
        function booleanAttr(element, attribute, pass) {
            if (!element.hasAttribute(attribute))
                return;
            const value = stringAttr(element, attribute);
            switch (value) {
                case 'false': {
                    return false;
                }
                case 'true':
                case '':
                case attribute: {
                    return true;
                }
                default: {
                    if (pass) {
                        return value;
                    }
                    else {
                        return true;
                    }
                }
            }
        }
        function booleanOrStringAttr(element, attribute) {
            return booleanAttr(element, attribute, true);
        }
        function numberAttr(element, attribute) {
            let value = element.getAttribute(attribute);
            if (value) {
                value = value.replace(/_/g, '');
                if (value.match(/^[\d.]+$/)) {
                    return parseFloat(value);
                }
            }
        }
        function jsonAttr(element, attribute) {
            let json = element.getAttribute?.(attribute)?.trim();
            if (json) {
                return JSON.parse(json);
            }
        }
        function callbackAttr(link, attr, { exposedKeys = [], mainKey = 'event' } = {}) {
            let code = link.getAttribute(attr);
            if (code) {
                const callback = up.NonceableCallback.fromString(code).toFunction(mainKey, ...exposedKeys);
                return function (event) {
                    const exposedValues = Object.values(u.pick(event, exposedKeys));
                    return callback.call(link, event, ...exposedValues);
                };
            }
        }
        function closestAttr(element, attr, parseFn = stringAttr) {
            let match = element.closest('[' + attr + ']');
            if (match) {
                return parseFn(match, attr);
            }
        }
        function setTemporaryStyle(element, newStyles) {
            const oldStyles = inlineStyle(element, Object.keys(newStyles));
            setInlineStyle(element, newStyles);
            return () => setInlineStyle(element, oldStyles);
        }
        function addTemporaryClass(element, klass) {
            element.classList.add(klass);
            return () => element.classList.remove(klass);
        }
        function setTemporaryAttr(element, attr, value) {
            element.setAttribute(attr, value);
            return () => element.removeAttribute(element, attr);
        }
        function computedStyle(element, props) {
            const style = window.getComputedStyle(element);
            return extractFromStyleObject(style, props);
        }
        function computedStyleNumber(element, prop) {
            const rawValue = computedStyle(element, prop);
            if (u.isGiven(rawValue)) {
                return parseFloat(rawValue);
            }
        }
        function inlineStyle(element, props) {
            const { style } = element;
            return extractFromStyleObject(style, props);
        }
        function extractFromStyleObject(style, keyOrKeys) {
            if (u.isString(keyOrKeys)) {
                return style[keyOrKeys];
            }
            else {
                return u.pick(style, keyOrKeys);
            }
        }
        function setInlineStyle(element, props) {
            if (u.isString(props)) {
                element.setAttribute('style', props);
            }
            else {
                const { style } = element;
                for (let key in props) {
                    let value = props[key];
                    value = normalizeStyleValueForWrite(key, value);
                    style[key] = value;
                }
            }
        }
        function normalizeStyleValueForWrite(key, value) {
            if (u.isMissing(value)) {
                value = '';
            }
            else if (CSS_LENGTH_PROPS.has(key.toLowerCase().replace(/-/, ''))) {
                value = cssLength(value);
            }
            return value;
        }
        const CSS_LENGTH_PROPS = new Set([
            'top', 'right', 'bottom', 'left',
            'padding', 'paddingtop', 'paddingright', 'paddingbottom', 'paddingleft',
            'margin', 'margintop', 'marginright', 'marginbottom', 'marginleft',
            'borderwidth', 'bordertopwidth', 'borderrightwidth', 'borderbottomwidth', 'borderleftwidth',
            'width', 'height',
            'maxwidth', 'maxheight',
            'minwidth', 'minheight',
        ]);
        function cssLength(obj) {
            if (u.isNumber(obj) || (u.isString(obj) && /^\d+$/.test(obj))) {
                return obj.toString() + "px";
            }
            else {
                return obj;
            }
        }
        function isVisible(element) {
            return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        }
        function isUpPrefixed(string) {
            return /^up-/.test(string);
        }
        function upAttrs(element) {
            let attrNames = u.filter(element.getAttributeNames(), isUpPrefixed);
            return u.mapObject(attrNames, (name) => [name, element.getAttribute(name)]);
        }
        function upClasses(element) {
            return u.filter(element.classList.values(), isUpPrefixed);
        }
        function cleanJQuery(element) {
            if (up.browser.canJQuery()) {
                jQuery(element).remove();
            }
        }
        function isEmpty(element) {
            return !element.children.length > 0 && !element.innerText.trim();
        }
        function crossOriginSelector(attr) {
            return `[${attr}*="//"]:not([${attr}*="//${location.host}/"])`;
        }
        return {
            subtree,
            contains,
            closestAttr,
            ancestor,
            around,
            get: getOne,
            list: getList,
            toggle,
            hide,
            show,
            metaContent,
            insertBefore,
            createFromSelector,
            setAttrs,
            setTemporaryAttrs,
            affix,
            idSelector,
            classSelector,
            isSingleton,
            attrSelector,
            tagName: elementTagName,
            createBrokenDocumentFromHTML,
            fixParserDamage,
            createFromHTML,
            get root() { return getRoot(); },
            paint,
            concludeCSSTransition,
            hasCSSTransition,
            fixedToAbsolute,
            setMissingAttrs,
            setMissingAttr,
            unwrap,
            wrapChildren,
            isWrapper,
            attr: stringAttr,
            booleanAttr,
            numberAttr,
            jsonAttr,
            callbackAttr,
            booleanOrStringAttr,
            setTemporaryStyle,
            style: computedStyle,
            styleNumber: computedStyleNumber,
            inlineStyle,
            setStyle: setInlineStyle,
            isVisible,
            upAttrs,
            upClasses,
            toggleAttr,
            addTemporaryClass,
            setTemporaryAttr,
            cleanJQuery,
            parseSelector,
            isEmpty,
            crossOriginSelector,
        };
    })();
    
    
    /***/ }),
    /* 8 */
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    // extracted by mini-css-extract-plugin
    
    
    /***/ }),
    /* 9 */
    /***/ (() => {
    
    up.Error = class Error extends window.Error {
        constructor(message, props = {}) {
            if (Array.isArray(message)) {
                message = up.util.sprintf(...message);
            }
            super(message);
            let name = 'up.' + this.constructor.name;
            Object.assign(this, { name }, props);
        }
    };
    
    
    /***/ }),
    /* 10 */
    /***/ (() => {
    
    up.NotImplemented = class NotImplemented extends up.Error {
    };
    
    
    /***/ }),
    /* 11 */
    /***/ (() => {
    
    up.Aborted = class Aborted extends up.Error {
        constructor(message) {
            super(message, { name: 'AbortError' });
        }
    };
    
    
    /***/ }),
    /* 12 */
    /***/ (() => {
    
    up.CannotMatch = class CannotMatch extends up.Error {
    };
    
    
    /***/ }),
    /* 13 */
    /***/ (() => {
    
    up.CannotParse = class CannotParse extends up.Error {
    };
    
    
    /***/ }),
    /* 14 */
    /***/ (() => {
    
    up.CannotTarget = class CannotTarget extends up.Error {
    };
    
    
    /***/ }),
    /* 15 */
    /***/ (() => {
    
    up.Offline = class Offline extends up.Error {
    };
    
    
    /***/ }),
    /* 16 */
    /***/ (() => {
    
    const u = up.util;
    up.Record = class Record {
        keys() {
            throw 'Return an array of keys';
        }
        defaults(_options) {
            return {};
        }
        constructor(options) {
            Object.assign(this, this.defaults(options), this.attributes(options));
        }
        attributes(source = this) {
            return u.pick(source, this.keys());
        }
        [u.copy.key]() {
            return u.variant(this);
        }
        [u.isEqual.key](other) {
            return (this.constructor === other.constructor) && u.isEqual(this.attributes(), other.attributes());
        }
    };
    
    
    /***/ }),
    /* 17 */
    /***/ (() => {
    
    const u = up.util;
    up.Config = class Config {
        constructor(blueprintFn = (() => ({}))) {
            this._blueprintFn = blueprintFn;
            this.reset();
            document.addEventListener('up:framework:reset', () => this.reset());
        }
        reset() {
            Object.assign(this, this._blueprintFn());
        }
        matches(element, prop) {
            return element.matches(this.selector(prop));
        }
        selector(prop) {
            let includes = this[prop];
            let excludes = this['no' + u.upperCaseFirst(prop)];
            let selector = `:is(${includes.join()})`;
            if (u.isPresent(excludes))
                selector += `:not(${excludes.join()})`;
            return selector;
        }
        selectorFn(prop) {
            return () => this.selector(prop);
        }
    };
    
    
    /***/ }),
    /* 18 */
    /***/ (() => {
    
    let enabledKey = 'up.log.enabled';
    let enabled = false;
    try {
        enabled = !!sessionStorage?.getItem(enabledKey);
    }
    catch {
    }
    up.LogConfig = class LogConfig extends up.Config {
        constructor() {
            super(() => ({
                banner: true,
                format: true,
            }));
        }
        get enabled() {
            return enabled;
        }
        set enabled(newEnabled) {
            enabled = newEnabled;
            try {
                sessionStorage?.setItem(enabledKey, newEnabled ? '1' : '');
            }
            catch {
            }
        }
    };
    
    
    /***/ }),
    /* 19 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.OptionsParser = class OptionsParser {
        constructor(element, options, parserOptions = {}) {
            this._options = options;
            this._element = element;
            this._parserOptions = parserOptions;
            this._fail = parserOptions.fail;
            this._closest = parserOptions.closest;
            this._attrPrefix = parserOptions.attrPrefix || 'up-';
            this._defaults = parserOptions.defaults || {};
        }
        string(key, keyOptions) {
            this.parse(e.attr, key, keyOptions);
        }
        boolean(key, keyOptions) {
            this.parse(e.booleanAttr, key, keyOptions);
        }
        number(key, keyOptions) {
            this.parse(e.numberAttr, key, keyOptions);
        }
        booleanOrString(key, keyOptions) {
            this.parse(e.booleanOrStringAttr, key, keyOptions);
        }
        json(key, keyOptions) {
            this.parse(e.jsonAttr, key, keyOptions);
        }
        callback(key, keyOptions = {}) {
            let parser = (link, attr) => e.callbackAttr(link, attr, keyOptions);
            this.parse(parser, key, keyOptions);
        }
        parse(attrValueFn, key, keyOptions = {}) {
            const attrNames = u.wrapList(keyOptions.attr ?? this._attrNameForKey(key));
            let value = this._options[key];
            for (let attrName of attrNames) {
                value ??= this._parseFromAttr(attrValueFn, this._element, attrName);
            }
            value ??= keyOptions.default ?? this._defaults[key];
            let normalizeFn = keyOptions.normalize;
            if (normalizeFn) {
                value = normalizeFn(value);
            }
            if (u.isDefined(value)) {
                this._options[key] = value;
            }
            let failKey;
            if (this._fail && (failKey = up.fragment.failKey(key))) {
                const failAttrNames = u.compact(u.map(attrNames, (attrName) => this._deriveFailAttrName(attrName)));
                this.parse(attrValueFn, failKey, { ...keyOptions, attr: failAttrNames });
            }
        }
        include(optionsFn) {
            let fnResult = optionsFn(this._element, this._options, this._parserOptions);
            Object.assign(this._options, fnResult);
        }
        _parseFromAttr(attrValueFn, element, attrName) {
            if (this._closest) {
                return e.closestAttr(element, attrName, attrValueFn);
            }
            else {
                return attrValueFn(element, attrName);
            }
        }
        _deriveFailAttrName(attr) {
            return this._deriveFailAttrNameForPrefix(attr, this._attrPrefix + 'on-') ||
                this._deriveFailAttrNameForPrefix(attr, this._attrPrefix);
        }
        _deriveFailAttrNameForPrefix(attr, prefix) {
            if (attr.startsWith(prefix)) {
                return `${prefix}fail-${attr.substring(prefix.length)}`;
            }
        }
        _attrNameForKey(option) {
            return `${this._attrPrefix}${u.camelToKebabCase(option)}`;
        }
    };
    
    
    /***/ }),
    /* 20 */
    /***/ (() => {
    
    const u = up.util;
    up.FIFOCache = class FIFOCache {
        constructor({ capacity = 10, normalizeKey = u.identity } = {}) {
            this._map = new Map();
            this._capacity = capacity;
            this._normalizeKey = normalizeKey;
        }
        get(key) {
            key = this._normalizeKey(key);
            return this._map.get(key);
        }
        set(key, value) {
            if (this._map.size === this._capacity) {
                let oldestKey = this._map.keys().next().value;
                this._map.delete(oldestKey);
            }
            key = this._normalizeKey(key);
            this._map.set(key, value);
        }
        clear() {
            this._map.clear();
        }
    };
    
    
    /***/ }),
    /* 21 */
    /***/ (() => {
    
    up.Rect = class Rect extends up.Record {
        keys() {
            return [
                'left',
                'top',
                'width',
                'height'
            ];
        }
        get bottom() {
            return this.top + this.height;
        }
        get right() {
            return this.left + this.width;
        }
        static fromElement(element) {
            return new (this)(element.getBoundingClientRect());
        }
    };
    
    
    /***/ }),
    /* 22 */
    /***/ (() => {
    
    const e = up.element;
    up.BodyShifter = class BodyShifter {
        constructor() {
            this._unshiftFns = [];
            this._anchoredElements = new Set();
            this._stack = 0;
        }
        lowerStack() {
            this._stack--;
            if (this._stack === 0) {
                this._unshiftNow();
            }
        }
        raiseStack() {
            this._stack++;
            if (this._stack === 1) {
                this._shiftNow();
            }
        }
        onAnchoredElementInserted(element) {
            this._anchoredElements.add(element);
            if (this._isShifted()) {
                this._shiftAnchoredElement(element);
            }
            return () => this._anchoredElements.delete(element);
        }
        _isShifted() {
            return this._scrollbarTookSpace && this._stack > 0;
        }
        _shiftNow() {
            this._scrollbarWidth = up.viewport.scrollbarWidth();
            this._scrollbarTookSpace = up.viewport.rootHasReducedWidthFromScrollbar();
            if (!this._scrollbarTookSpace)
                return;
            this._shiftBody();
            for (let element of this._anchoredElements) {
                this._shiftAnchoredElement(element);
            }
        }
        _shiftBody() {
            const overflowElement = up.viewport.rootOverflowElement();
            this._changeStyle(overflowElement, { overflowY: 'hidden' });
            const { body } = document;
            const bodyRightPadding = e.styleNumber(body, 'paddingRight');
            const bodyRightShift = this._scrollbarWidth + bodyRightPadding;
            this._changeStyle(body, { paddingRight: bodyRightShift });
        }
        _shiftAnchoredElement(element) {
            const elementRight = e.styleNumber(element, 'right');
            const elementRightShift = this._scrollbarWidth + elementRight;
            this._changeStyle(element, { right: elementRightShift });
        }
        _changeStyle(element, styles) {
            this._unshiftFns.push(e.setTemporaryStyle(element, styles));
        }
        _unshiftNow() {
            let unshiftFn;
            while (unshiftFn = this._unshiftFns.pop()) {
                unshiftFn();
            }
        }
    };
    
    
    /***/ }),
    /* 23 */
    /***/ (() => {
    
    const u = up.util;
    up.Change = class Change {
        constructor(options) {
            this.options = options;
        }
        execute() {
            throw new up.NotImplemented();
        }
        onFinished(renderResult) {
            return this.options.onFinished?.(renderResult);
        }
        improveHistoryValue(existingValue, newValue) {
            if ((existingValue === false) || u.isString(existingValue)) {
                return existingValue;
            }
            else {
                return newValue;
            }
        }
        deriveFailOptions() {
            return up.RenderOptions.deriveFailOptions(this.options);
        }
    };
    
    
    /***/ }),
    /* 24 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.Change.Addition = class Addition extends up.Change {
        constructor(options) {
            super(options);
            this._acceptLayer = options.acceptLayer;
            this._dismissLayer = options.dismissLayer;
            this._eventPlans = options.eventPlans || [];
            this._response = options.response;
        }
        handleLayerChangeRequests() {
            if (this.layer.isOverlay()) {
                this.tryAcceptLayerFromServer();
                this.abortWhenLayerClosed();
                this.layer.tryAcceptForLocation(this.responseOption());
                this.abortWhenLayerClosed();
                this.tryDismissLayerFromServer();
                this.abortWhenLayerClosed();
                this.layer.tryDismissForLocation(this.responseOption());
                this.abortWhenLayerClosed();
            }
            this.layer.asCurrent(() => {
                for (let eventPlan of this._eventPlans) {
                    up.emit({ ...eventPlan, ...this.responseOption() });
                    this.abortWhenLayerClosed();
                }
            });
        }
        tryAcceptLayerFromServer() {
            if (u.isDefined(this._acceptLayer) && this.layer.isOverlay()) {
                this.layer.accept(this._acceptLayer, this.responseOption());
            }
        }
        tryDismissLayerFromServer() {
            if (u.isDefined(this._dismissLayer) && this.layer.isOverlay()) {
                this.layer.dismiss(this._dismissLayer, this.responseOption());
            }
        }
        abortWhenLayerClosed(layer = this.layer) {
            if (layer.isClosed()) {
                throw new up.Aborted('Layer was closed');
            }
        }
        setSource({ oldElement, newElement, source }) {
            if (source === 'keep') {
                source = (oldElement && up.fragment.source(oldElement));
            }
            if (source) {
                e.setMissingAttr(newElement, 'up-source', u.normalizeURL(source, { hash: false }));
            }
        }
        setTime({ newElement, time }) {
            e.setMissingAttr(newElement, 'up-time', time ? time.toUTCString() : false);
        }
        setETag({ newElement, etag }) {
            e.setMissingAttr(newElement, 'up-etag', etag || false);
        }
        setReloadAttrs(options) {
            this.setSource(options);
            this.setTime(options);
            this.setETag(options);
        }
        responseOption() {
            return { response: this._response };
        }
        executeSteps(steps, responseDoc, noneOptions) {
            return new up.Change.UpdateSteps({ steps, noneOptions }).execute(responseDoc);
        }
    };
    
    
    /***/ }),
    /* 25 */
    /***/ (() => {
    
    var _a;
    const u = up.util;
    up.RenderJob = (_a = class RenderJob {
            constructor(options) {
                this.options = up.RenderOptions.preprocess(options);
            }
            execute() {
                this._rendered = this._executePromise();
                return this;
            }
            async _executePromise() {
                try {
                    this._guardRender();
                    let result = await this._getChange().execute();
                    this._handleResult(result);
                    return result;
                }
                catch (resultOrError) {
                    this._handleResult(resultOrError) || this._handleError(resultOrError);
                    throw resultOrError;
                }
            }
            _handleResult(result) {
                if (result instanceof up.RenderResult) {
                    let { onRendered, onFinished } = result.options;
                    if (!result.none)
                        up.error.guard(() => onRendered?.(result));
                    let guardedOnFinished = function (result) {
                        up.error.guard(() => onFinished?.(result));
                    };
                    this.finished.then(guardedOnFinished, u.noop);
                    return true;
                }
            }
            _handleError(error) {
                let prefix = error instanceof up.Aborted ? 'Rendering was aborted' : 'Error while rendering';
                up.puts('up.render()', `${prefix}: ${error.name}: ${error.message}`);
                up.error.guard(() => this.options.onError?.(error));
            }
            get finished() {
                return this._awaitFinished();
            }
            async _awaitFinished() {
                try {
                    let result = await this._rendered;
                    return await result.finished;
                }
                catch (error) {
                    if (error instanceof up.RenderResult) {
                        throw await error.finished;
                    }
                    else {
                        throw error;
                    }
                }
            }
            _getChange() {
                if (this.options.url) {
                    let onRequest = (request) => this._handleAbortOption(request);
                    return new up.Change.FromURL({ ...this.options, onRequest });
                }
                else if (this.options.response) {
                    let onRender = () => this._handleAbortOption(null);
                    return new up.Change.FromResponse({ ...this.options, onRender });
                }
                else {
                    let onRender = () => this._handleAbortOption(null);
                    return new up.Change.FromContent({ ...this.options, onRender });
                }
            }
            _guardRender() {
                up.browser.assertConfirmed(this.options);
                let guardEvent = u.pluckKey(this.options, 'guardEvent');
                if (guardEvent) {
                    guardEvent.renderOptions = this.options;
                    if (up.emit(guardEvent, { target: this.options.origin }).defaultPrevented) {
                        throw new up.Aborted(`Rendering was prevented by ${guardEvent.type} listener`);
                    }
                }
                up.RenderOptions.assertContentGiven(this.options);
            }
            _handleAbortOption(request) {
                let { abort } = this.options;
                if (!abort || !up.network.isBusy())
                    return;
                let { fragments, layer, origin, newLayer } = this._getChange().getPreflightProps();
                let abortOptions = {
                    except: request,
                    logOnce: ['up.render()', 'Change with { abort } option will abort other requests'],
                    newLayer,
                    origin,
                };
                if (abort === 'target') {
                    up.fragment.abort(fragments, abortOptions);
                }
                else if (abort === 'layer') {
                    up.fragment.abort({ ...abortOptions, layer });
                }
                else if (abort === 'all' || abort === true) {
                    up.fragment.abort({ ...abortOptions, layer: 'any' });
                }
                else if (u.isFunction(abort)) {
                    abort(abortOptions);
                }
                else {
                    up.fragment.abort(abort, { ...abortOptions, layer });
                }
            }
        },
        (() => {
            u.delegate(_a.prototype, ['then', 'catch', 'finally'], function () { return this._rendered; });
            u.memoizeMethod(_a.prototype, {
                _awaitFinished: true,
                _getChange: true,
            });
        })(),
        _a);
    
    
    /***/ }),
    /* 26 */
    /***/ (() => {
    
    up.Change.Removal = class Removal extends up.Change {
    };
    
    
    /***/ }),
    /* 27 */
    /***/ (() => {
    
    up.Change.DestroyFragment = class DestroyFragment extends up.Change.Removal {
        constructor(options) {
            super(options);
            this._layer = up.layer.get(options) || up.layer.current;
            this._element = this.options.element;
            this._animation = this.options.animation;
            this._log = this.options.log;
        }
        execute() {
            this._parent = this._element.parentNode;
            up.fragment.markAsDestroying(this._element);
            if (up.motion.willAnimate(this._element, this._animation, this.options)) {
                this._destroyAfterAnimation();
            }
            else {
                this._destroyNow();
            }
        }
        async _destroyAfterAnimation() {
            this._emitDestroyed();
            await this._animate();
            this._wipe();
            this.onFinished();
        }
        _destroyNow() {
            this._wipe();
            this._emitDestroyed();
            this.onFinished();
        }
        _animate() {
            return up.motion.animate(this._element, this._animation, this.options);
        }
        _wipe() {
            this._layer.asCurrent(() => {
                up.fragment.abort(this._element);
                up.script.clean(this._element, { layer: this._layer });
                up.element.cleanJQuery(this._element);
                this._element.remove();
            });
        }
        _emitDestroyed() {
            up.fragment.emitDestroyed(this._element, { parent: this._parent, log: this._log });
        }
    };
    
    
    /***/ }),
    /* 28 */
    /***/ (() => {
    
    let u = up.util;
    up.Change.OpenLayer = class OpenLayer extends up.Change.Addition {
        constructor(options) {
            super(options);
            this.target = options.target;
            this._origin = options.origin;
            this._baseLayer = options.baseLayer;
        }
        getPreflightProps() {
            return {
                mode: this.options.mode,
                context: this._buildLayer().context,
                origin: this.options.origin,
                target: this.target,
                layer: this._baseLayer,
                fragments: u.compact([up.fragment.get(':main', { layer: this._baseLayer })]),
                newLayer: true,
            };
        }
        execute(responseDoc, onApplicable) {
            this.responseDoc = responseDoc;
            this._matchPostflight();
            onApplicable();
            this._createOverlay();
            let unbindClosing = this.layer.on('up:layer:accepting up:layer:dimissing', this._renderOtherLayers.bind(this));
            try {
                this._renderOverlayContent();
                this._renderOtherLayers();
                return up.RenderResult.both(this._newOverlayResult, this._otherLayersResult);
            }
            finally {
                unbindClosing();
            }
        }
        _matchPostflight() {
            if (this.target === ':none') {
                this._content = document.createElement('up-none');
            }
            else {
                this._content = this.responseDoc.select(this.target);
            }
            if (!this._content || this._baseLayer.isClosed()) {
                throw new up.CannotMatch();
            }
        }
        _createOverlay() {
            up.puts('up.render()', `Opening element "${this.target}" in new overlay`);
            this._assertOpenEventEmitted();
            this.layer = this._buildLayer();
            this._baseLayer.peel({ history: !this.layer.history });
            up.layer.stack.push(this.layer);
            this.layer.createElements();
            this.layer.setupHandlers();
        }
        _renderOverlayContent() {
            this._handleHistory();
            this.handleLayerChangeRequests();
            this.responseDoc.commitElement(this._content);
            this.layer.setContent(this._content);
            this.setReloadAttrs({ newElement: this._content, source: this.options.source });
            this.responseDoc.finalizeElement(this._content);
            this._newOverlayResult = new up.RenderResult({
                layer: this.layer,
                fragments: [this._content],
                target: this.target,
            });
            up.hello(this.layer.element, { ...this.options, layer: this.layer });
            this._handleScroll();
            this._newOverlayResult.finished = this._finish();
            this.layer.opening = false;
            this._emitOpenedEvent();
            this.abortWhenLayerClosed();
        }
        _renderOtherLayers() {
            if (this._otherLayersResult)
                return;
            let otherLayerSteps = this._getHungrySteps().other;
            this._otherLayersResult = this.executeSteps(otherLayerSteps, this.responseDoc);
        }
        async _finish() {
            await this.layer.startOpenAnimation();
            this.abortWhenLayerClosed();
            this._handleFocus();
            return this._newOverlayResult;
        }
        _buildLayer() {
            const buildOptions = { ...this.options, opening: true };
            const beforeNew = optionsWithLayerDefaults => {
                return this.options = up.RenderOptions.finalize(optionsWithLayerDefaults);
            };
            return up.layer.build(buildOptions, beforeNew);
        }
        _handleHistory() {
            if (this.layer.history === 'auto') {
                this.layer.history = up.fragment.hasAutoHistory([this._content], this.layer);
            }
            let { parent } = this.layer;
            this.layer.history &&= parent.history;
            parent.saveHistory();
            this.layer.updateHistory(this.options);
        }
        _handleFocus() {
            this._baseLayer.overlayFocus?.moveToBack();
            this.layer.overlayFocus.moveToFront();
            const fragmentFocus = new up.FragmentFocus({
                fragment: this._content,
                layer: this.layer,
                autoMeans: ['autofocus', 'layer'],
                inputDevice: this.options.inputDevice,
            });
            fragmentFocus.process(this.options.focus);
        }
        _handleScroll() {
            const scrollingOptions = {
                ...this.options,
                fragment: this._content,
                layer: this.layer,
                autoMeans: ['hash', 'layer']
            };
            const scrolling = new up.FragmentScrolling(scrollingOptions);
            scrolling.process(this.options.scroll);
        }
        _assertOpenEventEmitted() {
            up.event.assertEmitted('up:layer:open', {
                origin: this._origin,
                baseLayer: this._baseLayer,
                layerOptions: this.options,
                log: "Opening new overlay"
            });
        }
        _emitOpenedEvent() {
            this.layer.emit('up:layer:opened', {
                origin: this._origin,
                callback: this.layer.callback('onOpened'),
                log: `Opened new ${this.layer}`
            });
        }
        _getHungrySteps() {
            return up.radio.hungrySteps(this._getEffectiveRenderOptions());
        }
        _getEffectiveRenderOptions() {
            return {
                ...this.options,
                layer: this.layer,
                history: this.layer.history,
            };
        }
    };
    
    
    /***/ }),
    /* 29 */
    /***/ (() => {
    
    var _a;
    const u = up.util;
    up.Change.UpdateLayer = (_a = class UpdateLayer extends up.Change.Addition {
            constructor(options) {
                options = up.RenderOptions.finalize(options);
                super(options);
                this.layer = options.layer;
                this.target = options.target;
                this._context = options.context;
                this._steps = up.fragment.parseTargetSteps(this.target, this.options);
            }
            getPreflightProps() {
                this._matchPreflight();
                return {
                    layer: this.layer,
                    mode: this.layer.mode,
                    context: u.merge(this.layer.context, this._context),
                    origin: this.options.origin,
                    target: this._bestPreflightSelector(),
                    fragments: this._getFragments(),
                    newLayer: false,
                };
            }
            _bestPreflightSelector() {
                this._matchPreflight();
                return up.fragment.targetForSteps(this._steps);
            }
            _getFragments() {
                this._matchPreflight();
                return u.map(this._steps, 'oldElement');
            }
            execute(responseDoc, onApplicable) {
                this.responseDoc = responseDoc;
                this._matchPostflight();
                onApplicable();
                let unbindClosing = this.layer.on('up:layer:accepting up:layer:dimissing', this._renderOtherLayers.bind(this));
                try {
                    this._renderCurrentLayer();
                    this._renderOtherLayers();
                    return up.RenderResult.both(this._currentLayerResult, this._otherLayersResult);
                }
                finally {
                    unbindClosing();
                }
            }
            _renderCurrentLayer() {
                if (this._steps.length) {
                    up.puts('up.render()', `Updating "${this._bestPreflightSelector()}" in ${this.layer}`);
                }
                this._setScrollAndFocusOptions();
                if (this.options.saveScroll) {
                    up.viewport.saveScroll({ layer: this.layer });
                }
                if (this.options.saveFocus) {
                    up.viewport.saveFocus({ layer: this.layer });
                }
                if (this.options.peel) {
                    this.layer.peel({ history: !this._hasHistory() });
                }
                if (this.options.abort !== false) {
                    up.fragment.abort(this._getFragments(), { reason: 'Fragment is being replaced' });
                }
                Object.assign(this.layer.context, this._context);
                if (this._hasHistory()) {
                    this.layer.updateHistory(this.options);
                }
                this.handleLayerChangeRequests();
                this._currentLayerResult = this.executeSteps(this._steps, this.responseDoc, this.options);
            }
            _renderOtherLayers() {
                if (this._otherLayersResult)
                    return;
                let otherLayerSteps = this._getHungrySteps().other;
                this._otherLayersResult = this.executeSteps(otherLayerSteps, this.responseDoc);
            }
            _matchPreflight() {
                this._matchOldElements();
                this._compressNestedSteps();
            }
            _matchPostflight() {
                this._matchOldElements();
                this._addHungryStepsOnCurrentLayer();
                this._compressNestedSteps();
                this._matchNewElements();
            }
            _addHungryStepsOnCurrentLayer() {
                this._steps.push(...this._getHungrySteps().current);
            }
            _matchOldElements() {
                this._steps = this._steps.filter((step) => {
                    const finder = new up.FragmentFinder(u.pick(step, ['selector', 'origin', 'layer', 'match', 'preferOldElements']));
                    step.oldElement ||= finder.find();
                    if (step.oldElement) {
                        return true;
                    }
                    else if (!step.maybe) {
                        throw new up.CannotMatch();
                    }
                });
            }
            _matchNewElements() {
                this._steps = this.responseDoc.selectSteps(this._steps);
            }
            _compressNestedSteps() {
                this._steps = up.fragment.compressNestedSteps(this._steps);
            }
            _getHungrySteps() {
                return up.radio.hungrySteps(this._getEffectiveRenderOptions());
            }
            _setScrollAndFocusOptions() {
                let focusCapsule = up.FocusCapsule.preserve(this.layer);
                this._steps.forEach((step, i) => {
                    step.focusCapsule = focusCapsule;
                    if (i > 0) {
                        step.scroll = false;
                        step.focus = false;
                    }
                    if ((step.placement === 'swap') || (step.placement === 'content')) {
                        step.scrollBehavior = 'instant';
                    }
                });
            }
            _hasHistory() {
                return u.evalAutoOption(this.options.history, this._hasAutoHistory.bind(this));
            }
            _hasAutoHistory() {
                const oldFragments = u.map(this._steps, 'oldElement');
                return up.fragment.hasAutoHistory(oldFragments, this.layer);
            }
            _getEffectiveRenderOptions() {
                return {
                    ...this.options,
                    layer: this.layer,
                    history: this._hasHistory(),
                };
            }
        },
        (() => {
            u.memoizeMethod(_a.prototype, {
                _matchPreflight: true,
                _matchOldElements: true,
                _hasHistory: true,
                _getHungrySteps: true,
            });
        })(),
        _a);
    
    
    /***/ }),
    /* 30 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.Change.UpdateSteps = class UpdateSteps extends up.Change.Addition {
        constructor(options) {
            super(options);
            this._noneOptions = options.noneOptions || {};
            this._steps = u.copy(options.steps);
        }
        execute(responseDoc) {
            this.responseDoc = responseDoc;
            this._steps = responseDoc.selectSteps(this._steps);
            this._steps = responseDoc.commitSteps(this._steps);
            if (!this._steps.length) {
                return this._executeNone();
            }
            this.renderResult = new up.RenderResult({
                layer: this._steps[0]?.layer,
                target: up.fragment.targetForSteps(this._steps),
            });
            this._steps.reverse();
            const motionEndPromises = this._steps.map(step => this._executeStep(step));
            this.renderResult.finished = this._finish(motionEndPromises);
            return this.renderResult;
        }
        _executeNone() {
            this._handleFocus(null, this._noneOptions);
            this._handleScroll(null, this._noneOptions);
            return up.RenderResult.buildNone();
        }
        async _finish(motionEndPromises) {
            await Promise.all(motionEndPromises);
            for (let step of this._steps) {
                this.abortWhenLayerClosed(step.layer);
            }
            return this.renderResult;
        }
        _addToResult(fragment) {
            let newFragments = fragment.matches('up-wrapper') ? fragment.children : [fragment];
            this.renderResult.fragments.unshift(...newFragments);
        }
        _executeStep(step) {
            this.setReloadAttrs(step);
            switch (step.placement) {
                case 'swap': {
                    let keepPlan = this._findKeepPlan(step);
                    if (keepPlan) {
                        this._handleFocus(step.oldElement, step);
                        this._handleScroll(step.oldElement, step);
                        return Promise.resolve();
                    }
                    else {
                        this._preserveKeepables(step);
                        const parent = step.oldElement.parentNode;
                        const morphOptions = {
                            ...step,
                            beforeStart() {
                                up.fragment.markAsDestroying(step.oldElement);
                            },
                            afterInsert: () => {
                                this._restoreKeepables(step);
                                this.responseDoc.finalizeElement(step.newElement);
                                this._unmarkKeepables(step);
                                up.hello(step.newElement, step);
                                this._addToResult(step.newElement);
                            },
                            beforeDetach: () => {
                                up.script.clean(step.oldElement, { layer: step.layer });
                            },
                            afterDetach() {
                                up.element.cleanJQuery();
                                up.fragment.emitDestroyed(step.oldElement, { parent, log: false });
                            },
                            scrollNew: () => {
                                this._handleFocus(step.newElement, step);
                                this._handleScroll(step.newElement, step);
                            }
                        };
                        return up.morph(step.oldElement, step.newElement, step.transition, morphOptions);
                    }
                }
                case 'content': {
                    let oldWrapper = e.wrapChildren(step.oldElement);
                    let newWrapper = e.wrapChildren(step.newElement);
                    let wrapperStep = {
                        ...step,
                        placement: 'swap',
                        oldElement: oldWrapper,
                        newElement: newWrapper,
                        focus: false
                    };
                    return this._executeStep(wrapperStep).then(() => {
                        e.unwrap(newWrapper);
                        this._handleFocus(step.oldElement, step);
                    });
                }
                case 'before':
                case 'after': {
                    let wrapper = e.wrapChildren(step.newElement);
                    let position = step.placement === 'before' ? 'afterbegin' : 'beforeend';
                    step.oldElement.insertAdjacentElement(position, wrapper);
                    this.responseDoc.finalizeElement(wrapper);
                    up.hello(wrapper, step);
                    this._addToResult(wrapper);
                    this._handleFocus(wrapper, step);
                    this._handleScroll(wrapper, step);
                    return up.animate(wrapper, step.transition, step).then(() => e.unwrap(wrapper));
                }
                default: {
                    up.fail('Unknown placement: %o', step.placement);
                }
            }
        }
        _findKeepPlan(options) {
            if (!options.useKeep) {
                return;
            }
            const { oldElement, newElement } = options;
            let doKeep = e.booleanAttr(oldElement, 'up-keep');
            if (!doKeep) {
                return;
            }
            let partner;
            let partnerSelector = up.fragment.toTarget(oldElement);
            const lookupOpts = { layer: options.layer };
            if (options.descendantsOnly) {
                partner = up.fragment.get(newElement, partnerSelector, lookupOpts);
            }
            else {
                partner = up.fragment.subtree(newElement, partnerSelector, lookupOpts)[0];
            }
            if (partner && e.booleanAttr(partner, 'up-keep') !== false) {
                const plan = {
                    oldElement,
                    newElement: partner,
                    newData: up.script.data(partner),
                    renderOptions: options,
                };
                if (!up.fragment.emitKeep(plan).defaultPrevented) {
                    return plan;
                }
            }
        }
        _preserveKeepables(step) {
            const keepPlans = [];
            if (step.useKeep) {
                for (let keepable of step.oldElement.querySelectorAll('[up-keep]')) {
                    let keepPlan = this._findKeepPlan({ ...step, oldElement: keepable, descendantsOnly: true });
                    if (keepPlan) {
                        const keepableClone = keepable.cloneNode(true);
                        keepable.insertAdjacentElement('beforebegin', keepableClone);
                        keepable.classList.add('up-keeping');
                        up.script.disableSubtree(keepPlan.newElement);
                        let viewports = up.viewport.subtree(keepPlan.oldElement);
                        keepPlan.revivers = viewports.map(function (viewport) {
                            let cursorProps = up.viewport.copyCursorProps(viewport);
                            return () => up.viewport.copyCursorProps(cursorProps, viewport);
                        });
                        if (this._willChangeElement(document.body)) {
                            keepPlan.newElement.replaceWith(keepable);
                        }
                        else {
                            document.body.append(keepable);
                        }
                        keepPlans.push(keepPlan);
                    }
                }
            }
            step.keepPlans = keepPlans;
        }
        _restoreKeepables(step) {
            for (let keepPlan of step.keepPlans) {
                keepPlan.newElement.replaceWith(keepPlan.oldElement);
                for (let reviver of keepPlan.revivers) {
                    reviver();
                }
            }
        }
        _unmarkKeepables(step) {
            for (let keepPlan of step.keepPlans) {
                keepPlan.oldElement.classList.remove('up-keeping');
            }
        }
        _willChangeElement(element) {
            return u.some(this._steps, (step) => step.oldElement.contains(element));
        }
        _handleFocus(fragment, options) {
            const fragmentFocus = new up.FragmentFocus({
                ...options,
                fragment,
                autoMeans: up.fragment.config.autoFocus,
            });
            return fragmentFocus.process(options.focus);
        }
        _handleScroll(fragment, options) {
            const scrolling = new up.FragmentScrolling({
                ...options,
                fragment,
                autoMeans: up.fragment.config.autoScroll
            });
            return scrolling.process(options.scroll);
        }
    };
    
    
    /***/ }),
    /* 31 */
    /***/ (() => {
    
    const u = up.util;
    up.Change.CloseLayer = class CloseLayer extends up.Change.Removal {
        constructor(options) {
            super(options);
            this._verb = options.verb;
            this._layer = up.layer.get(options);
            this._origin = options.origin;
            this._value = options.value;
            this._preventable = options.preventable ?? true;
            this._response = options.response;
            this._history = options.history ?? true;
        }
        execute() {
            if (!this._layer.isOpen()) {
                return Promise.resolve();
            }
            up.browser.assertConfirmed(this.options);
            if (this._emitCloseEvent().defaultPrevented && this._preventable) {
                throw new up.Aborted('Close event was prevented');
            }
            this._emitClosingEvent();
            up.fragment.abort({ reason: 'Layer is closing', layer: this._layer });
            const { parent } = this._layer;
            this._layer.peel();
            this._layer.stack.remove(this._layer);
            if (this._history) {
                parent.restoreHistory();
            }
            this._handleFocus(parent);
            this._layer.teardownHandlers();
            this._layer.destroyElements(this.options);
            this._emitClosedEvent(parent);
        }
        _emitCloseEvent() {
            let event = this._layer.emit(this._buildEvent(`up:layer:${this._verb}`), {
                callback: this._layer.callback(`on${u.upperCaseFirst(this._verb)}`),
                log: [`Will ${this._verb} ${this._layer} with value %o`, this._value]
            });
            this._value = event.value;
            return event;
        }
        _emitClosingEvent() {
            let event = this._buildEvent(`up:layer:${this._verb}ing`);
            this._layer.emit(event, { log: false });
        }
        _emitClosedEvent(formerParent) {
            const verbPast = `${this._verb}ed`;
            const verbPastUpperCaseFirst = u.upperCaseFirst(verbPast);
            return this._layer.emit(this._buildEvent(`up:layer:${verbPast}`), {
                baseLayer: formerParent,
                callback: this._layer.callback(`on${verbPastUpperCaseFirst}`),
                ensureBubbles: true,
                log: [`${verbPastUpperCaseFirst} ${this._layer} with value %o`, this._value]
            });
        }
        _buildEvent(name) {
            return up.event.build(name, {
                layer: this._layer,
                value: this._value,
                origin: this._origin,
                response: this._response,
            });
        }
        _handleFocus(formerParent) {
            this._layer.overlayFocus.teardown();
            formerParent.overlayFocus?.moveToFront();
            let newFocusElement = this._layer.origin || formerParent.element;
            up.focus(newFocusElement, { preventScroll: true });
        }
    };
    
    
    /***/ }),
    /* 32 */
    /***/ (() => {
    
    var _a;
    const u = up.util;
    up.Change.FromURL = (_a = class FromURL extends up.Change {
            constructor(options) {
                super(options);
                this.options.layer = up.layer.getAll(this.options);
                this.options.normalizeLayerOptions = false;
            }
            execute() {
                let _newPageReason = this._newPageReason();
                if (_newPageReason) {
                    up.puts('up.render()', _newPageReason);
                    up.network.loadPage(this.options);
                    return u.unresolvablePromise();
                }
                this.request = up.request(this._getRequestAttrs());
                this.options.onRequest?.(this.request);
                up.feedback.showAroundRequest(this.request, this.options);
                up.form.disableWhile(this.request, this.options);
                if (this.options.preload) {
                    return this.request;
                }
                return u.always(this.request, responseOrError => this._onRequestSettled(responseOrError));
            }
            _newPageReason() {
                if (u.isCrossOrigin(this.options.url)) {
                    return 'Loading cross-origin content in new page';
                }
                if (this.options.history && !up.browser.canPushState()) {
                    return 'Loading content in new page to restore history support';
                }
            }
            _getRequestAttrs() {
                const successAttrs = this._preflightPropsForRenderOptions(this.options);
                const failAttrs = this._preflightPropsForRenderOptions(this.deriveFailOptions(), { optional: true });
                return {
                    ...this.options,
                    ...successAttrs,
                    ...u.renameKeys(failAttrs, up.fragment.failKey)
                };
            }
            getPreflightProps() {
                return this._getRequestAttrs();
            }
            _preflightPropsForRenderOptions(renderOptions, requestAttributesOptions) {
                const preview = new up.Change.FromContent({ ...renderOptions, preview: true });
                return preview.getPreflightProps(requestAttributesOptions);
            }
            _onRequestSettled(response) {
                if (response instanceof up.Response) {
                    return this._onRequestSettledWithResponse(response);
                }
                else {
                    return this._onRequestSettledWithError(response);
                }
            }
            _onRequestSettledWithResponse(response) {
                return new up.Change.FromResponse({ ...this.options, response }).execute();
            }
            _onRequestSettledWithError(error) {
                if (error instanceof up.Offline) {
                    this.request.emit('up:fragment:offline', {
                        callback: this.options.onOffline,
                        renderOptions: this.options,
                        retry: (retryOptions) => up.render({ ...this.options, ...retryOptions }),
                        log: ['Cannot load fragment from %s: %s', this.request.description, error.reason],
                    });
                }
                throw error;
            }
        },
        (() => {
            u.memoizeMethod(_a.prototype, {
                _getRequestAttrs: true,
            });
        })(),
        _a);
    
    
    /***/ }),
    /* 33 */
    /***/ (() => {
    
    var _a;
    const u = up.util;
    up.Change.FromResponse = (_a = class FromResponse extends up.Change {
            constructor(options) {
                super(options);
                this._response = options.response;
                this._request = this._response.request;
            }
            execute() {
                if (up.fragment.config.skipResponse(this._loadedEventProps())) {
                    this._skip();
                }
                else {
                    this._request.assertEmitted('up:fragment:loaded', {
                        ...this._loadedEventProps(),
                        callback: this.options.onLoaded,
                        log: ['Loaded fragment from %s', this._response.description],
                        skip: () => this._skip()
                    });
                }
                let fail = u.evalOption(this.options.fail, this._response) ?? !this._response.ok;
                if (fail) {
                    throw this._updateContentFromResponse(this.deriveFailOptions());
                }
                return this._updateContentFromResponse(this.options);
            }
            _skip() {
                up.puts('up.render()', 'Skipping ' + this._response.description);
                this.options.target = ':none';
                this.options.failTarget = ':none';
            }
            _updateContentFromResponse(finalRenderOptions) {
                if (finalRenderOptions.failPrefixForced) {
                    up.puts('up.render()', 'Rendering failed response using fail-prefixed options (https://unpoly.com/failed-responses)');
                }
                this._augmentOptionsFromResponse(finalRenderOptions);
                finalRenderOptions.meta = this._compilerPassMeta();
                let result = new up.Change.FromContent(finalRenderOptions).execute();
                result.finished = this.finish(result, finalRenderOptions);
                return result;
            }
            async finish(renderResult, originalRenderOptions) {
                renderResult = await renderResult.finished;
                if (up.fragment.shouldRevalidate(this._request, this._response, originalRenderOptions)) {
                    renderResult = await this._revalidate(renderResult, originalRenderOptions);
                }
                return renderResult;
            }
            async _revalidate(renderResult, originalRenderOptions) {
                let inputTarget = originalRenderOptions.target;
                let effectiveTarget = renderResult.target;
                if (/:(before|after)/.test(inputTarget)) {
                    up.warn('up.render()', 'Cannot revalidate cache when prepending/appending (target %s)', inputTarget);
                }
                else {
                    up.puts('up.render()', 'Revalidating cached response for target "%s"', effectiveTarget);
                    let verifyResult = await up.reload(effectiveTarget, {
                        ...originalRenderOptions,
                        preferOldElements: renderResult.fragments,
                        layer: renderResult.layer,
                        onFinished: null,
                        scroll: false,
                        focus: 'keep',
                        transition: false,
                        cache: false,
                        confirm: false,
                        feedback: false,
                        abort: false,
                        expiredResponse: this._response,
                    });
                    if (!verifyResult.none) {
                        renderResult = verifyResult;
                    }
                }
                return renderResult;
            }
            _loadedEventProps() {
                const { expiredResponse } = this.options;
                return {
                    request: this._request,
                    response: this._response,
                    renderOptions: this.options,
                    revalidating: !!expiredResponse,
                    expiredResponse,
                };
            }
            _compilerPassMeta() {
                let meta = { revalidating: !!this.options.expiredResponse };
                up.migrate.processCompilerPassMeta?.(meta, this._response);
                return meta;
            }
            _augmentOptionsFromResponse(renderOptions) {
                const responseURL = this._response.url;
                let serverLocation = responseURL;
                let hash = this._request.hash;
                if (hash) {
                    renderOptions.hash = hash;
                    serverLocation += hash;
                }
                const isReloadable = (this._response.method === 'GET');
                if (isReloadable) {
                    renderOptions.source = this.improveHistoryValue(renderOptions.source, responseURL);
                }
                else {
                    renderOptions.source = this.improveHistoryValue(renderOptions.source, 'keep');
                    renderOptions.history = !!renderOptions.location;
                }
                renderOptions.location = this.improveHistoryValue(renderOptions.location, serverLocation);
                renderOptions.title = this.improveHistoryValue(renderOptions.title, this._response.title);
                renderOptions.eventPlans = this._response.eventPlans;
                let serverTarget = this._response.target;
                if (serverTarget) {
                    renderOptions.target = serverTarget;
                }
                renderOptions.acceptLayer = this._response.acceptLayer;
                renderOptions.dismissLayer = this._response.dismissLayer;
                renderOptions.document = this._response.text;
                if (this._response.none) {
                    renderOptions.target = ':none';
                }
                renderOptions.context = u.merge(renderOptions.context, this._response.context);
                renderOptions.cspNonces = this._response.cspNonces;
                renderOptions.time ??= this._response.lastModified;
                renderOptions.etag ??= this._response.etag;
            }
        },
        (() => {
            u.memoizeMethod(_a.prototype, {
                _loadedEventProps: true,
            });
        })(),
        _a);
    
    
    /***/ }),
    /* 34 */
    /***/ (() => {
    
    var _a;
    const u = up.util;
    up.Change.FromContent = (_a = class FromContent extends up.Change {
            constructor(options) {
                super(options);
                this._origin = this.options.origin;
                this._preview = this.options.preview;
            }
            _getPlans() {
                let plans = [];
                this._lookupLayers();
                this._improveOptionsFromResponseDoc();
                this._expandIntoPlans(plans, this._layers, this.options.target);
                this._expandIntoPlans(plans, this._layers, this.options.fallback);
                return plans;
            }
            _isRenderableLayer(layer) {
                return (layer === 'new') || layer.isOpen();
            }
            _lookupLayers() {
                this._allLayers = up.layer.getAll(this.options);
                this._layers = u.filter(this._allLayers, this._isRenderableLayer);
            }
            _expandIntoPlans(plans, layers, targets) {
                for (let layer of layers) {
                    for (let target of this._expandTargets(targets, layer)) {
                        const props = { ...this.options, target, layer, defaultPlacement: this._defaultPlacement() };
                        const change = layer === 'new' ? new up.Change.OpenLayer(props) : new up.Change.UpdateLayer(props);
                        plans.push(change);
                    }
                }
            }
            _expandTargets(targets, layer) {
                return up.fragment.expandTargets(targets, { layer, mode: this.options.mode, origin: this._origin });
            }
            execute() {
                if (this.options.preload) {
                    return Promise.resolve();
                }
                return this._seekPlan(this._executePlan.bind(this)) || this._cannotMatchPostflightTarget();
            }
            _executePlan(matchedPlan) {
                let result = matchedPlan.execute(this._getResponseDoc(), this._onPlanApplicable.bind(this, matchedPlan));
                result.options = this.options;
                return result;
            }
            _isApplicablePlanError(error) {
                return !(error instanceof up.CannotMatch);
            }
            _onPlanApplicable(plan) {
                let primaryPlan = this._getPlans()[0];
                if (plan !== primaryPlan) {
                    up.puts('up.render()', 'Could not match primary target "%s". Updating a fallback target "%s".', primaryPlan.target, plan.target);
                }
                let { assets } = this._getResponseDoc();
                if (assets) {
                    up.script.assertAssetsOK(assets, plan.options);
                }
                this.options.onRender?.();
            }
            _getResponseDoc() {
                if (this._preview)
                    return;
                const docOptions = u.pick(this.options, [
                    'target',
                    'content',
                    'fragment',
                    'document',
                    'html',
                    'cspNonces',
                    'origin',
                ]);
                up.migrate.handleResponseDocOptions?.(docOptions);
                if (this._defaultPlacement() === 'content') {
                    docOptions.target = this._firstExpandedTarget(docOptions.target);
                }
                return new up.ResponseDoc(docOptions);
            }
            _improveOptionsFromResponseDoc() {
                if (this._preview)
                    return;
                let responseDoc = this._getResponseDoc();
                if (this.options.fragment) {
                    this.options.target ||= responseDoc.rootSelector();
                }
                this.options.title = this.improveHistoryValue(this.options.title, responseDoc.title);
                this.options.metaTags = this.improveHistoryValue(this.options.metaTags, responseDoc.metaTags);
            }
            _defaultPlacement() {
                if (!this.options.document && !this.options.fragment) {
                    return 'content';
                }
            }
            _firstExpandedTarget(target) {
                let layer = this._layers[0] || up.layer.root;
                return this._expandTargets(target || ':main', layer)[0];
            }
            getPreflightProps(opts = {}) {
                const getPlanProps = plan => plan.getPreflightProps();
                return this._seekPlan(getPlanProps) || opts.optional || this._cannotMatchPreflightTarget();
            }
            _cannotMatchPreflightTarget() {
                this._cannotMatchTarget('Could not find target in current page');
            }
            _cannotMatchPostflightTarget() {
                this._cannotMatchTarget('Could not find common target in current page and response');
            }
            _cannotMatchTarget(reason) {
                if (this._getPlans().length) {
                    const planTargets = u.uniq(u.map(this._getPlans(), 'target'));
                    const humanizedLayerOption = up.layer.optionToString(this.options.layer);
                    throw new up.CannotMatch([reason + " (tried selectors %o in %s)", planTargets, humanizedLayerOption]);
                }
                else if (this._layers.length === 0) {
                    this._cannotMatchLayer();
                }
                else if (this.options.failPrefixForced) {
                    throw new up.CannotMatch('No target selector given for failed responses (https://unpoly.com/failed-responses)');
                }
                else {
                    throw new up.CannotMatch('No target selector given');
                }
            }
            _cannotMatchLayer() {
                throw new up.CannotMatch('Could not find a layer to render in. You may have passed an unmatchable layer reference, or a detached element.');
            }
            _seekPlan(fn) {
                for (let plan of this._getPlans()) {
                    try {
                        return fn(plan);
                    }
                    catch (error) {
                        if (this._isApplicablePlanError(error)) {
                            throw error;
                        }
                    }
                }
            }
        },
        (() => {
            u.memoizeMethod(_a.prototype, {
                _getPlans: true,
                _getResponseDoc: true,
                getPreflightProps: true,
            });
        })(),
        _a);
    
    
    /***/ }),
    /* 35 */
    /***/ (() => {
    
    const u = up.util;
    up.CompilerPass = class CompilerPass {
        constructor(root, compilers, { layer, data, dataMap, meta }) {
            layer ||= up.layer.get(root) || up.layer.current;
            this._root = root;
            this._compilers = compilers;
            this._layer = layer;
            this._data = data;
            this._dataMap = dataMap;
            meta ||= {};
            meta.layer = layer;
            this._meta = meta;
        }
        run() {
            this._layer.asCurrent(() => {
                this.setCompileData();
                for (let compiler of this._compilers) {
                    this._runCompiler(compiler);
                }
            });
        }
        setCompileData() {
            if (this._data) {
                this._root.upCompileData = this._data;
            }
            if (this._dataMap) {
                for (let selector in this._dataMap) {
                    for (let match of this._select(selector)) {
                        match.upCompileData = this._dataMap[selector];
                    }
                }
            }
        }
        _runCompiler(compiler) {
            const matches = this._selectOnce(compiler);
            if (!matches.length) {
                return;
            }
            if (!compiler.isDefault) {
                up.puts('up.hello()', 'Compiling %d× "%s" on %s', matches.length, compiler.selector, this._layer);
            }
            if (compiler.batch) {
                this._compileBatch(compiler, matches);
            }
            else {
                for (let match of matches) {
                    this._compileOneElement(compiler, match);
                }
            }
            return up.migrate.postCompile?.(matches, compiler);
        }
        _compileOneElement(compiler, element) {
            const compileArgs = [element];
            if (compiler.length !== 1) {
                const data = up.script.data(element);
                compileArgs.push(data, this._meta);
            }
            const result = this._applyCompilerFunction(compiler, element, compileArgs);
            let destructorOrDestructors = this._destructorPresence(result);
            if (destructorOrDestructors) {
                up.destructor(element, destructorOrDestructors);
            }
        }
        _compileBatch(compiler, elements) {
            const compileArgs = [elements];
            if (compiler.length !== 1) {
                const dataList = u.map(elements, up.script.data);
                compileArgs.push(dataList, this._meta);
            }
            const result = this._applyCompilerFunction(compiler, elements, compileArgs);
            if (this._destructorPresence(result)) {
                up.fail('Compilers with { batch: true } cannot return destructors');
            }
        }
        _applyCompilerFunction(compiler, elementOrElements, compileArgs) {
            return up.error.guard(() => compiler.apply(elementOrElements, compileArgs));
        }
        _destructorPresence(result) {
            if (u.isFunction(result) || (u.isArray(result) && (u.every(result, u.isFunction)))) {
                return result;
            }
        }
        _select(selector) {
            return up.fragment.subtree(this._root, u.evalOption(selector), { layer: this._layer });
        }
        _selectOnce(compiler) {
            let matches = this._select(compiler.selector);
            return u.filter(matches, (element) => {
                let appliedCompilers = (element.upAppliedCompilers ||= new Set());
                if (!appliedCompilers.has(compiler)) {
                    appliedCompilers.add(compiler);
                    return true;
                }
            });
        }
    };
    
    
    /***/ }),
    /* 36 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.CSSTransition = class CSSTransition {
        constructor(element, lastFrameKebab, options) {
            this._element = element;
            this._lastFrameKebab = lastFrameKebab;
            this._lastFrameKeysKebab = Object.keys(this._lastFrameKebab);
            if (u.some(this._lastFrameKeysKebab, key => key.match(/A-Z/))) {
                up.fail('Animation keys must be kebab-case');
            }
            this._finishEvent = options.finishEvent;
            this._duration = options.duration;
            this._easing = options.easing;
            this._finished = false;
        }
        start() {
            if (this._lastFrameKeysKebab.length === 0) {
                this._finished = true;
                return Promise.resolve();
            }
            this._deferred = u.newDeferred();
            this._pauseOldTransition();
            this._startTime = new Date();
            this._startFallbackTimer();
            this._listenToFinishEvent();
            this._listenToTransitionEnd();
            this._startMotion();
            return this._deferred;
        }
        _listenToFinishEvent() {
            if (this._finishEvent) {
                this._stopListenToFinishEvent = up.on(this._element, this._finishEvent, this._onFinishEvent.bind(this));
            }
        }
        _onFinishEvent(event) {
            event.stopPropagation();
            this._finish();
        }
        _startFallbackTimer() {
            const timingTolerance = 100;
            this._fallbackTimer = u.timer((this._duration + timingTolerance), () => {
                this._finish();
            });
        }
        _stopFallbackTimer() {
            clearTimeout(this._fallbackTimer);
        }
        _listenToTransitionEnd() {
            this._stopListenToTransitionEnd = up.on(this._element, 'transitionend', this._onTransitionEnd.bind(this));
        }
        _onTransitionEnd(event) {
            if (event.target !== this._element) {
                return;
            }
            const elapsed = new Date() - this._startTime;
            if (elapsed <= (0.25 * this._duration)) {
                return;
            }
            const completedPropertyKebab = event.propertyName;
            if (!u.contains(this._lastFrameKeysKebab, completedPropertyKebab)) {
                return;
            }
            this._finish();
        }
        _finish() {
            if (this._finished) {
                return;
            }
            this._finished = true;
            this._stopFallbackTimer();
            this._stopListenToFinishEvent?.();
            this._stopListenToTransitionEnd?.();
            e.concludeCSSTransition(this._element);
            this._resumeOldTransition();
            this._deferred.resolve();
        }
        _pauseOldTransition() {
            const oldTransition = e.style(this._element, [
                'transitionProperty',
                'transitionDuration',
                'transitionDelay',
                'transitionTimingFunction'
            ]);
            if (e.hasCSSTransition(oldTransition)) {
                if (oldTransition.transitionProperty !== 'all') {
                    const oldTransitionProperties = oldTransition.transitionProperty.split(/\s*,\s*/);
                    const oldTransitionFrameKebab = e.style(this._element, oldTransitionProperties);
                    this._setOldTransitionTargetFrame = e.setTemporaryStyle(this._element, oldTransitionFrameKebab);
                }
                this._setOldTransition = e.concludeCSSTransition(this._element);
            }
        }
        _resumeOldTransition() {
            this._setOldTransitionTargetFrame?.();
            this._setOldTransition?.();
        }
        _startMotion() {
            e.setStyle(this._element, {
                transitionProperty: Object.keys(this._lastFrameKebab).join(', '),
                transitionDuration: `${this._duration}ms`,
                transitionTimingFunction: this._easing
            });
            e.setStyle(this._element, this._lastFrameKebab);
        }
    };
    
    
    /***/ }),
    /* 37 */
    /***/ (() => {
    
    const u = up.util;
    up.DestructorPass = class DestructorPass {
        constructor(fragment, options) {
            this._fragment = fragment;
            this._options = options;
        }
        run() {
            for (let cleanable of this._selectCleanables()) {
                let destructors = u.pluckKey(cleanable, 'upDestructors');
                if (destructors) {
                    for (let destructor of destructors) {
                        this._applyDestructorFunction(destructor, cleanable);
                    }
                }
                cleanable.classList.remove('up-can-clean');
            }
        }
        _selectCleanables() {
            const selectOptions = { ...this._options, destroying: true };
            return up.fragment.subtree(this._fragment, '.up-can-clean', selectOptions);
        }
        _applyDestructorFunction(destructor, element) {
            up.error.guard(() => destructor(element));
        }
    };
    
    
    /***/ }),
    /* 38 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.EventEmitter = class EventEmitter extends up.Record {
        keys() {
            return [
                'target',
                'event',
                'baseLayer',
                'callback',
                'log',
                'ensureBubbles',
            ];
        }
        emit() {
            this._logEmission();
            if (this.baseLayer) {
                this.baseLayer.asCurrent(() => this._dispatchEvent());
            }
            else {
                this._dispatchEvent();
            }
            return this.event;
        }
        _dispatchEvent() {
            this.target.dispatchEvent(this.event);
            if (this.ensureBubbles && !this.target.isConnected) {
                document.dispatchEvent(this.event);
            }
            up.error.guard(() => this.callback?.(this.event));
        }
        assertEmitted() {
            const event = this.emit();
            if (event.defaultPrevented) {
                throw new up.Aborted(`Event ${event.type} was prevented`);
            }
        }
        _logEmission() {
            if (!up.log.config.enabled) {
                return;
            }
            let message = this.log;
            let messageArgs;
            if (u.isArray(message)) {
                [message, ...messageArgs] = message;
            }
            else {
                messageArgs = [];
            }
            const { type } = this.event;
            if (u.isString(message)) {
                up.puts(type, message, ...messageArgs);
            }
            else if (message !== false) {
                up.puts(type, `Event ${type}`);
            }
        }
        static fromEmitArgs(args, defaults = {}) {
            let options = u.extractOptions(args);
            options = u.merge(defaults, options);
            if (u.isElementish(args[0])) {
                options.target = e.get(args.shift());
            }
            else if (args[0] instanceof up.Layer) {
                options.layer = args.shift();
            }
            let layer;
            if (u.isGiven(options.layer)) {
                layer = up.layer.get(options.layer);
                options.target ||= layer.element;
                options.baseLayer ||= layer;
            }
            if (options.baseLayer) {
                options.baseLayer = up.layer.get(options.baseLayer);
            }
            if (u.isString(options.target)) {
                options.target = up.fragment.get(options.target, { layer: options.layer });
            }
            else if (!options.target) {
                options.target = document;
            }
            if (args[0]?.preventDefault) {
                options.event = args[0];
                options.log ??= args[0].log;
            }
            else if (u.isString(args[0])) {
                options.event = up.event.build(args[0], options);
            }
            else {
                options.event = up.event.build(options);
            }
            return new (this)(options);
        }
    };
    
    
    /***/ }),
    /* 39 */
    /***/ (() => {
    
    const u = up.util;
    up.EventListener = class EventListener extends up.Record {
        keys() {
            return [
                'element',
                'eventType',
                'selector',
                'callback',
                'guard',
                'baseLayer',
                'passive',
                'once',
                'capture',
                'beforeBoot',
            ];
        }
        constructor(attributes) {
            super(attributes);
            this._key = this.constructor._buildKey(attributes);
            this.isDefault = up.framework.evaling;
            this.beforeBoot ??= (this.eventType.indexOf('up:framework:') === 0);
            this.nativeCallback = this.nativeCallback.bind(this);
        }
        bind() {
            const map = (this.element.upEventListeners ||= {});
            if (map[this._key]) {
                up.fail('up.on(): The %o callback %o cannot be registered more than once', this.eventType, this.callback);
            }
            map[this._key] = this;
            this.element.addEventListener(...this._addListenerArg());
        }
        _addListenerArg() {
            let options = u.compactObject(u.pick(this, ['once', 'passive', 'capture']));
            return [this.eventType, this.nativeCallback, options];
        }
        unbind() {
            let map = this.element.upEventListeners;
            if (map) {
                delete map[this._key];
            }
            this.element.removeEventListener(...this._addListenerArg());
        }
        nativeCallback(event) {
            if (up.framework.beforeBoot && !this.beforeBoot) {
                return;
            }
            let element = event.target;
            if (this.selector) {
                element = element.closest(u.evalOption(this.selector));
            }
            if (this.guard && !this.guard(event)) {
                return;
            }
            if (element) {
                const args = [event, element];
                const expectedArgCount = this.callback.length;
                if (expectedArgCount !== 1 && expectedArgCount !== 2) {
                    const data = up.script.data(element);
                    args.push(data);
                }
                if (this.eventType === 'click' && element.disabled) {
                    return;
                }
                const applyCallback = this.callback.bind(element, ...args);
                if (this.baseLayer) {
                    this.baseLayer.asCurrent(applyCallback);
                }
                else {
                    applyCallback();
                }
            }
        }
        static fromElement(attributes) {
            let map = attributes.element.upEventListeners;
            if (map) {
                const key = this._buildKey(attributes);
                return map[key];
            }
        }
        static _buildKey(attributes) {
            attributes.callback.upUid ||= u.uid();
            return [
                attributes.eventType,
                attributes.selector,
                attributes.callback.upUid
            ].join('|');
        }
        static allNonDefault(element) {
            let map = element.upEventListeners;
            if (map) {
                const listeners = Object.values(map);
                return u.reject(listeners, 'isDefault');
            }
            else {
                return [];
            }
        }
    };
    
    
    /***/ }),
    /* 40 */
    /***/ (() => {
    
    const u = up.util;
    up.EventListenerGroup = class EventListenerGroup extends up.Record {
        keys() {
            return [
                'elements',
                'eventTypes',
                'selector',
                'callback',
                'guard',
                'baseLayer',
                'passive',
                'once',
                'capture',
                'beforeBoot',
            ];
        }
        bind() {
            const unbindFns = [];
            this._eachListenerAttributes(function (attrs) {
                const listener = new up.EventListener(attrs);
                listener.bind();
                return unbindFns.push(listener.unbind.bind(listener));
            });
            return u.sequence(unbindFns);
        }
        _eachListenerAttributes(fn) {
            for (let element of this.elements) {
                for (let eventType of this.eventTypes) {
                    fn(this._listenerAttributes(element, eventType));
                }
            }
        }
        _listenerAttributes(element, eventType) {
            return { ...this.attributes(), element, eventType };
        }
        unbind() {
            this._eachListenerAttributes(function (attrs) {
                let listener = up.EventListener.fromElement(attrs);
                if (listener) {
                    listener.unbind();
                }
            });
        }
        static fromBindArgs(args, defaults) {
            args = u.copy(args);
            const callback = args.pop();
            let elements;
            if (args[0].addEventListener) {
                elements = [args.shift()];
            }
            else if (u.isJQuery(args[0]) || (u.isList(args[0]) && args[0][0].addEventListener)) {
                elements = args.shift();
            }
            else {
                elements = [document];
            }
            let eventTypes = u.parseTokens(args.shift());
            let fixTypes = up.migrate.fixEventTypes;
            if (fixTypes) {
                eventTypes = fixTypes(eventTypes);
            }
            const options = u.extractOptions(args);
            const selector = args[0];
            const attributes = { elements, eventTypes, selector, callback, ...options, ...defaults };
            return new (this)(attributes);
        }
    };
    
    
    /***/ }),
    /* 41 */
    /***/ (() => {
    
    const u = up.util;
    up.FieldWatcher = class FieldWatcher {
        constructor(root, options, callback) {
            this._options = options;
            this._root = root;
            this._scope = up.form.getScope(root);
            this._callback = callback;
            this._batch = options.batch;
            this._abortable = options.abortable;
        }
        start() {
            this._scheduledValues = null;
            this._processedValues = this._readFieldValues();
            this._currentTimer = null;
            this._callbackRunning = false;
            this._unbindFns = [];
            this._watchFieldsWithin(this._root);
            this._root.addEventListener('up:fragment:inserted', ({ target }) => {
                if (target !== this._root)
                    this._watchFieldsWithin(target);
            });
            this._unbindFns.push(up.fragment.onAborted(this._scope, () => this._abort()));
            this._unbindFns.push(up.on(this._scope, 'reset', () => this._onFormReset()));
        }
        stop() {
            this._abort();
            for (let unbindFn of this._unbindFns)
                unbindFn();
        }
        _fieldOptions(field) {
            let rootOptions = u.copy(this._options);
            return up.form.watchOptions(field, rootOptions, { defaults: { event: 'input' } });
        }
        _watchFieldsWithin(container) {
            for (let field of up.form.fields(container)) {
                this._watchField(field);
            }
        }
        _watchField(field) {
            let fieldOptions = this._fieldOptions(field);
            this._unbindFns.push(up.on(field, fieldOptions.event, () => this._check(fieldOptions)));
        }
        _abort() {
            this._scheduledValues = null;
        }
        _scheduleValues(values, fieldOptions) {
            this._scheduledValues = values;
            this._scheduledFieldOptions = fieldOptions;
            let delay = fieldOptions.delay || 0;
            clearTimeout(this._currentTimer);
            this._currentTimer = u.timer(delay, () => {
                this._currentTimer = null;
                this._requestCallback();
            });
        }
        _isNewValues(values) {
            return !u.isEqual(values, this._processedValues) && !u.isEqual(this._scheduledValues, values);
        }
        async _requestCallback() {
            if (!this._scheduledValues)
                return;
            if (this._callbackRunning)
                return;
            if (this._currentTimer)
                return;
            if (!this._scope.isConnected)
                return;
            let fieldOptions = this._scheduledFieldOptions;
            const diff = this._changedValues(this._processedValues, this._scheduledValues);
            this._processedValues = this._scheduledValues;
            this._scheduledValues = null;
            this._callbackRunning = true;
            this._scheduledFieldOptions = null;
            let callbackOptions = { ...fieldOptions, disable: false };
            const callbackReturnValues = [];
            if (this._batch) {
                callbackReturnValues.push(this._runCallback(diff, callbackOptions));
            }
            else {
                for (let name in diff) {
                    const value = diff[name];
                    callbackReturnValues.push(this._runCallback(value, name, callbackOptions));
                }
            }
            if (u.some(callbackReturnValues, u.isPromise)) {
                let callbackDone = Promise.allSettled(callbackReturnValues);
                up.form.disableWhile(callbackDone, fieldOptions);
                await callbackDone;
            }
            this._callbackRunning = false;
            this._requestCallback();
        }
        _runCallback(...args) {
            return up.error.guard(() => this._callback(...args));
        }
        _changedValues(previous, next) {
            const changes = {};
            let keys = Object.keys(previous);
            keys = keys.concat(Object.keys(next));
            keys = u.uniq(keys);
            for (let key of keys) {
                const previousValue = previous[key];
                const nextValue = next[key];
                if (!u.isEqual(previousValue, nextValue)) {
                    changes[key] = nextValue;
                }
            }
            return changes;
        }
        _readFieldValues() {
            return up.Params.fromContainer(this._root).toObject();
        }
        _check(fieldOptions = {}) {
            const values = this._readFieldValues();
            if (this._isNewValues(values)) {
                this._scheduleValues(values, fieldOptions);
            }
        }
        _onFormReset() {
            u.task(() => this._check());
        }
    };
    
    
    /***/ }),
    /* 42 */
    /***/ (() => {
    
    const u = up.util;
    up.FormValidator = class FormValidator {
        constructor(form) {
            this._form = form;
            this._dirtySolutions = [];
            this._nextRenderTimer = null;
            this._rendering = false;
            this._resetNextRenderPromise();
            this._honorAbort();
        }
        _honorAbort() {
            up.fragment.onAborted(this._form, (event) => this._onAborted(event));
        }
        _onAborted(event) {
            if (this._dirtySolutions.length) {
                this._dirtySolutions = [];
                this._nextRenderPromise.reject(new up.Aborted(event.reason));
                this._resetNextRenderPromise();
            }
        }
        _resetNextRenderPromise() {
            this._nextRenderPromise = u.newDeferred();
        }
        watchContainer(fieldOrForm) {
            let { event } = this._originOptions(fieldOrForm);
            let guard = () => up.fragment.isAlive(fieldOrForm);
            let callback = () => up.error.muteUncriticalRejection(this.validate({ origin: fieldOrForm }));
            up.on(fieldOrForm, event, { guard }, callback);
        }
        validate(options = {}) {
            let solutions = this._getSolutions(options);
            this._dirtySolutions.push(...solutions);
            this._scheduleNextRender();
            return this._nextRenderPromise;
        }
        _getSolutions(options) {
            let solutions = this._getTargetSelectorSolutions(options)
                || this._getFieldSolutions(options)
                || this._getElementSolutions(options.origin);
            for (let solution of solutions) {
                solution.renderOptions = this._originOptions(solution.origin, options);
                solution.target = up.fragment.resolveOrigin(solution.target, solution);
            }
            return solutions;
        }
        _getFieldSolutions({ origin, ...options }) {
            if (up.form.isField(origin)) {
                return this._getValidateAttrSolutions(origin) || this._getFormGroupSolutions(origin, options);
            }
        }
        _getFormGroupSolutions(field, { formGroup = true }) {
            if (!formGroup)
                return;
            let solution = up.form.groupSolution(field);
            if (solution) {
                up.puts('up.validate()', 'Validating form group of field %o', field);
                return [solution];
            }
        }
        _getTargetSelectorSolutions({ target, origin }) {
            if (u.isString(target) && target) {
                up.puts('up.validate()', 'Validating target "%s"', target);
                let simpleSelectors = up.fragment.splitTarget(target);
                return u.compact(simpleSelectors.map(function (simpleSelector) {
                    let element = up.fragment.get(simpleSelector, { origin });
                    if (element) {
                        return {
                            element,
                            target: simpleSelector,
                            origin
                        };
                    }
                    else {
                        up.fail('Validation target "%s" does not match an element', simpleSelector);
                    }
                }));
            }
        }
        _getElementSolutions(element) {
            up.puts('up.validate()', 'Validating element %o', element);
            return [{
                    element,
                    target: up.fragment.toTarget(element),
                    origin: element
                }];
        }
        _getValidateAttrSolutions(field) {
            let containerWithAttr = field.closest('[up-validate]');
            if (containerWithAttr) {
                let target = containerWithAttr.getAttribute('up-validate');
                return this._getTargetSelectorSolutions({ target, origin: field });
            }
        }
        _originOptions(element, overrideOptions) {
            return up.form.watchOptions(element, overrideOptions, { defaults: { event: 'change' } });
        }
        _scheduleNextRender() {
            let solutionDelays = this._dirtySolutions.map((solution) => solution.renderOptions.delay);
            let shortestDelay = Math.min(...solutionDelays) || 0;
            clearTimeout(this._nextRenderTimer);
            this._nextRenderTimer = u.timer(shortestDelay, () => {
                this._nextRenderTimer = null;
                this._renderDirtySolutions();
            });
        }
        _renderDirtySolutions() {
            up.error.muteUncriticalRejection(this._doRenderDirtySolutions());
        }
        async _doRenderDirtySolutions() {
            if (!this._dirtySolutions.length)
                return;
            if (this._rendering)
                return;
            if (this._nextRenderTimer)
                return;
            let dirtySolutions = this._dirtySolutions;
            this._dirtySolutions = [];
            let dirtyOrigins = u.map(dirtySolutions, 'origin');
            let dirtyFields = u.flatMap(dirtyOrigins, up.form.fields);
            let dirtyNames = u.uniq(u.map(dirtyFields, 'name'));
            let dataMap = this._buildDataMap(dirtySolutions);
            let dirtyRenderOptionsList = u.map(dirtySolutions, 'renderOptions');
            let options = u.mergeDefined(...dirtyRenderOptionsList, { dataMap }, up.form.destinationOptions(this._form));
            options.target = u.map(dirtySolutions, 'target').join(', ');
            options.feedback = u.some(dirtyRenderOptionsList, 'feedback');
            options.origin = this._form;
            options.focus ??= 'keep';
            options.failOptions = false;
            options.defaultMaybe = true;
            options.params = up.Params.merge(options.params, ...u.map(dirtyRenderOptionsList, 'params'));
            options.headers = u.merge(...u.map(dirtyRenderOptionsList, 'headers'));
            this._addValidateHeader(options.headers, dirtyNames);
            options.guardEvent = up.event.build('up:form:validate', {
                fields: dirtyFields,
                log: 'Validating form',
                params: options.params
            });
            this._rendering = true;
            let renderingPromise = this._nextRenderPromise;
            this._resetNextRenderPromise();
            options.disable = false;
            for (let solution of dirtySolutions) {
                up.form.disableWhile(renderingPromise, {
                    disable: solution.renderOptions.disable,
                    origin: solution.origin,
                });
            }
            try {
                renderingPromise.resolve(up.render(options));
                await renderingPromise;
            }
            finally {
                this._rendering = false;
                this._renderDirtySolutions();
            }
        }
        _addValidateHeader(headers, names) {
            let key = up.protocol.headerize('validate');
            let value = names.join(' ');
            if (!value || value.length > up.protocol.config.maxHeaderSize)
                value = ':unknown';
            headers[key] = value;
        }
        _buildDataMap(solutions) {
            let dataMap = {};
            for (let solution of solutions) {
                let data = u.pluckKey(solution.renderOptions, 'data');
                let keepData = u.pluckKey(solution.renderOptions, 'keepData');
                if (keepData) {
                    data = up.data(solution.element);
                }
                if (data) {
                    dataMap[solution.target] = data;
                }
            }
            return dataMap;
        }
        static forElement(element) {
            let form = up.form.get(element);
            return form.upFormValidator ||= new this(form);
        }
    };
    
    
    /***/ }),
    /* 43 */
    /***/ (() => {
    
    up.FocusCapsule = class FocusCapsule {
        constructor(target, cursorProps) {
            this._target = target;
            this._cursorProps = cursorProps;
        }
        restore(layer, options) {
            let rediscoveredElement = up.fragment.get(this._target, { layer });
            if (rediscoveredElement) {
                up.viewport.copyCursorProps(this._cursorProps, rediscoveredElement);
                up.focus(rediscoveredElement, options);
                return true;
            }
        }
        static preserve(layer) {
            let focusedElement = up.viewport.focusedElementWithin(layer.element);
            if (!focusedElement)
                return;
            let target = up.fragment.tryToTarget(focusedElement);
            if (!target)
                return;
            const cursorProps = up.viewport.copyCursorProps(focusedElement);
            return new this(target, cursorProps);
        }
    };
    
    
    /***/ }),
    /* 44 */
    /***/ (() => {
    
    const u = up.util;
    up.FragmentProcessor = class FragmentProcessor extends up.Record {
        keys() {
            return [
                'fragment',
                'autoMeans',
                'origin',
                'layer'
            ];
        }
        process(opt) {
            let preprocessed = this.preprocess(opt);
            return this.tryProcess(preprocessed);
        }
        preprocess(opt) {
            return u.parseTokens(opt, { separator: 'or' });
        }
        tryProcess(opt) {
            if (u.isArray(opt)) {
                return this.processArray(opt);
            }
            if (u.isFunction(opt)) {
                let result = up.error.guard(() => opt(this.fragment, this.attributes()));
                return this.tryProcess(result);
            }
            if (u.isElement(opt)) {
                return this.processElement(opt);
            }
            if (u.isString(opt)) {
                if (opt === 'auto') {
                    return this.tryProcess(this.autoMeans);
                }
                let match = opt.match(/^(.+?)-if-(.+?)$/);
                if (match) {
                    return this.resolveCondition(match[2]) && this.process(match[1]);
                }
            }
            return this.processPrimitive(opt);
        }
        processArray(array) {
            return u.find(array, opt => this.tryProcess(opt));
        }
        resolveCondition(condition) {
            if (condition === 'main') {
                return this.fragment && up.fragment.contains(this.fragment, ':main');
            }
        }
        findSelector(selector) {
            const lookupOpts = { layer: this.layer, origin: this.origin };
            let matchWithinFragment = this.fragment && up.fragment.get(this.fragment, selector, lookupOpts);
            let match = matchWithinFragment || up.fragment.get(selector, lookupOpts);
            if (match) {
                return match;
            }
            else {
                up.warn('up.render()', 'Could not find an element matching "%s"', selector);
            }
        }
    };
    
    
    /***/ }),
    /* 45 */
    /***/ (() => {
    
    const DESCENDANT_SELECTOR = /^([^ >+(]+) (.+)$/;
    up.FragmentFinder = class FragmentFinder {
        constructor(options) {
            this._options = options;
            this._origin = options.origin;
            this._selector = options.selector;
            this._document = options.document || window.document;
            this._match = options.match ?? up.fragment.config.match;
            this._preferOldElements = options.preferOldElements;
        }
        find() {
            return this._findInPreferredElements() || this._findInRegion() || this._findFirst();
        }
        _findInPreferredElements() {
            if (this._preferOldElements) {
                return this._preferOldElements.find((preferOldElement) => this._document.contains(preferOldElement) && up.fragment.matches(preferOldElement, this._selector));
            }
        }
        _findInRegion() {
            if (this._match === 'region' && !up.fragment.containsMainPseudo(this._selector) && this._origin?.isConnected) {
                return this._findClosest() || this._findDescendantInRegion();
            }
        }
        _findClosest() {
            return up.fragment.closest(this._origin, this._selector, this._options);
        }
        _findDescendantInRegion() {
            let parts = this._selector.match(DESCENDANT_SELECTOR);
            if (parts) {
                let parent = up.fragment.closest(this._origin, parts[1], this._options);
                if (parent) {
                    return up.fragment.getDumb(parent, parts[2]);
                }
            }
        }
        _findFirst() {
            return up.fragment.getDumb(this._document, this._selector, this._options);
        }
    };
    
    
    /***/ }),
    /* 46 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    const PREVENT_SCROLL_OPTIONS = { preventScroll: true };
    up.FragmentFocus = class FragmentFocus extends up.FragmentProcessor {
        keys() {
            return super.keys().concat([
                'hash',
                'focusCapsule',
                'inputDevice',
            ]);
        }
        processPrimitive(opt) {
            switch (opt) {
                case 'keep':
                    return this._restoreLostFocus();
                case 'restore':
                    return this._restorePreviousFocusForLocation();
                case 'target':
                case true:
                    return this._focusElement(this.fragment);
                case 'layer':
                    return this._focusElement(this.layer.getFocusElement());
                case 'main':
                    return this._focusSelector(':main');
                case 'hash':
                    return this._focusHash();
                case 'autofocus':
                    return this._autofocus();
                default:
                    if (u.isString(opt)) {
                        return this._focusSelector(opt);
                    }
            }
        }
        processElement(element) {
            return this._focusElement(element);
        }
        resolveCondition(condition) {
            if (condition === 'lost') {
                return this._wasFocusLost();
            }
            else {
                return super.resolveCondition(condition);
            }
        }
        _focusSelector(selector) {
            let match = this.findSelector(selector);
            return this._focusElement(match);
        }
        _restoreLostFocus() {
            if (this._wasFocusLost()) {
                return this.focusCapsule?.restore(this.layer, PREVENT_SCROLL_OPTIONS);
            }
        }
        _restorePreviousFocusForLocation() {
            return up.viewport.restoreFocus({ layer: this.layer });
        }
        _autofocus() {
            let autofocusElement = this.fragment && e.subtree(this.fragment, '[autofocus]')[0];
            if (autofocusElement) {
                return this._focusElement(autofocusElement);
            }
        }
        _focusElement(element) {
            if (element) {
                up.focus(element, { force: true, ...PREVENT_SCROLL_OPTIONS, inputDevice: this.inputDevice });
                return true;
            }
        }
        _focusHash() {
            let hashTarget = up.viewport.firstHashTarget(this.hash, { layer: this.layer });
            if (hashTarget) {
                return this._focusElement(hashTarget);
            }
        }
        _wasFocusLost() {
            return !this.layer.hasFocus();
        }
    };
    
    
    /***/ }),
    /* 47 */
    /***/ (() => {
    
    const e = up.element;
    up.FragmentPolling = class FragmentPolling {
        constructor(fragment) {
            this._options = up.radio.pollOptions(fragment);
            this._fragment = fragment;
            up.destructor(fragment, this._onFragmentDestroyed.bind(this));
            up.fragment.onAborted(fragment, this._onFragmentAborted.bind(this));
            this._state = 'initialized';
            this._abortable = true;
            this._loading = false;
            this._satisfyInterval();
        }
        static forFragment(fragment) {
            return fragment.upPolling ||= new this(fragment);
        }
        onPollAttributeObserved() {
            this._start();
        }
        _onFragmentDestroyed() {
            this._stop();
        }
        _start(options) {
            Object.assign(this._options, options);
            if (this._state !== 'started') {
                if (!up.fragment.isTargetable(this._fragment)) {
                    up.warn('[up-poll]', 'Cannot poll untargetable fragment %o', this._fragment);
                    return;
                }
                this._state = 'started';
                this._ensureEventsBound();
                this._scheduleRemainingTime();
            }
        }
        _stop() {
            if (this._state === 'started') {
                this._clearReloadTimer();
                this._state = 'stopped';
                this.unbindEvents?.();
            }
        }
        forceStart(options) {
            Object.assign(this._options, options);
            this.forceStarted = true;
            this._start();
        }
        forceStop() {
            this._stop();
            this.forceStarted = false;
        }
        _ensureEventsBound() {
            if (!this.unbindEvents) {
                this.unbindEvents = up.on('visibilitychange up:layer:opened up:layer:dismissed up:layer:accepted', this._onVisibilityChange.bind(this));
            }
        }
        _onVisibilityChange() {
            if (this._isFragmentVisible()) {
                this._scheduleRemainingTime();
            }
            else {
            }
        }
        _isFragmentVisible() {
            return (!document.hidden) &&
                (this._options.ifLayer === 'any' || this._isOnFrontLayer());
        }
        _clearReloadTimer() {
            clearTimeout(this.reloadTimer);
            this.reloadTimer = null;
        }
        _scheduleRemainingTime() {
            if (!this.reloadTimer && !this._loading) {
                this._clearReloadTimer();
                this.reloadTimer = setTimeout(this._onTimerReached.bind(this), this._getRemainingDelay());
            }
        }
        _onTimerReached() {
            this.reloadTimer = null;
            this._tryReload();
        }
        _tryReload() {
            if (this._state !== 'started') {
                return;
            }
            if (!this._isFragmentVisible()) {
                up.puts('[up-poll]', 'Will not poll hidden fragment');
                return;
            }
            if (up.emit(this._fragment, 'up:fragment:poll', { log: ['Polling fragment', this._fragment] }).defaultPrevented) {
                up.puts('[up-poll]', 'User prevented up:fragment:poll event');
                this._satisfyInterval();
                this._scheduleRemainingTime();
                return;
            }
            this._reloadNow();
        }
        _getFullDelay() {
            return this._options.interval ?? e.numberAttr(this._fragment, 'up-interval') ?? up.radio.config.pollInterval;
        }
        _getRemainingDelay() {
            return Math.max(this._getFullDelay() - this._getFragmentAge(), 0);
        }
        _getFragmentAge() {
            return new Date() - this._lastAttempt;
        }
        _isOnFrontLayer() {
            this.layer ||= up.layer.get(this._fragment);
            return this.layer?.isFront?.();
        }
        _reloadNow() {
            this._clearReloadTimer();
            let reloadOptions = {
                url: this._options.url,
                fail: false,
                background: true,
            };
            let oldAbortable = this._abortable;
            try {
                this._abortable = false;
                this._loading = true;
                up.reload(this._fragment, reloadOptions).then(this._onReloadSuccess.bind(this), this._onReloadFailure.bind(this));
            }
            finally {
                this._abortable = oldAbortable;
            }
        }
        _onFragmentAborted({ newLayer }) {
            if (this._abortable && !newLayer) {
                this._stop();
            }
        }
        _onReloadSuccess({ fragment }) {
            this._loading = false;
            this._satisfyInterval();
            if (fragment) {
                this._onFragmentSwapped(fragment);
            }
            else {
                this._scheduleRemainingTime();
            }
        }
        _onFragmentSwapped(newFragment) {
            this._stop();
            if (this.forceStarted && up.fragment.matches(this._fragment, newFragment)) {
                this.constructor.forFragment(newFragment).forceStart(this._options);
            }
        }
        _onReloadFailure(reason) {
            this._loading = false;
            this._satisfyInterval();
            this._scheduleRemainingTime();
            up.error.throwCritical(reason);
        }
        _satisfyInterval() {
            this._lastAttempt = new Date();
        }
    };
    
    
    /***/ }),
    /* 48 */
    /***/ (() => {
    
    const u = up.util;
    up.FragmentScrolling = class FragmentScrolling extends up.FragmentProcessor {
        keys() {
            return super.keys().concat([
                'hash',
                'mode',
                'revealTop',
                'revealMax',
                'revealSnap',
                'scrollBehavior',
            ]);
        }
        processPrimitive(opt) {
            switch (opt) {
                case 'reset':
                    return this._reset();
                case 'layer':
                    return this._revealLayer();
                case 'main':
                    return this._revealSelector(':main');
                case 'restore':
                    return this._restore();
                case 'hash':
                    return this.hash && up.viewport.revealHash(this.hash, this.attributes());
                case 'target':
                case 'reveal':
                case true:
                    return this._revealElement(this.fragment);
                default:
                    if (u.isString(opt)) {
                        return this._revealSelector(opt);
                    }
            }
        }
        processElement(element) {
            return this._revealElement(element);
        }
        _revealElement(element) {
            if (element) {
                up.reveal(element, this.attributes());
                return true;
            }
        }
        _revealSelector(selector) {
            let match = this.findSelector(selector);
            return this._revealElement(match);
        }
        _revealLayer() {
            return this._revealElement(this.layer.getBoxElement());
        }
        _reset() {
            up.viewport.resetScroll({ ...this.attributes(), around: this.fragment });
            return true;
        }
        _restore() {
            return up.viewport.restoreScroll({ ...this.attributes(), around: this.fragment });
        }
    };
    
    
    /***/ }),
    /* 49 */
    /***/ (() => {
    
    const e = up.element;
    const u = up.util;
    up.Layer = class Layer extends up.Record {
        keys() {
            return [
                'element',
                'stack',
                'history',
                'mode',
                'context',
                'lastScrollTops',
                'lastFocusCapsules',
            ];
        }
        defaults() {
            return {
                context: {},
                lastScrollTops: up.viewport.newStateCache(),
                lastFocusCapsules: up.viewport.newStateCache()
            };
        }
        constructor(options = {}) {
            super(options);
            if (!this.mode) {
                throw "missing { mode } option";
            }
        }
        setupHandlers() {
            up.link.convertClicks(this);
        }
        teardownHandlers() { }
        mainTargets() {
            return up.layer.mainTargets(this.mode);
        }
        sync() {
        }
        accept() {
            throw new up.NotImplemented();
        }
        dismiss() {
            throw new up.NotImplemented();
        }
        peel(options) {
            this.stack.peel(this, options);
        }
        evalOption(option) {
            return u.evalOption(option, this);
        }
        isCurrent() {
            return this.stack.isCurrent(this);
        }
        isFront() {
            return this.stack.isFront(this);
        }
        isRoot() {
            return this.stack.isRoot(this);
        }
        isOverlay() {
            return this.stack.isOverlay(this);
        }
        isOpen() {
            return this.stack.isOpen(this);
        }
        isClosed() {
            return this.stack.isClosed(this);
        }
        get parent() {
            return this.stack.parentOf(this);
        }
        get child() {
            return this.stack.childOf(this);
        }
        get ancestors() {
            return this.stack.ancestorsOf(this);
        }
        get descendants() {
            return this.stack.descendantsOf(this);
        }
        get subtree() {
            return [this, ...this.descendants];
        }
        get index() {
            return this._index ??= this.stack.indexOf(this);
        }
        getContentElement() {
            return this.contentElement || this.element;
        }
        getBoxElement() {
            return this.boxElement || this.element;
        }
        getFocusElement() {
            return this.getBoxElement();
        }
        getFirstSwappableElement() {
            throw new up.NotImplemented();
        }
        contains(element) {
            return element.closest(up.layer.anySelector()) === this.element;
        }
        on(...args) {
            return this._buildEventListenerGroup(args).bind();
        }
        off(...args) {
            return this._buildEventListenerGroup(args).unbind();
        }
        _buildEventListenerGroup(args) {
            return up.EventListenerGroup.fromBindArgs(args, {
                guard: (event) => this._containsEventTarget(event),
                elements: [this.element],
                baseLayer: this
            });
        }
        _containsEventTarget(event) {
            return this.contains(event.target);
        }
        wasHitByMouseEvent(event) {
            const hittableElement = document.elementFromPoint(event.clientX, event.clientY);
            return !hittableElement || this.contains(hittableElement);
        }
        _buildEventEmitter(args) {
            return up.EventEmitter.fromEmitArgs(args, { layer: this });
        }
        emit(...args) {
            return this._buildEventEmitter(args).emit();
        }
        isDetached() {
            return !this.element.isConnected;
        }
        saveHistory() {
            if (this.history) {
                this.savedTitle = document.title;
                this.savedMetaTags = up.history.findMetaTags();
                this.savedLocation = up.history.location;
            }
        }
        restoreHistory() {
            if (!this.showsLiveHistory()) {
                return;
            }
            if (this.savedLocation) {
                up.history.push(this.savedLocation);
            }
            if (this.savedTitle) {
                document.title = this.savedTitle;
            }
            if (this.savedMetaTags) {
                up.history.updateMetaTags(this.savedMetaTags);
            }
        }
        asCurrent(fn) {
            return this.stack.asCurrent(this, fn);
        }
        updateHistory(options) {
            if (u.isString(options.location)) {
                this.location = options.location;
            }
            if (up.history.config.updateMetaTags && u.isList(options.metaTags)) {
                up.migrate?.warnOfHungryMetaTags?.(options.metaTags);
                this.metaTags = options.metaTags;
            }
            if (u.isString(options.title)) {
                this.title = options.title;
            }
        }
        showsLiveHistory() {
            return this.history && this.isFront();
        }
        get title() {
            if (this.showsLiveHistory()) {
                return document.title;
            }
            else {
                return this.savedTitle;
            }
        }
        set title(title) {
            this.savedTitle = title;
            if (this.showsLiveHistory()) {
                document.title = title;
            }
        }
        get metaTags() {
            if (this.showsLiveHistory()) {
                return up.history.findMetaTags();
            }
            else {
                return this.savedMetaTags;
            }
        }
        set metaTags(metaTags) {
            this.savedMetaTags = metaTags;
            if (this.showsLiveHistory()) {
                up.history.updateMetaTags(metaTags);
            }
        }
        get location() {
            if (this.showsLiveHistory()) {
                return up.history.location;
            }
            else {
                return this.savedLocation;
            }
        }
        set location(location) {
            const previousLocation = this.location;
            location = up.history.normalizeURL(location);
            if (previousLocation !== location || this.opening) {
                this.savedLocation = location;
                if (this.showsLiveHistory()) {
                    up.history.push(location);
                }
                if (!this.opening) {
                    this.emit('up:layer:location:changed', { location });
                }
            }
        }
        selector(part) {
            return this.constructor.selector(part);
        }
        static selector(_part) {
            throw new up.NotImplemented();
        }
        toString() {
            throw new up.NotImplemented();
        }
        affix(...args) {
            return e.affix(this.getFirstSwappableElement(), ...args);
        }
        [u.isEqual.key](other) {
            return (this.constructor === other.constructor) && (this.element === other.element);
        }
        hasFocus() {
            let focusedElement = document.activeElement;
            return focusedElement !== document.body && this.element.contains(focusedElement);
        }
        reset() {
            Object.assign(this, this.defaults());
        }
    };
    
    
    /***/ }),
    /* 50 */
    /***/ (() => {
    
    const e = up.element;
    const u = up.util;
    up.Layer.Overlay = class Overlay extends up.Layer {
        keys() {
            return super.keys().concat([
                'position',
                'align',
                'size',
                'origin',
                'class',
                'backdrop',
                'openAnimation',
                'closeAnimation',
                'openDuration',
                'closeDuration',
                'openEasing',
                'closeEasing',
                'backdropOpenAnimation',
                'backdropCloseAnimation',
                'dismissable',
                'dismissLabel',
                'dismissAriaLabel',
                'onOpened',
                'onAccept',
                'onAccepted',
                'onDismiss',
                'onDismissed',
                'acceptEvent',
                'dismissEvent',
                'acceptLocation',
                'dismissLocation',
                'opening'
            ]);
        }
        constructor(options) {
            super(options);
            if (this.dismissable === true) {
                this.dismissable = ['button', 'key', 'outside'];
            }
            else if (this.dismissable === false) {
                this.dismissable = [];
            }
            else {
                this.dismissable = u.parseTokens(this.dismissable);
            }
            if (this.acceptLocation) {
                this.acceptLocation = new up.URLPattern(this.acceptLocation);
            }
            if (this.dismissLocation) {
                this.dismissLocation = new up.URLPattern(this.dismissLocation);
            }
        }
        callback(name) {
            let fn = this[name];
            if (fn) {
                return fn.bind(this);
            }
        }
        createElement(parentElement) {
            this.nesting ||= this._suggestVisualNesting();
            const elementAttrs = u.compactObject(u.pick(this, ['align', 'position', 'size', 'class', 'nesting']));
            this.element = this.affixPart(parentElement, null, elementAttrs);
        }
        createBackdropElement(parentElement) {
            this.backdropElement = this.affixPart(parentElement, 'backdrop');
        }
        createViewportElement(parentElement) {
            this.viewportElement = this.affixPart(parentElement, 'viewport', { 'up-viewport': '' });
        }
        createBoxElement(parentElement) {
            this.boxElement = this.affixPart(parentElement, 'box');
        }
        createContentElement(parentElement) {
            this.contentElement = this.affixPart(parentElement, 'content');
        }
        setContent(content) {
            this.contentElement.append(content);
            this.onContentSet();
        }
        onContentSet() {
        }
        createDismissElement(parentElement) {
            this.dismissElement = this.affixPart(parentElement, 'dismiss', {
                'up-dismiss': '":button"',
                'aria-label': this.dismissAriaLabel
            });
            return e.affix(this.dismissElement, 'span[aria-hidden="true"]', { text: this.dismissLabel });
        }
        affixPart(parentElement, part, options = {}) {
            return e.affix(parentElement, this.selector(part), options);
        }
        static selector(part) {
            return u.compact(['up', this.mode, part]).join('-');
        }
        _suggestVisualNesting() {
            const { parent } = this;
            if (this.mode === parent.mode) {
                return 1 + parent._suggestVisualNesting();
            }
            else {
                return 0;
            }
        }
        setupHandlers() {
            super.setupHandlers();
            this.overlayFocus = new up.OverlayFocus(this);
            if (this._supportsDismissMethod('button')) {
                this.createDismissElement(this.getBoxElement());
            }
            if (this._supportsDismissMethod('outside')) {
                if (this.viewportElement) {
                    up.on(this.viewportElement, 'up:click', event => {
                        if (event.target === this.viewportElement) {
                            this._onOutsideClicked(event, true);
                        }
                    });
                }
                else {
                    this.unbindParentClicked = this.parent.on('up:click', (event, element) => {
                        if (!up.layer.isWithinForeignOverlay(element)) {
                            const originClicked = this.origin && this.origin.contains(element);
                            this._onOutsideClicked(event, originClicked);
                        }
                    });
                }
            }
            if (this._supportsDismissMethod('key')) {
                this.unbindEscapePressed = up.event.onEscape(event => this.onEscapePressed(event));
            }
            this.registerClickCloser('up-accept', (value, closeOptions) => {
                this.accept(value, closeOptions);
            });
            this.registerClickCloser('up-dismiss', (value, closeOptions) => {
                this.dismiss(value, closeOptions);
            });
            up.migrate.registerLayerCloser?.(this);
            this._registerEventCloser(this.acceptEvent, this.accept);
            this._registerEventCloser(this.dismissEvent, this.dismiss);
            this.on('up:click', 'label[for]', (event, label) => this._onLabelClicked(event, label));
        }
        _onLabelClicked(event, label) {
            let id = label.getAttribute('for');
            let fieldSelector = up.form.fieldSelector(e.idSelector(id));
            let fieldsAnywhere = up.fragment.all(fieldSelector, { layer: 'any' });
            let fieldsInLayer = up.fragment.all(fieldSelector, { layer: this });
            if (fieldsAnywhere.length > 1 && fieldsInLayer[0] !== fieldsAnywhere[0]) {
                event.preventDefault();
                const field = fieldsInLayer[0];
                field.focus();
                if (field.matches('input[type=checkbox], input[type=radio]')) {
                    field.click();
                }
            }
        }
        _onOutsideClicked(event, halt) {
            up.log.putsEvent(event);
            if (halt)
                up.event.halt(event);
            this.dismiss(':outside', { origin: event.target });
        }
        onEscapePressed(event) {
            if (this.isFront()) {
                let field = up.form.focusedField();
                if (field) {
                    field.blur();
                }
                else if (this._supportsDismissMethod('key')) {
                    up.event.halt(event, { log: true });
                    this.dismiss(':key');
                }
            }
        }
        registerClickCloser(attribute, closeFn) {
            let selector = `[${attribute}]`;
            this.on('up:click', selector, function (event) {
                up.event.halt(event, { log: true });
                const origin = event.target.closest(selector);
                const value = e.jsonAttr(origin, attribute);
                const closeOptions = { origin };
                const parser = new up.OptionsParser(origin, closeOptions);
                parser.booleanOrString('animation');
                parser.string('easing');
                parser.number('duration');
                parser.string('confirm');
                up.error.muteUncriticalSync(() => closeFn(value, closeOptions));
            });
        }
        _registerEventCloser(eventTypes, closeFn) {
            if (!eventTypes) {
                return;
            }
            return this.on(eventTypes, event => {
                event.preventDefault();
                closeFn.call(this, event, { response: event.response });
            });
        }
        tryAcceptForLocation(options) {
            this._tryCloseForLocation(this.acceptLocation, this.accept, options);
        }
        tryDismissForLocation(options) {
            this._tryCloseForLocation(this.dismissLocation, this.dismiss, options);
        }
        _tryCloseForLocation(urlPattern, closeFn, options) {
            let location, resolution;
            if (urlPattern && (location = this.location) && (resolution = urlPattern.recognize(location))) {
                const closeValue = { ...resolution, location };
                closeFn.call(this, closeValue, options);
            }
        }
        teardownHandlers() {
            super.teardownHandlers();
            this.unbindParentClicked?.();
            this.unbindEscapePressed?.();
            this.overlayFocus.teardown();
        }
        destroyElements(options) {
            const animation = () => this.startCloseAnimation(options);
            const onFinished = () => {
                this.onElementsRemoved();
                options.onFinished?.();
            };
            const destroyOptions = { ...options, animation, onFinished, log: false };
            up.destroy(this.element, destroyOptions);
        }
        onElementsRemoved() {
        }
        _startAnimation(options = {}) {
            const boxDone = up.animate(this.getBoxElement(), options.boxAnimation, options);
            let backdropDone;
            if (this.backdrop && !up.motion.isNone(options.boxAnimation)) {
                backdropDone = up.animate(this.backdropElement, options.backdropAnimation, options);
            }
            return Promise.all([boxDone, backdropDone]);
        }
        async startOpenAnimation(options = {}) {
            await this._startAnimation({
                boxAnimation: options.animation ?? this.evalOption(this.openAnimation),
                backdropAnimation: 'fade-in',
                easing: options.easing || this.openEasing,
                duration: options.duration || this.openDuration
            });
            this.wasEverVisible = true;
        }
        startCloseAnimation(options = {}) {
            return this._startAnimation({
                boxAnimation: this.wasEverVisible && (options.animation ?? this.evalOption(this.closeAnimation)),
                backdropAnimation: this.wasEverVisible && 'fade-out',
                easing: options.easing || this.closeEasing,
                duration: options.duration || this.closeDuration
            });
        }
        accept(value = null, options = {}) {
            return this._executeCloseChange('accept', value, options);
        }
        dismiss(value = null, options = {}) {
            return this._executeCloseChange('dismiss', value, options);
        }
        _supportsDismissMethod(method) {
            return u.contains(this.dismissable, method);
        }
        _executeCloseChange(verb, value, options) {
            options = { ...options, verb, value, layer: this };
            return new up.Change.CloseLayer(options).execute();
        }
        getFirstSwappableElement() {
            return this.getContentElement().children[0];
        }
        toString() {
            return `${this.mode} overlay`;
        }
    };
    
    
    /***/ }),
    /* 51 */
    /***/ (() => {
    
    up.Layer.OverlayWithTether = class OverlayWithTether extends up.Layer.Overlay {
        createElements() {
            if (!this.origin) {
                up.fail('Missing { origin } option');
            }
            this._tether = new up.Tether({
                anchor: this.origin,
                align: this.align,
                position: this.position
            });
            this.createElement(this._tether.parent);
            this.createContentElement(this.element);
        }
        onContentSet() {
            this._tether.start(this.element);
        }
        onElementsRemoved() {
            this._tether.stop();
        }
        sync() {
            if (this.isOpen()) {
                if (this.isDetached() || this._tether.isDetached()) {
                    this.dismiss(':detached', {
                        animation: false,
                        preventable: false
                    });
                }
                else {
                    this._tether.sync();
                }
            }
        }
    };
    
    
    /***/ }),
    /* 52 */
    /***/ (() => {
    
    up.Layer.OverlayWithViewport = class OverlayWithViewport extends up.Layer.Overlay {
        static getParentElement() {
            return document.body;
        }
        createElements() {
            up.viewport.bodyShifter.raiseStack();
            this.createElement(this.constructor.getParentElement());
            if (this.backdrop) {
                this.createBackdropElement(this.element);
            }
            this.createViewportElement(this.element);
            this.createBoxElement(this.viewportElement);
            this.createContentElement(this.boxElement);
        }
        onElementsRemoved() {
            up.viewport.bodyShifter.lowerStack();
        }
        sync() {
            if (this.isDetached() && this.isOpen()) {
                this.constructor.getParentElement().appendChild(this.element);
            }
        }
    };
    
    
    /***/ }),
    /* 53 */
    /***/ (() => {
    
    var _a;
    const e = up.element;
    up.Layer.Root = (_a = class Root extends up.Layer {
            get element() {
                return e.root;
            }
            constructor(options) {
                super(options);
                this.setupHandlers();
            }
            getFirstSwappableElement() {
                return document.body;
            }
            static selector() {
                return 'html';
            }
            setupHandlers() {
                if (!this.element.upHandlersApplied) {
                    this.element.upHandlersApplied = true;
                    super.setupHandlers();
                }
            }
            sync() {
                this.setupHandlers();
            }
            accept() {
                this._cannotCloseRoot();
            }
            dismiss() {
                this._cannotCloseRoot();
            }
            _cannotCloseRoot() {
                up.fail('Cannot close the root layer');
            }
            toString() {
                return "root layer";
            }
        },
        _a.mode = 'root',
        _a);
    
    
    /***/ }),
    /* 54 */
    /***/ (() => {
    
    var _a;
    up.Layer.Modal = (_a = class Modal extends up.Layer.OverlayWithViewport {
        },
        _a.mode = 'modal',
        _a);
    
    
    /***/ }),
    /* 55 */
    /***/ (() => {
    
    var _a;
    up.Layer.Popup = (_a = class Popup extends up.Layer.OverlayWithTether {
        },
        _a.mode = 'popup',
        _a);
    
    
    /***/ }),
    /* 56 */
    /***/ (() => {
    
    var _a;
    up.Layer.Drawer = (_a = class Drawer extends up.Layer.OverlayWithViewport {
        },
        _a.mode = 'drawer',
        _a);
    
    
    /***/ }),
    /* 57 */
    /***/ (() => {
    
    var _a;
    up.Layer.Cover = (_a = class Cover extends up.Layer.OverlayWithViewport {
        },
        _a.mode = 'cover',
        _a);
    
    
    /***/ }),
    /* 58 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.LayerLookup = class LayerLookup {
        constructor(stack, ...args) {
            this._stack = stack;
            const options = u.parseArgIntoOptions(args, 'layer');
            if (options.normalizeLayerOptions !== false) {
                up.layer.normalizeOptions(options);
            }
            this._values = u.parseTokens(options.layer);
            this._origin = options.origin;
            this._baseLayer = options.baseLayer || this._originLayer() || this._stack.current;
            if (u.isString(this._baseLayer)) {
                const recursiveOptions = { ...options, baseLayer: this._stack.current, normalizeLayerOptions: false };
                this._baseLayer = new this.constructor(this._stack, this._baseLayer, recursiveOptions).first();
            }
        }
        _originLayer() {
            if (this._origin) {
                return this._forElement(this._origin);
            }
        }
        first() {
            return this.all()[0];
        }
        all() {
            let results = u.flatMap(this._values, value => this._resolveValue(value));
            results = u.compact(results);
            results = u.uniq(results);
            return results;
        }
        _forElement(element) {
            element = e.get(element);
            return u.find(this._stack.reversed(), layer => layer.contains(element));
        }
        _forIndex(value) {
            return this._stack.at(value);
        }
        _resolveValue(value) {
            if (value instanceof up.Layer) {
                return value;
            }
            if (u.isNumber(value)) {
                return this._forIndex(value);
            }
            if (/^\d+$/.test(value)) {
                return this._forIndex(Number(value));
            }
            if (u.isElementish(value)) {
                return this._forElement(value);
            }
            switch (value) {
                case 'any':
                    return [this._baseLayer, ...this._stack.reversed()];
                case 'current':
                    return this._baseLayer;
                case 'closest':
                    return this._stack.selfAndAncestorsOf(this._baseLayer);
                case 'parent':
                    return this._baseLayer.parent;
                case 'ancestor':
                case 'ancestors':
                    return this._baseLayer.ancestors;
                case 'child':
                    return this._baseLayer.child;
                case 'descendant':
                case 'descendants':
                    return this._baseLayer.descendants;
                case 'subtree':
                    return this._baseLayer.subtree;
                case 'new':
                    return 'new';
                case 'root':
                    return this._stack.root;
                case 'overlay':
                case 'overlays':
                    return u.reverse(this._stack.overlays);
                case 'front':
                    return this._stack.front;
                case 'origin':
                    return this._originLayer();
                default:
                    return up.fail("Unknown { layer } option: %o", value);
            }
        }
    };
    
    
    /***/ }),
    /* 59 */
    /***/ (() => {
    
    const u = up.util;
    up.LayerStack = class LayerStack {
        constructor() {
            this._currentOverrides = [];
            this.layers = [this._buildRoot()];
        }
        _buildRoot() {
            return up.layer.build({ mode: 'root', stack: this });
        }
        remove(layer) {
            u.remove(this.layers, layer);
        }
        peel(layer, options) {
            const descendants = u.reverse(layer.descendants);
            const dismissOptions = { ...options, preventable: false };
            for (let descendant of descendants) {
                descendant.dismiss(':peel', dismissOptions);
            }
        }
        reset() {
            this.peel(this.root, { animation: false });
            this._currentOverrides = [];
            this.root.reset();
        }
        isOpen(layer) {
            return u.contains(this.layers, layer);
        }
        isClosed(layer) {
            return !this.isOpen(layer);
        }
        parentOf(layer) {
            return this.layers[layer.index - 1];
        }
        childOf(layer) {
            return this.layers[layer.index + 1];
        }
        ancestorsOf(layer) {
            return u.reverse(this.layers.slice(0, layer.index));
        }
        selfAndAncestorsOf(layer) {
            return [layer, ...layer.ancestors];
        }
        descendantsOf(layer) {
            return this.layers.slice(layer.index + 1);
        }
        isRoot(layer) {
            return this.root === layer;
        }
        isOverlay(layer) {
            return this.root !== layer;
        }
        isCurrent(layer) {
            return this.current === layer;
        }
        isFront(layer) {
            return this.front === layer;
        }
        get(...args) {
            return this.getAll(...args)[0];
        }
        getAll(...args) {
            return new up.LayerLookup(this, ...args).all();
        }
        sync() {
            for (let layer of this.layers) {
                layer.sync();
            }
        }
        asCurrent(layer, fn) {
            try {
                this._currentOverrides.push(layer);
                return fn();
            }
            finally {
                this._currentOverrides.pop();
            }
        }
        reversed() {
            return u.reverse(this.layers);
        }
        dismissOverlays(value = null, options = {}) {
            options.dismissable = false;
            for (let overlay of u.reverse(this.overlays)) {
                overlay.dismiss(value, options);
            }
        }
        at(index) {
            return this.layers[index];
        }
        indexOf(layer) {
            return this.layers.indexOf(layer);
        }
        get count() {
            return this.layers.length;
        }
        get root() {
            return this.layers[0];
        }
        get overlays() {
            return this.root.descendants;
        }
        get current() {
            return u.last(this._currentOverrides) || this.front;
        }
        get front() {
            return u.last(this.layers);
        }
    };
    
    
    /***/ }),
    /* 60 */
    /***/ (() => {
    
    up.LinkFeedbackURLs = class LinkFeedbackURLs {
        constructor(link) {
            const normalize = up.feedback.normalizeURL;
            this._isSafe = up.link.isSafe(link);
            if (this._isSafe) {
                const href = link.getAttribute('href');
                if (href && (href !== '#')) {
                    this.href = normalize(href);
                }
                const upHREF = link.getAttribute('up-href');
                if (upHREF) {
                    this._upHREF = normalize(upHREF);
                }
                const alias = link.getAttribute('up-alias');
                if (alias) {
                    this._aliasPattern = new up.URLPattern(alias, normalize);
                }
            }
        }
        isCurrent(normalizedLocation) {
            return this._isSafe && !!(this.href === normalizedLocation ||
                this._upHREF === normalizedLocation ||
                this._aliasPattern?.test?.(normalizedLocation, false));
        }
    };
    
    
    /***/ }),
    /* 61 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.LinkPreloader = class LinkPreloader {
        watchLink(link) {
            if (!up.link.preloadIssue(link)) {
                this._on(link, 'mouseenter', (event) => this._considerPreload(event, true));
                this._on(link, 'mousedown touchstart', (event) => this._considerPreload(event));
                this._on(link, 'mouseleave', (event) => this._stopPreload(event));
            }
        }
        _on(link, eventTypes, callback) {
            up.on(link, eventTypes, { passive: true }, callback);
        }
        _considerPreload(event, applyDelay) {
            const link = event.target;
            if (link !== this._currentLink) {
                this.reset();
                this._currentLink = link;
                if (up.link.shouldFollowEvent(event, link)) {
                    if (applyDelay) {
                        this._preloadAfterDelay(event, link);
                    }
                    else {
                        this._preloadNow(event, link);
                    }
                }
            }
        }
        _stopPreload(event) {
            if (event.target === this._currentLink) {
                return this.reset();
            }
        }
        reset() {
            if (!this._currentLink) {
                return;
            }
            clearTimeout(this._timer);
            if (this._currentRequest?.background) {
                this._currentRequest.abort();
            }
            this._currentLink = undefined;
            this._currentRequest = undefined;
        }
        _preloadAfterDelay(event, link) {
            const delay = e.numberAttr(link, 'up-preload-delay') ?? up.link.config.preloadDelay;
            this._timer = u.timer(delay, () => this._preloadNow(event, link));
        }
        _preloadNow(event, link) {
            if (!link.isConnected) {
                this.reset();
                return;
            }
            const onQueued = request => { return this._currentRequest = request; };
            up.log.putsEvent(event);
            up.error.muteUncriticalRejection(up.link.preload(link, { onQueued }));
        }
    };
    
    
    /***/ }),
    /* 62 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.MotionController = class MotionController {
        constructor(name) {
            this._activeClass = `up-${name}`;
            this._selector = `.${this._activeClass}`;
            this.finishEvent = `up:${name}:finish`;
            this.finishCount = 0;
            this._clusterCount = 0;
        }
        startFunction(cluster, startMotion, memory = {}) {
            cluster = e.list(cluster);
            const mutedAnimator = () => up.error.muteUncriticalRejection(startMotion());
            memory.trackMotion = memory.trackMotion ?? up.motion.isEnabled();
            if (memory.trackMotion === false) {
                return mutedAnimator();
            }
            else {
                memory.trackMotion = false;
                this.finish(cluster);
                this._markCluster(cluster);
                let promise = this._whileForwardingFinishEvent(cluster, mutedAnimator);
                promise = promise.then(() => this._unmarkCluster(cluster));
                return promise;
            }
        }
        finish(elements) {
            this.finishCount++;
            if ((this._clusterCount === 0) || !up.motion.isEnabled()) {
                return;
            }
            elements = this._expandFinishRequest(elements);
            for (let element of elements) {
                this._finishOneElement(element);
            }
            return up.migrate.formerlyAsync?.('up.motion.finish()');
        }
        _expandFinishRequest(elements) {
            if (elements) {
                return u.flatMap(elements, el => e.list(el.closest(this._selector), el.querySelectorAll(this._selector)));
            }
            else {
                return document.querySelectorAll(this._selector);
            }
        }
        isActive(element) {
            return element.classList.contains(this._activeClass);
        }
        _finishOneElement(element) {
            this._emitFinishEvent(element);
        }
        _emitFinishEvent(element, eventAttrs = {}) {
            eventAttrs = { target: element, log: false, ...eventAttrs };
            return up.emit(this.finishEvent, eventAttrs);
        }
        _markCluster(cluster) {
            this._clusterCount++;
            this._toggleActive(cluster, true);
        }
        _unmarkCluster(cluster) {
            this._clusterCount--;
            this._toggleActive(cluster, false);
        }
        _toggleActive(cluster, isActive) {
            for (let element of cluster) {
                element.classList.toggle(this._activeClass, isActive);
            }
        }
        _whileForwardingFinishEvent(cluster, fn) {
            if (cluster.length < 2) {
                return fn();
            }
            const doForward = (event) => {
                if (!event.forwarded) {
                    for (let element of cluster) {
                        if (element !== event.target && this.isActive(element)) {
                            this._emitFinishEvent(element, { forwarded: true });
                        }
                    }
                }
            };
            const unbindFinish = up.on(cluster, this.finishEvent, doForward);
            return fn().then(unbindFinish);
        }
        async reset() {
            await this.finish();
            this.finishCount = 0;
            this._clusterCount = 0;
        }
    };
    
    
    /***/ }),
    /* 63 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.NonceableCallback = class NonceableCallback {
        constructor(script, nonce) {
            this.script = script;
            this.nonce = nonce;
        }
        static fromString(string) {
            let match = string.match(/^(nonce-([^\s]+)\s)?(.*)$/);
            return new this(match[3], match[2]);
        }
        toFunction(...argNames) {
            if (this.nonce) {
                let callbackThis = this;
                return function (...args) {
                    return callbackThis._runAsNoncedFunction(this, argNames, args);
                };
            }
            else {
                return new Function(...argNames, this.script);
            }
        }
        toString() {
            return `nonce-${this.nonce} ${this.script}`;
        }
        _runAsNoncedFunction(thisArg, argNames, args) {
            let wrappedScript = `
          try {
            up.noncedEval.value = (function(${argNames.join()}) {
              ${this.script}
            }).apply(up.noncedEval.thisArg, up.noncedEval.args)
          } catch (error) {
            up.noncedEval.error = error
          }
        `;
            let script;
            try {
                up.noncedEval = { args, thisArg: thisArg };
                script = up.element.affix(document.body, 'script', { nonce: this.nonce, text: wrappedScript });
                if (up.noncedEval.error) {
                    throw up.noncedEval.error;
                }
                else {
                    return up.noncedEval.value;
                }
            }
            finally {
                up.noncedEval = undefined;
                if (script) {
                    script.remove();
                }
            }
        }
        _allowedBy(allowedNonces) {
            return this.nonce && u.contains(allowedNonces, this.nonce);
        }
        static adoptNonces(element, allowedNonces) {
            if (!allowedNonces?.length) {
                return;
            }
            const getPageNonce = u.memoize(up.protocol.cspNonce);
            u.each(up.script.config.nonceableAttributes, (attribute) => {
                let matches = e.subtree(element, `[${attribute}^="nonce-"]`);
                u.each(matches, (match) => {
                    let attributeValue = match.getAttribute(attribute);
                    let callback = this.fromString(attributeValue);
                    let warn = (message, ...args) => up.log.warn('up.render()', `Cannot use callback [${attribute}="${attributeValue}"]: ${message}`, ...args);
                    if (!callback._allowedBy(allowedNonces)) {
                        return warn("Callback's CSP nonce (%o) does not match response header (%o)", callback.nonce, allowedNonces);
                    }
                    let pageNonce = getPageNonce();
                    if (!pageNonce) {
                        return warn("Current page's CSP nonce is unknown");
                    }
                    callback.nonce = pageNonce;
                    match.setAttribute(attribute, callback.toString());
                });
            });
        }
    };
    
    
    /***/ }),
    /* 64 */
    /***/ (() => {
    
    const e = up.element;
    const u = up.util;
    up.OverlayFocus = class OverlayFocus {
        constructor(layer) {
            this._layer = layer;
            this._focusElement = this._layer.getFocusElement();
        }
        moveToFront() {
            if (this._enabled) {
                return;
            }
            this._enabled = true;
            this._untrapFocus = up.on('focusin', event => this._onFocus(event));
            this._unsetAttrs = e.setTemporaryAttrs(this._focusElement, {
                'tabindex': '0',
                'role': 'dialog',
                'aria-modal': 'true'
            });
            this._focusTrapBefore = e.affix(this._focusElement, 'beforebegin', 'up-focus-trap[tabindex=0]');
            this._focusTrapAfter = e.affix(this._focusElement, 'afterend', 'up-focus-trap[tabindex=0]');
        }
        moveToBack() {
            this.teardown();
        }
        teardown() {
            if (!this._enabled) {
                return;
            }
            this._enabled = false;
            this._untrapFocus();
            this._unsetAttrs();
            this._focusTrapBefore.remove();
            this._focusTrapAfter.remove();
        }
        _onFocus(event) {
            const { target } = event;
            if (this._processingFocusEvent || up.layer.isWithinForeignOverlay(target)) {
                return;
            }
            this._processingFocusEvent = true;
            if (target === this._focusTrapBefore) {
                this._focusEnd();
            }
            else if ((target === this._focusTrapAfter) || !this._layer.contains(target)) {
                this._focusStart();
            }
            this._processingFocusEvent = false;
        }
        _focusStart(focusOptions) {
            up.focus(this._focusElement, focusOptions);
        }
        _focusEnd() {
            this._focusLastDescendant(this._layer.getBoxElement()) || this._focusStart();
        }
        _focusLastDescendant(element) {
            for (let child of u.reverse(element.children)) {
                if (up.viewport.tryFocus(child) || this._focusLastDescendant(child)) {
                    return true;
                }
            }
        }
    };
    
    
    /***/ }),
    /* 65 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.Params = class Params {
        constructor(raw) {
            this.clear();
            this.addAll(raw);
        }
        clear() {
            this.entries = [];
        }
        [u.copy.key]() {
            return new up.Params(this);
        }
        toObject() {
            const obj = {};
            for (let entry of this.entries) {
                const { name, value } = entry;
                if (!u.isBasicObjectProperty(name)) {
                    if (this._isArrayKey(name)) {
                        obj[name] ||= [];
                        obj[name].push(value);
                    }
                    else {
                        obj[name] = value;
                    }
                }
            }
            return obj;
        }
        toArray() {
            return this.entries;
        }
        toFormData() {
            const formData = new FormData();
            for (let entry of this.entries) {
                formData.append(entry.name, entry.value);
            }
            if (!formData.entries) {
                formData.originalArray = this.entries;
            }
            return formData;
        }
        toQuery() {
            let parts = u.map(this.entries, this._arrayEntryToQuery.bind(this));
            parts = u.compact(parts);
            return parts.join('&');
        }
        _arrayEntryToQuery(entry) {
            const { value } = entry;
            if (this._isBinaryValue(value)) {
                return;
            }
            let query = encodeURIComponent(entry.name);
            if (u.isGiven(value)) {
                query += "=";
                query += encodeURIComponent(value);
            }
            return query;
        }
        _isBinaryValue(value) {
            return value instanceof Blob;
        }
        hasBinaryValues() {
            const values = u.map(this.entries, 'value');
            return u.some(values, this._isBinaryValue);
        }
        toURL(base) {
            let parts = [base, this.toQuery()];
            parts = u.filter(parts, u.isPresent);
            const separator = u.contains(base, '?') ? '&' : '?';
            return parts.join(separator);
        }
        add(name, value) {
            this.entries.push({ name, value });
        }
        addAll(raw) {
            if (u.isMissing(raw)) {
            }
            else if (raw instanceof this.constructor) {
                this.entries.push(...raw.entries);
            }
            else if (u.isArray(raw)) {
                this.entries.push(...raw);
            }
            else if (u.isString(raw)) {
                this._addAllFromQuery(raw);
            }
            else if (u.isFormData(raw)) {
                this._addAllFromFormData(raw);
            }
            else if (u.isObject(raw)) {
                this._addAllFromObject(raw);
            }
            else {
                up.fail("Unsupport params type: %o", raw);
            }
        }
        _addAllFromObject(object) {
            for (let key in object) {
                const value = object[key];
                const valueElements = u.isArray(value) ? value : [value];
                for (let valueElement of valueElements) {
                    this.add(key, valueElement);
                }
            }
        }
        _addAllFromQuery(query) {
            for (let part of query.split('&')) {
                if (part) {
                    let [name, value] = part.split('=');
                    name = decodeURIComponent(name);
                    if (u.isGiven(value)) {
                        value = decodeURIComponent(value);
                    }
                    else {
                        value = null;
                    }
                    this.add(name, value);
                }
            }
        }
        _addAllFromFormData(formData) {
            for (let value of formData.entries()) {
                this.add(...value);
            }
        }
        set(name, value) {
            this.delete(name);
            this.add(name, value);
        }
        delete(name) {
            this.entries = u.reject(this.entries, this._matchEntryFn(name));
        }
        _matchEntryFn(name) {
            return entry => entry.name === name;
        }
        get(name) {
            if (this._isArrayKey(name)) {
                return this.getAll(name);
            }
            else {
                return this.getFirst(name);
            }
        }
        getFirst(name) {
            const entry = u.find(this.entries, this._matchEntryFn(name));
            return entry?.value;
        }
        getAll(name) {
            if (this._isArrayKey(name)) {
                return this.getAll(name);
            }
            else {
                const entries = u.map(this.entries, this._matchEntryFn(name));
                return u.map(entries, 'value');
            }
        }
        _isArrayKey(key) {
            return key.endsWith('[]');
        }
        [u.isBlank.key]() {
            return this.entries.length === 0;
        }
        static fromForm(form) {
            return this.fromContainer(form);
        }
        static fromContainer(container) {
            let fields = up.form.fields(container);
            return this.fromFields(fields);
        }
        static fromFields(fields) {
            const params = new (this)();
            for (let field of u.wrapList(fields)) {
                params.addField(field);
            }
            return params;
        }
        addField(field) {
            field = e.get(field);
            let name = field.name;
            if (name && !field.disabled) {
                const { tagName } = field;
                const { type } = field;
                if (tagName === 'SELECT') {
                    for (let option of field.querySelectorAll('option')) {
                        if (option.selected) {
                            this.add(name, option.value);
                        }
                    }
                }
                else if ((type === 'checkbox') || (type === 'radio')) {
                    if (field.checked) {
                        this.add(name, field.value);
                    }
                }
                else if (type === 'file') {
                    for (let file of field.files) {
                        this.add(name, file);
                    }
                }
                else {
                    return this.add(name, field.value);
                }
            }
        }
        [u.isEqual.key](other) {
            return (this.constructor === other.constructor) && u.isEqual(this.entries, other.entries);
        }
        static fromURL(url) {
            const params = new (this)();
            const urlParts = u.parseURL(url);
            let query = urlParts.search;
            if (query) {
                query = query.replace(/^\?/, '');
                params.addAll(query);
            }
            return params;
        }
        static stripURL(url) {
            return u.normalizeURL(url, { search: false });
        }
        static merge(...objects) {
            return objects.reduce(function (allParams, params) {
                allParams.addAll(params);
                return allParams;
            }, new up.Params());
        }
    };
    
    
    /***/ }),
    /* 66 */
    /***/ (() => {
    
    const e = up.element;
    const TRANSITION_DELAY = 300;
    up.ProgressBar = class ProgressBar {
        constructor() {
            this._step = 0;
            this._element = e.affix(document.body, 'up-progress-bar');
            this._element.style.transition = `width ${TRANSITION_DELAY}ms ease-out`;
            this._moveTo(0);
            up.element.paint(this._element);
            this._width = 31;
            this._nextStep();
        }
        _nextStep() {
            let diff;
            if (this._width < 80) {
                if (Math.random() < 0.15) {
                    diff = 7 + (5 * Math.random());
                }
                else {
                    diff = 1.5 + (0.5 * Math.random());
                }
            }
            else {
                diff = 0.13 * (100 - this._width) * Math.random();
            }
            this._moveTo(this._width + diff);
            this._step++;
            const nextStepDelay = TRANSITION_DELAY + (this._step * 40);
            this.timeout = setTimeout(this._nextStep.bind(this), nextStepDelay);
        }
        _moveTo(width) {
            this._width = width;
            this._element.style.width = `${width}vw`;
        }
        destroy() {
            clearTimeout(this.timeout);
            this._element.remove();
        }
        conclude() {
            clearTimeout(this.timeout);
            this._moveTo(100);
            setTimeout(this.destroy.bind(this), TRANSITION_DELAY);
        }
    };
    
    
    /***/ }),
    /* 67 */
    /***/ (() => {
    
    const u = up.util;
    up.RenderOptions = (function () {
        const GLOBAL_DEFAULTS = {
            useHungry: true,
            useKeep: true,
            saveScroll: true,
            saveFocus: true,
            focus: 'keep',
            abort: 'target',
            failOptions: true,
        };
        const PRELOAD_OVERRIDES = {
            abort: false,
            confirm: false,
            feedback: false,
            cache: true,
            background: true,
        };
        const PREFLIGHT_KEYS = [
            'url',
            'method',
            'origin',
            'headers',
            'params',
            'cache',
            'fallback',
            'abort',
            'abortable',
            'confirm',
            'feedback',
            'origin',
            'baseLayer',
            'fail',
            'onError',
        ];
        const SHARED_KEYS = PREFLIGHT_KEYS.concat([
            'keep',
            'hungry',
            'history',
            'source',
            'saveScroll',
            'navigate',
        ]);
        const CONTENT_KEYS = [
            'url',
            'response',
            'content',
            'fragment',
            'document',
        ];
        const LATE_KEYS = [
            'history',
            'focus',
            'scroll',
        ];
        function navigateDefaults(options) {
            if (options.navigate) {
                return up.fragment.config.navigateOptions;
            }
        }
        function preloadOverrides(options) {
            if (options.preload) {
                return PRELOAD_OVERRIDES;
            }
        }
        function preprocess(options) {
            up.migrate.preprocessRenderOptions?.(options);
            const defaults = u.merge(GLOBAL_DEFAULTS, navigateDefaults(options));
            return u.merge(u.omit(defaults, LATE_KEYS), { defaults }, { inputDevice: up.event.inputDevice }, options, preloadOverrides(options));
        }
        function finalize(preprocessedOptions, lateDefaults) {
            return u.merge(preprocessedOptions.defaults, lateDefaults, preprocessedOptions);
        }
        function assertContentGiven(options) {
            if (!u.some(CONTENT_KEYS, contentKey => u.isGiven(options[contentKey]))) {
                if (options.defaultToEmptyContent) {
                    options.content = '';
                }
                else {
                    up.fail('up.render() needs either { ' + CONTENT_KEYS.join(', ') + ' } option');
                }
            }
        }
        function failOverrides(options) {
            const overrides = {};
            for (let key in options) {
                const value = options[key];
                let unprefixed = up.fragment.successKey(key);
                if (unprefixed) {
                    overrides[unprefixed] = value;
                }
            }
            return overrides;
        }
        function deriveFailOptions(preprocessedOptions) {
            if (preprocessedOptions.failOptions) {
                return {
                    ...preprocessedOptions.defaults,
                    ...u.pick(preprocessedOptions, SHARED_KEYS),
                    ...failOverrides(preprocessedOptions),
                    ...{ failPrefixForced: true }
                };
            }
            else {
                return {
                    ...preprocessedOptions,
                    ...failOverrides(preprocessedOptions),
                };
            }
        }
        return {
            preprocess,
            finalize,
            assertContentGiven,
            deriveFailOptions,
        };
    })();
    
    
    /***/ }),
    /* 68 */
    /***/ (() => {
    
    up.RenderResult = class RenderResult extends up.Record {
        keys() {
            return [
                'fragments',
                'layer',
                'target',
                'options',
                'finished',
            ];
        }
        defaults() {
            return {
                fragments: [],
            };
        }
        get none() {
            return !this.fragments.length;
        }
        get fragment() {
            return this.fragments[0];
        }
        static both(main, extension, mergeFinished = true) {
            if (!extension)
                return main;
            return new this({
                target: main.target,
                layer: main.layer,
                options: main.options,
                fragments: main.fragments.concat(extension.fragments),
                finished: (mergeFinished && this.mergeFinished(main, extension))
            });
        }
        static async mergeFinished(main, extension) {
            return this.both(await main.finished, await extension.finished, false);
        }
        static buildNone() {
            return new this({
                target: ':none',
                finished: Promise.resolve(),
            });
        }
    };
    
    
    /***/ }),
    /* 69 */
    /***/ (() => {
    
    var _a;
    const u = up.util;
    up.Request = (_a = class Request extends up.Record {
            keys() {
                return [
                    'method',
                    'url',
                    'hash',
                    'params',
                    'target',
                    'failTarget',
                    'headers',
                    'timeout',
                    'background',
                    'cache',
                    'expireCache',
                    'evictCache',
                    'layer',
                    'mode',
                    'context',
                    'failLayer',
                    'failMode',
                    'failContext',
                    'origin',
                    'fragments',
                    'builtAt',
                    'wrapMethod',
                    'contentType',
                    'payload',
                    'onQueued',
                    'onLoading',
                    'fail',
                    'abortable',
                    'badResponseTime',
                ];
            }
            defaults() {
                return {
                    state: 'new',
                    abortable: true,
                    headers: {},
                    timeout: up.network.config.timeout,
                    builtAt: new Date(),
                };
            }
            constructor(options) {
                super(options);
                this.params = new up.Params(this.params);
                if (this.wrapMethod == null) {
                    this.wrapMethod = up.network.config.wrapMethod;
                }
                this._normalize();
                if ((this.target || this.layer || this.origin) && !options.basic) {
                    const layerLookupOptions = { origin: this.origin };
                    this.layer = up.layer.get(this.layer, layerLookupOptions);
                    this.failLayer = up.layer.get(this.failLayer, layerLookupOptions);
                    this.context ||= this.layer.context || {};
                    this.failContext ||= this.failLayer?.context || {};
                    this.mode ||= this.layer.mode;
                    this.failMode ||= this.failLayer?.mode;
                }
                this.deferred = u.newDeferred();
                this.badResponseTime ??= u.evalOption(up.network.config.badResponseTime, this);
                this._addAutoHeaders();
            }
            get xhr() {
                return this._xhr ??= new XMLHttpRequest();
            }
            get fragments() {
                if (this._fragments) {
                    return this._fragments;
                }
                else if (this.target) {
                    let steps = up.fragment.parseTargetSteps(this.target);
                    let selectors = u.map(steps, 'selector');
                    let lookupOpts = { origin: this.origin, layer: this.layer };
                    return u.compact(u.map(selectors, (selector) => up.fragment.get(selector, lookupOpts)));
                }
            }
            set fragments(value) {
                this._fragments = value;
            }
            get fragment() {
                return this.fragments?.[0];
            }
            _normalize() {
                this.method = u.normalizeMethod(this.method);
                this._extractHashFromURL();
                this._transferParamsToURL();
                this.url = u.normalizeURL(this.url);
            }
            _evictExpensiveAttrs() {
                u.task(() => {
                    this.layer = undefined;
                    this.failLayer = undefined;
                    this.origin = undefined;
                    this.fragments = undefined;
                });
            }
            _extractHashFromURL() {
                let match = this.url?.match(/^([^#]*)(#.+)$/);
                if (match) {
                    this.url = match[1];
                    return this.hash = match[2];
                }
            }
            _transferParamsToURL() {
                if (!this.url || this.allowsPayload() || u.isBlank(this.params)) {
                    return;
                }
                this.url = this.params.toURL(this.url);
                this.params.clear();
            }
            isSafe() {
                return up.network.isSafeMethod(this.method);
            }
            allowsPayload() {
                return u.methodAllowsPayload(this.method);
            }
            will302RedirectWithGET() {
                return this.isSafe() || (this.method === 'POST');
            }
            willCache() {
                return u.evalAutoOption(this.cache, up.network.config.autoCache, this);
            }
            runQueuedCallbacks() {
                u.always(this, () => this._evictExpensiveAttrs());
                this.onQueued?.(this);
            }
            load() {
                if (this.state !== 'new')
                    return;
                if (this._emitLoad()) {
                    this.state = 'loading';
                    this._normalize();
                    this.onLoading?.();
                    this.expired = false;
                    new up.Request.XHRRenderer(this).buildAndSend({
                        onload: () => this._onXHRLoad(),
                        onerror: () => this._onXHRError(),
                        ontimeout: () => this._onXHRTimeout(),
                        onabort: () => this._onXHRAbort()
                    });
                    return true;
                }
                else {
                    this.abort({ reason: 'Prevented by event listener' });
                }
            }
            _emitLoad() {
                let event = this.emit('up:request:load', { log: ['Loading %s', this.description] });
                return !event.defaultPrevented;
            }
            loadPage() {
                up.network.abort();
                new up.Request.FormRenderer(this).buildAndSubmit();
            }
            _onXHRLoad() {
                const response = this._extractResponseFromXHR();
                const log = 'Loaded ' + response.description;
                this.emit('up:request:loaded', { request: response.request, response, log });
                this.respondWith(response);
            }
            _onXHRError() {
                this._setOfflineState('Network error');
            }
            _onXHRTimeout() {
                this._setOfflineState('Timeout');
            }
            _onXHRAbort() {
                this._setAbortedState();
            }
            abort({ reason } = {}) {
                if (this._setAbortedState(reason) && this._xhr) {
                    this._xhr.abort();
                }
            }
            _setAbortedState(reason) {
                if (this._isSettled())
                    return;
                let message = 'Aborted request to ' + this.description + (reason ? ': ' + reason : '');
                this.state = 'aborted';
                this.deferred.reject(new up.Aborted(message));
                this.emit('up:request:aborted', { log: message });
                return true;
            }
            _setOfflineState(reason) {
                if (this._isSettled())
                    return;
                let message = 'Cannot load request to ' + this.description + (reason ? ': ' + reason : '');
                this.state = 'offline';
                this.emit('up:request:offline', { log: message });
                this.deferred.reject(new up.Offline(message));
            }
            respondWith(response) {
                this.response = response;
                if (this._isSettled())
                    return;
                this.state = 'loaded';
                if (response.ok) {
                    this.deferred.resolve(response);
                }
                else {
                    this.deferred.reject(response);
                }
            }
            _isSettled() {
                return (this.state !== 'new') && (this.state !== 'loading') && (this.state !== 'tracking');
            }
            csrfHeader() {
                return up.protocol.csrfHeader();
            }
            csrfParam() {
                return up.protocol.csrfParam();
            }
            csrfToken() {
                if (!this.isSafe() && !this.isCrossOrigin()) {
                    return up.protocol.csrfToken();
                }
            }
            isCrossOrigin() {
                return u.isCrossOrigin(this.url);
            }
            _extractResponseFromXHR() {
                const responseAttrs = {
                    method: this.method,
                    url: this.url,
                    request: this,
                    xhr: this.xhr,
                    text: this.xhr.responseText,
                    status: this.xhr.status,
                    title: up.protocol.titleFromXHR(this.xhr),
                    target: up.protocol.targetFromXHR(this.xhr),
                    acceptLayer: up.protocol.acceptLayerFromXHR(this.xhr),
                    dismissLayer: up.protocol.dismissLayerFromXHR(this.xhr),
                    eventPlans: up.protocol.eventPlansFromXHR(this.xhr),
                    context: up.protocol.contextFromXHR(this.xhr),
                    expireCache: up.protocol.expireCacheFromXHR(this.xhr),
                    evictCache: up.protocol.evictCacheFromXHR(this.xhr),
                    fail: this.fail,
                };
                let methodFromResponse = up.protocol.methodFromXHR(this.xhr);
                let urlFromResponse = up.protocol.locationFromXHR(this.xhr);
                if (urlFromResponse) {
                    if (!u.matchURLs(this.url, urlFromResponse)) {
                        methodFromResponse ||= 'GET';
                    }
                    responseAttrs.url = urlFromResponse;
                }
                if (methodFromResponse) {
                    responseAttrs.method = methodFromResponse;
                }
                return new up.Response(responseAttrs);
            }
            _buildEventEmitter(args) {
                return up.EventEmitter.fromEmitArgs(args, {
                    layer: this.layer,
                    request: this,
                    origin: this.origin
                });
            }
            emit(...args) {
                return this._buildEventEmitter(args).emit();
            }
            assertEmitted(...args) {
                this._buildEventEmitter(args).assertEmitted();
            }
            get description() {
                return this.method + ' ' + this.url;
            }
            isPartOfSubtree(subtreeElements) {
                if (!this.fragments || !subtreeElements) {
                    return false;
                }
                subtreeElements = u.wrapList(subtreeElements);
                return u.some(this.fragments, function (fragment) {
                    return u.some(subtreeElements, (subtreeElement) => subtreeElement.contains(fragment));
                });
            }
            get age() {
                return new Date() - this.builtAt;
            }
            header(name) {
                return this.headers[name];
            }
            _addAutoHeaders() {
                for (let key of ['target', 'failTarget', 'mode', 'failMode', 'context', 'failContext']) {
                    this._addAutoHeader(up.protocol.headerize(key), this[key]);
                }
                let csrfHeader, csrfToken;
                if ((csrfHeader = this.csrfHeader()) && (csrfToken = this.csrfToken())) {
                    this._addAutoHeader(csrfHeader, csrfToken);
                }
                this._addAutoHeader(up.protocol.headerize('version'), up.version);
            }
            _addAutoHeader(name, value) {
                if (u.isMissing(value)) {
                    return;
                }
                if (u.isOptions(value) || u.isArray(value)) {
                    value = u.safeStringifyJSON(value);
                }
                this.headers[name] = value;
            }
            static tester(condition, { except } = {}) {
                let testFn;
                if (u.isFunction(condition)) {
                    testFn = condition;
                }
                else if (condition instanceof this) {
                    testFn = (request) => condition === request;
                }
                else if (u.isString(condition)) {
                    let pattern = new up.URLPattern(condition);
                    testFn = (request) => pattern.test(request.url);
                }
                else {
                    testFn = (_request) => condition;
                }
                if (except) {
                    return (request) => !up.cache.willHaveSameResponse(request, except) && testFn(request);
                }
                else {
                    return testFn;
                }
            }
        },
        (() => {
            u.delegate(_a.prototype, ['then', 'catch', 'finally'], function () { return this.deferred; });
        })(),
        _a);
    
    
    /***/ }),
    /* 70 */
    /***/ (() => {
    
    const u = up.util;
    up.Request.Cache = class Cache {
        constructor() {
            this.reset();
        }
        reset() {
            this._varyInfo = {};
            this._map = new Map();
        }
        _cacheKey(request) {
            let influencingHeaders = this._getPreviousInfluencingHeaders(request);
            let varyPart = u.flatMap(influencingHeaders, (headerName) => [headerName, request.header(headerName)]);
            return [request.description, ...varyPart].join(':');
        }
        _getPreviousInfluencingHeaders(request) {
            return (this._varyInfo[request.description] ||= new Set());
        }
        get(request) {
            request = this._wrap(request);
            let cacheKey = this._cacheKey(request);
            let cachedRequest = this._map.get(cacheKey);
            if (cachedRequest) {
                if (this._isUsable(cachedRequest)) {
                    return cachedRequest;
                }
                else {
                    this._map.delete(cacheKey);
                }
            }
        }
        get _capacity() {
            return up.network.config.cacheSize;
        }
        _isUsable(request) {
            return request.age < up.network.config.cacheEvictAge;
        }
        async put(request) {
            request = this._wrap(request);
            this._makeRoom();
            let cacheKey = this._updateCacheKey(request);
            this._map.set(cacheKey, request);
        }
        _updateCacheKey(request) {
            let oldCacheKey = this._cacheKey(request);
            let { response } = request;
            if (response) {
                this._mergePreviousHeaderNames(request, response);
                let newCacheKey = this._cacheKey(request);
                this._renameMapKey(oldCacheKey, newCacheKey);
                return newCacheKey;
            }
            else {
                return oldCacheKey;
            }
        }
        _renameMapKey(oldKey, newKey) {
            if (oldKey !== newKey && this._map.has(oldKey)) {
                this._map.set(newKey, this._map.get(oldKey));
                this._map.delete(oldKey);
            }
        }
        _mergePreviousHeaderNames(request, response) {
            let headersInfluencingResponse = response.ownInfluncingHeaders;
            if (headersInfluencingResponse.length) {
                let previousInfluencingHeaders = this._getPreviousInfluencingHeaders(request);
                for (let headerName of headersInfluencingResponse) {
                    previousInfluencingHeaders.add(headerName);
                }
            }
        }
        alias(existingCachedRequest, newRequest) {
            existingCachedRequest = this.get(existingCachedRequest);
            if (!existingCachedRequest)
                return;
            newRequest = this._wrap(newRequest);
            this.track(existingCachedRequest, newRequest, { force: true });
            this.put(newRequest);
            return newRequest;
        }
        async track(existingRequest, newRequest, options = {}) {
            newRequest.trackedRequest = existingRequest;
            newRequest.state = 'tracking';
            let value = await u.always(existingRequest);
            if (value instanceof up.Response) {
                if (options.force || this._isCacheCompatible(existingRequest, newRequest)) {
                    newRequest.fromCache = true;
                    value = u.variant(value, { request: newRequest });
                    newRequest.respondWith(value);
                    u.delegate(newRequest, ['expired', 'state'], () => existingRequest);
                }
                else {
                    delete newRequest.trackedRequest;
                    newRequest.state = 'new';
                    options.onIncompatible?.(newRequest);
                }
            }
            else {
                newRequest.state = existingRequest.state;
                newRequest.deferred.reject(value);
            }
        }
        willHaveSameResponse(existingRequest, newRequest) {
            return existingRequest === newRequest || existingRequest === newRequest.trackedRequest;
        }
        _delete(request) {
            request = this._wrap(request);
            let cacheKey = this._cacheKey(request);
            this._map.delete(cacheKey);
        }
        evict(condition = true, testerOptions) {
            this._eachMatch(condition, testerOptions, (request) => this._delete(request));
        }
        expire(condition = true, testerOptions) {
            this._eachMatch(condition, testerOptions, (request) => request.expired = true);
        }
        _makeRoom() {
            while (this._map.size >= this._capacity) {
                let oldestKey = this._map.keys().next().value;
                this._map.delete(oldestKey);
            }
        }
        _eachMatch(condition = true, testerOptions, fn) {
            let tester = up.Request.tester(condition, testerOptions);
            let results = u.filter(this._map.values(), tester);
            u.each(results, fn);
        }
        _isCacheCompatible(request1, request2) {
            return this._cacheKey(request1) === this._cacheKey(request2);
        }
        _wrap(requestOrOptions) {
            return u.wrapValue(up.Request, requestOrOptions);
        }
    };
    
    
    /***/ }),
    /* 71 */
    /***/ (() => {
    
    const u = up.util;
    up.Request.Queue = class Queue {
        constructor() {
            this.reset();
        }
        reset() {
            this._queuedRequests = [];
            this._currentRequests = [];
            this._emittedLate = false;
        }
        get allRequests() {
            return this._currentRequests.concat(this._queuedRequests);
        }
        asap(request) {
            request.runQueuedCallbacks();
            u.always(request, responseOrError => this._onRequestSettled(request, responseOrError));
            this._scheduleSlowTimer(request);
            this._queueRequest(request);
            u.microtask(() => this._poke());
        }
        promoteToForeground(request) {
            if (request.background) {
                request.background = false;
                this._scheduleSlowTimer(request);
            }
        }
        _scheduleSlowTimer(request) {
            let timeUntilLate = Math.max(request.badResponseTime - request.age, 0);
            u.timer(timeUntilLate, () => this._checkLate());
        }
        _getMaxConcurrency() {
            return u.evalOption(up.network.config.concurrency);
        }
        _hasConcurrencyLeft() {
            const maxConcurrency = this._getMaxConcurrency();
            return (maxConcurrency === -1) || (this._currentRequests.length < maxConcurrency);
        }
        isBusy() {
            return this._currentRequests.length > 0 || this._queuedRequests.length > 0;
        }
        _queueRequest(request) {
            this._queuedRequests.push(request);
        }
        _pluckNextRequest() {
            let request = u.find(this._queuedRequests, request => !request.background);
            request ||= this._queuedRequests[0];
            return u.remove(this._queuedRequests, request);
        }
        _sendRequestNow(request) {
            if (request.load()) {
                this._currentRequests.push(request);
            }
        }
        _onRequestSettled(request, responseOrError) {
            u.remove(this._currentRequests, request) || u.remove(this._queuedRequests, request);
            if ((responseOrError instanceof up.Response) && responseOrError.ok) {
                up.network.registerAliasForRedirect(request, responseOrError);
            }
            this._checkLate();
            u.microtask(() => this._poke());
        }
        _poke() {
            let request;
            if (this._hasConcurrencyLeft() && (request = this._pluckNextRequest())) {
                return this._sendRequestNow(request);
            }
        }
        abort(...args) {
            let options = u.extractOptions(args);
            let { except, reason, logOnce } = options;
            let conditions = args[0] ?? true;
            let tester = up.Request.tester(conditions, { except });
            for (let list of [this._currentRequests, this._queuedRequests]) {
                const abortableRequests = u.filter(list, tester);
                for (let abortableRequest of abortableRequests) {
                    if (logOnce) {
                        up.puts(...logOnce);
                        logOnce = null;
                    }
                    abortableRequest.abort({ reason });
                    u.remove(list, abortableRequest);
                }
            }
        }
        _checkLate() {
            const currentLate = this._isLate();
            if (this._emittedLate !== currentLate) {
                this._emittedLate = currentLate;
                if (currentLate) {
                    up.emit('up:network:late', { log: 'Server is slow to respond' });
                }
                else {
                    up.emit('up:network:recover', { log: 'Slow requests were loaded' });
                }
            }
        }
        _isLate() {
            const allForegroundRequests = u.reject(this.allRequests, 'background');
            const timerTolerance = 1;
            return u.some(allForegroundRequests, (request) => request.age >= (request.badResponseTime - timerTolerance));
        }
    };
    
    
    /***/ }),
    /* 72 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    const HTML_FORM_METHODS = ['GET', 'POST'];
    up.Request.FormRenderer = class FormRenderer {
        constructor(request) {
            this._request = request;
        }
        buildAndSubmit() {
            this.params = u.copy(this._request.params);
            let action = this._request.url;
            let { method } = this._request;
            const paramsFromQuery = up.Params.fromURL(action);
            this.params.addAll(paramsFromQuery);
            action = up.Params.stripURL(action);
            if (!u.contains(HTML_FORM_METHODS, method)) {
                method = up.protocol.wrapMethod(method, this.params);
            }
            this._form = e.affix(document.body, 'form.up-request-loader', { method, action });
            let contentType = this._request.contentType;
            if (contentType) {
                this._form.setAttribute('enctype', contentType);
            }
            let csrfParam, csrfToken;
            if ((csrfParam = this._request.csrfParam()) && (csrfToken = this._request.csrfToken())) {
                this.params.add(csrfParam, csrfToken);
            }
            u.each(this.params.toArray(), this._addField.bind(this));
            up.browser.submitForm(this._form);
        }
        _addField(attrs) {
            e.affix(this._form, 'input[type=hidden]', attrs);
        }
    };
    
    
    /***/ }),
    /* 73 */
    /***/ (() => {
    
    var _a;
    const CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded';
    const CONTENT_TYPE_FORM_DATA = 'multipart/form-data';
    const u = up.util;
    up.Request.XHRRenderer = (_a = class XHRRenderer {
            constructor(request) {
                this._request = request;
            }
            buildAndSend(handlers) {
                const xhr = this._request.xhr;
                this._params = u.copy(this._request.params);
                if (this._request.timeout) {
                    xhr.timeout = this._request.timeout;
                }
                xhr.open(this._getMethod(), this._request.url);
                let contentType = this._getContentType();
                if (contentType) {
                    xhr.setRequestHeader('Content-Type', contentType);
                }
                for (let headerName in this._request.headers) {
                    let headerValue = this._request.headers[headerName];
                    xhr.setRequestHeader(headerName, headerValue);
                }
                Object.assign(xhr, handlers);
                xhr.send(this._getPayload());
            }
            _getMethod() {
                let method = this._request.method;
                if (this._request.wrapMethod && !this._request.will302RedirectWithGET()) {
                    method = up.protocol.wrapMethod(method, this._params);
                }
                return method;
            }
            _getContentType() {
                this._finalizePayload();
                return this._contentType;
            }
            _getPayload() {
                this._finalizePayload();
                return this._payload;
            }
            _finalizePayload() {
                this._payload = this._request.payload;
                this._contentType = this._request.contentType;
                if (!this._payload && this._request.allowsPayload()) {
                    if (!this._contentType) {
                        this._contentType = this._params.hasBinaryValues() ? CONTENT_TYPE_FORM_DATA : CONTENT_TYPE_URL_ENCODED;
                    }
                    if (this._contentType === CONTENT_TYPE_FORM_DATA) {
                        this._contentType = null;
                        this._payload = this._params.toFormData();
                    }
                    else {
                        this._payload = this._params.toQuery().replace(/%20/g, '+');
                    }
                }
            }
        },
        (() => {
            u.memoizeMethod(_a.prototype, {
                _finalizePayload: true,
                _getMethod: true,
            });
        })(),
        _a);
    
    
    /***/ }),
    /* 74 */
    /***/ (() => {
    
    const u = up.util;
    up.Response = class Response extends up.Record {
        keys() {
            return [
                'method',
                'url',
                'text',
                'status',
                'request',
                'xhr',
                'target',
                'title',
                'acceptLayer',
                'dismissLayer',
                'eventPlans',
                'context',
                'expireCache',
                'evictCache',
                'headers',
                'loadedAt',
                'fail',
            ];
        }
        defaults() {
            return {
                headers: {},
                loadedAt: new Date()
            };
        }
        get ok() {
            return !u.evalOption(this.fail ?? up.network.config.fail, this);
        }
        get none() {
            return !this.text;
        }
        isCacheable() {
            return this.ok && !this.none;
        }
        header(name) {
            return this.headers[name] || this.xhr?.getResponseHeader(name);
        }
        get ownInfluncingHeaders() {
            let influencingHeaders = up.protocol.influencingHeadersFromResponse(this);
            return u.filter(influencingHeaders, (headerName) => this.request.header(headerName));
        }
        get contentType() {
            return this.header('Content-Type');
        }
        get cspNonces() {
            return up.protocol.cspNoncesFromHeader(this.header('Content-Security-Policy') || this.header('Content-Security-Policy-Report-Only'));
        }
        get lastModified() {
            let header = this.header('Last-Modified');
            if (header) {
                return new Date(header);
            }
        }
        get etag() {
            return this.header('ETag');
        }
        get json() {
            return this.parsedJSON ||= JSON.parse(this.text);
        }
        get age() {
            let now = new Date();
            return now - this.loadedAt;
        }
        get expired() {
            return this.age > up.network.config.cacheExpireAge ||
                this.request.expired;
        }
        get description() {
            return `HTTP ${this.status} response to ${this.request.description}`;
        }
    };
    
    
    /***/ }),
    /* 75 */
    /***/ (() => {
    
    var _a;
    const u = up.util;
    const e = up.element;
    up.ResponseDoc = (_a = class ResponseDoc {
            constructor({ document, fragment, content, target, origin, cspNonces, match }) {
                if (document) {
                    this._parseDocument(document);
                }
                else if (fragment) {
                    this._parseFragment(fragment);
                }
                else {
                    this._parseContent(content || '', target);
                }
                this._cspNonces = cspNonces;
                if (origin) {
                    let originSelector = up.fragment.tryToTarget(origin);
                    if (originSelector) {
                        this._rediscoveredOrigin = this.select(originSelector);
                    }
                }
                this._match = match;
            }
            _parseDocument(document) {
                document = this._parse(document, e.createBrokenDocumentFromHTML);
                this._isDocumentBroken = true;
                this._useParseResult(document);
            }
            _parseFragment(fragment) {
                fragment = this._parse(fragment, e.createFromHTML);
                this._useParseResult(fragment);
            }
            _parseContent(content, target) {
                if (!target)
                    up.fail("must pass a { target } when passing { content }");
                target = u.map(up.fragment.parseTargetSteps(target), 'selector').join();
                const matchingElement = e.createFromSelector(target);
                if (u.isString(content)) {
                    matchingElement.innerHTML = content;
                }
                else {
                    matchingElement.appendChild(content);
                }
                this._useParseResult(matchingElement);
            }
            _parse(value, parseFn) {
                if (u.isString(value)) {
                    value = parseFn(value);
                }
                return value;
            }
            _useParseResult(node) {
                if (node instanceof Document) {
                    this._document = node;
                }
                else {
                    this._document = document.createElement('up-document');
                    this._document.append(node);
                    this._document.documentElement = node;
                }
            }
            rootSelector() {
                return up.fragment.toTarget(this._document.documentElement);
            }
            get title() {
                return this._fromHead(this._getTitleText);
            }
            _getHead() {
                let { head } = this._document;
                if (head && head.childNodes.length > 0) {
                    return head;
                }
            }
            _fromHead(fn) {
                let head = this._getHead();
                return head && fn(head);
            }
            get metaTags() {
                return this._fromHead(up.history.findMetaTags);
            }
            get assets() {
                return this._fromHead(up.script.findAssets);
            }
            _getTitleText(head) {
                return head.querySelector('title')?.textContent;
            }
            select(selector) {
                let finder = new up.FragmentFinder({
                    selector: selector,
                    origin: this._rediscoveredOrigin,
                    document: this._document,
                    match: this._match,
                });
                return finder.find();
            }
            selectSteps(steps) {
                return steps.filter((step) => {
                    return this._trySelectStep(step) || this._cannotMatchStep(step);
                });
            }
            commitSteps(steps) {
                return steps.filter((step) => this.commitElement(step.newElement));
            }
            _trySelectStep(step) {
                if (step.newElement) {
                    return true;
                }
                let newElement = this.select(step.selector);
                if (!newElement) {
                    return;
                }
                let { selectEvent } = step;
                if (selectEvent) {
                    selectEvent.newFragment = newElement;
                    selectEvent.renderOptions = step.originalRenderOptions;
                    up.emit(step.oldElement, selectEvent, { callback: step.selectCallback });
                    if (selectEvent.defaultPrevented) {
                        return;
                    }
                }
                step.newElement = newElement;
                return true;
            }
            _cannotMatchStep(step) {
                if (!step.maybe) {
                    throw new up.CannotMatch();
                }
            }
            commitElement(element) {
                if (this._document.contains(element)) {
                    if (!up.fragment.config.runScripts) {
                        up.script.disableSubtree(element);
                    }
                    element.remove();
                    return true;
                }
            }
            finalizeElement(element) {
                up.NonceableCallback.adoptNonces(element, this._cspNonces);
                if (this._isDocumentBroken) {
                    let brokenElements = e.subtree(element, ':is(noscript,script,audio,video):not(.up-keeping, .up-keeping *)');
                    u.each(brokenElements, e.fixParserDamage);
                }
            }
        },
        (() => {
            u.memoizeMethod(_a.prototype, {
                _getHead: true,
            });
        })(),
        _a);
    
    
    /***/ }),
    /* 76 */
    /***/ (() => {
    
    const e = up.element;
    const u = up.util;
    up.RevealMotion = class RevealMotion {
        constructor(element, options = {}) {
            this._element = element;
            this._viewport = e.get(options.viewport) || up.viewport.get(this._element);
            this._obstructionsLayer = up.layer.get(this._viewport);
            this._behavior = options.behavior ?? 'instant';
            const viewportConfig = up.viewport.config;
            this._snap = options.snap ?? options.revealSnap ?? viewportConfig.revealSnap;
            this._padding = options.padding ?? options.revealPadding ?? viewportConfig.revealPadding;
            this._top = options.top ?? options.revealTop ?? viewportConfig.revealTop;
            this._max = options.max ?? options.revealMax ?? viewportConfig.revealMax;
            this._topObstructionSelector = viewportConfig.selector('fixedTopSelectors');
            this._bottomObstructionSelector = viewportConfig.selector('fixedBottomSelectors');
        }
        start() {
            const viewportRect = this._getViewportRect(this._viewport);
            const elementRect = up.Rect.fromElement(this._element);
            if (this._max) {
                const maxPixels = u.evalOption(this._max, this._element);
                elementRect.height = Math.min(elementRect.height, maxPixels);
            }
            this._addPadding(elementRect);
            this._substractObstructions(viewportRect);
            if (viewportRect.height < 0) {
                up.fail('Viewport has no visible area');
            }
            const originalScrollTop = this._viewport.scrollTop;
            let newScrollTop = originalScrollTop;
            if (this._top || (elementRect.height > viewportRect.height)) {
                const diff = elementRect.top - viewportRect.top;
                newScrollTop += diff;
            }
            else if (elementRect.top < viewportRect.top) {
                newScrollTop -= (viewportRect.top - elementRect.top);
            }
            else if (elementRect.bottom > viewportRect.bottom) {
                newScrollTop += (elementRect.bottom - viewportRect.bottom);
            }
            else {
            }
            if (u.isNumber(this._snap) && (newScrollTop < this._snap) && (elementRect.top < (0.5 * viewportRect.height))) {
                newScrollTop = 0;
            }
            if (newScrollTop !== originalScrollTop) {
                this._viewport.scrollTo({ top: newScrollTop, behavior: this._behavior });
            }
        }
        _getViewportRect() {
            if (up.viewport.isRoot(this._viewport)) {
                return new up.Rect({
                    left: 0,
                    top: 0,
                    width: up.viewport.rootWidth(),
                    height: up.viewport.rootHeight()
                });
            }
            else {
                return up.Rect.fromElement(this._viewport);
            }
        }
        _addPadding(elementRect) {
            elementRect.top -= this._padding;
            elementRect.height += 2 * this._padding;
        }
        _selectObstructions(selector) {
            let elements = up.fragment.all(selector, { layer: this._obstructionsLayer });
            return u.filter(elements, e.isVisible);
        }
        _substractObstructions(viewportRect) {
            for (let obstruction of this._selectObstructions(this._topObstructionSelector)) {
                let obstructionRect = up.Rect.fromElement(obstruction);
                let diff = obstructionRect.bottom - viewportRect.top;
                if (diff > 0) {
                    viewportRect.top += diff;
                    viewportRect.height -= diff;
                }
            }
            for (let obstruction of this._selectObstructions(this._bottomObstructionSelector)) {
                let obstructionRect = up.Rect.fromElement(obstruction);
                let diff = viewportRect.bottom - obstructionRect.top;
                if (diff > 0) {
                    viewportRect.height -= diff;
                }
            }
        }
    };
    
    
    /***/ }),
    /* 77 */
    /***/ (() => {
    
    const u = up.util;
    const CSS_HAS_SUFFIX_PATTERN = /:has\(([^)]+)\)$/;
    up.Selector = class Selector {
        constructor(selector, elementOrDocument, options = {}) {
            this._filters = [];
            if (!options.destroying) {
                this._filters.push(up.fragment.isNotDestroying);
            }
            let matchingInExternalDocument = elementOrDocument && !document.contains(elementOrDocument);
            let expandTargetLayer;
            if (matchingInExternalDocument || options.layer === 'any') {
                expandTargetLayer = up.layer.root;
            }
            else {
                options.layer ??= u.presence(elementOrDocument, u.isElement);
                this._layers = up.layer.getAll(options);
                if (!this._layers.length)
                    throw new up.CannotMatch(["Unknown layer: %o", options.layer]);
                this._filters.push(match => u.some(this._layers, layer => layer.contains(match)));
                expandTargetLayer = this._layers[0];
            }
            let expandedTargets = up.fragment.expandTargets(selector, { ...options, layer: expandTargetLayer });
            this._selectors = expandedTargets.map((target) => {
                if (!up.browser.canHasSelector()) {
                    target = target.replace(CSS_HAS_SUFFIX_PATTERN, (match, descendantSelector) => {
                        this._filters.push(element => element.querySelector(descendantSelector));
                        return '';
                    });
                }
                return target || '*';
            });
            this._unionSelector = this._selectors.join() || 'match-none';
        }
        matches(element) {
            return element.matches(this._unionSelector) && this._passesFilter(element);
        }
        closest(element) {
            let parentElement;
            if (this.matches(element)) {
                return element;
            }
            else if (parentElement = element.parentElement) {
                return this.closest(parentElement);
            }
        }
        _passesFilter(element) {
            return u.every(this._filters, filter => filter(element));
        }
        descendants(root = document) {
            const results = u.flatMap(this._selectors, selector => root.querySelectorAll(selector));
            return u.filter(results, element => this._passesFilter(element));
        }
        subtree(root) {
            const results = [];
            if (!(root instanceof Document) && this.matches(root)) {
                results.push(root);
            }
            results.push(...this.descendants(root));
            return results;
        }
    };
    
    
    /***/ }),
    /* 78 */
    /***/ (() => {
    
    const u = up.util;
    const e = up.element;
    up.Tether = class Tether {
        constructor(options) {
            up.migrate.handleTetherOptions?.(options);
            this._anchor = options.anchor;
            this._align = options.align;
            this._position = options.position;
            this._alignAxis = (this._position === 'top') || (this._position === 'bottom') ? 'horizontal' : 'vertical';
            this._viewport = up.viewport.get(this._anchor);
            this.parent = this._viewport === e.root ? document.body : this._viewport;
            this._syncOnScroll = !this._viewport.contains(this._anchor.offsetParent);
        }
        start(element) {
            this._element = element;
            this._element.style.position = 'absolute';
            this._setOffset(0, 0);
            this.sync();
            this._changeEventSubscription('on');
        }
        stop() {
            this._changeEventSubscription('off');
        }
        _changeEventSubscription(fn) {
            let doScheduleSync = this._scheduleSync.bind(this);
            up[fn](window, 'resize', doScheduleSync);
            if (this._syncOnScroll) {
                up[fn](this._viewport, 'scroll', doScheduleSync);
            }
        }
        _scheduleSync() {
            clearTimeout(this.syncTimer);
            return this.syncTimer = u.task(this.sync.bind(this));
        }
        isDetached() {
            return !this.parent.isConnected || !this._anchor.isConnected;
        }
        sync() {
            const elementBox = this._element.getBoundingClientRect();
            const elementMargin = {
                top: e.styleNumber(this._element, 'marginTop'),
                right: e.styleNumber(this._element, 'marginRight'),
                bottom: e.styleNumber(this._element, 'marginBottom'),
                left: e.styleNumber(this._element, 'marginLeft')
            };
            const anchorBox = this._anchor.getBoundingClientRect();
            let left;
            let top;
            switch (this._alignAxis) {
                case 'horizontal': {
                    switch (this._position) {
                        case 'top':
                            top = anchorBox.top - elementMargin.bottom - elementBox.height;
                            break;
                        case 'bottom':
                            top = anchorBox.top + anchorBox.height + elementMargin.top;
                            break;
                    }
                    switch (this._align) {
                        case 'left':
                            left = anchorBox.left + elementMargin.left;
                            break;
                        case 'center':
                            left = anchorBox.left + (0.5 * (anchorBox.width - elementBox.width));
                            break;
                        case 'right':
                            left = (anchorBox.left + anchorBox.width) - elementBox.width - elementMargin.right;
                            break;
                    }
                    break;
                }
                case 'vertical': {
                    switch (this._align) {
                        case 'top':
                            top = anchorBox.top + elementMargin.top;
                            break;
                        case 'center':
                            top = anchorBox.top + (0.5 * (anchorBox.height - elementBox.height));
                            break;
                        case 'bottom':
                            top = (anchorBox.top + anchorBox.height) - elementBox.height - elementMargin.bottom;
                            break;
                    }
                    switch (this._position) {
                        case 'left':
                            left = anchorBox.left - elementMargin.right - elementBox.width;
                            break;
                        case 'right':
                            left = anchorBox.left + anchorBox.width + elementMargin.left;
                            break;
                    }
                    break;
                }
            }
            if (u.isDefined(left) || u.isDefined(top)) {
                this._moveTo(left, top);
            }
            else {
                up.fail('Invalid tether constraints: %o', this._describeConstraints());
            }
        }
        _describeConstraints() {
            return { position: this._position, align: this._align };
        }
        _moveTo(targetLeft, targetTop) {
            const elementBox = this._element.getBoundingClientRect();
            this._setOffset((targetLeft - elementBox.left) + this.offsetLeft, (targetTop - elementBox.top) + this.offsetTop);
        }
        _setOffset(left, top) {
            this.offsetLeft = left;
            this.offsetTop = top;
            e.setStyle(this._element, { left, top });
        }
    };
    
    
    /***/ }),
    /* 79 */
    /***/ (() => {
    
    const u = up.util;
    up.URLPattern = class URLPattern {
        constructor(fullPattern, normalizeURL = u.normalizeURL) {
            this._normalizeURL = normalizeURL;
            this._groups = [];
            const positiveList = [];
            const negativeList = [];
            for (let pattern of u.parseTokens(fullPattern)) {
                if (pattern[0] === '-') {
                    negativeList.push(pattern.substring(1));
                }
                else {
                    positiveList.push(pattern);
                }
            }
            this._positiveRegexp = this._buildRegexp(positiveList, true);
            this._negativeRegexp = this._buildRegexp(negativeList, false);
        }
        _buildRegexp(list, capture) {
            if (!list.length) {
                return;
            }
            list = list.map((url) => {
                if (url[0] === '*') {
                    url = '/' + url;
                }
                url = this._normalizeURL(url);
                url = u.escapeRegExp(url);
                return url;
            });
            let reCode = list.join('|');
            reCode = reCode.replace(/\\\*/g, '.*?');
            reCode = reCode.replace(/(:|\\\$)([a-z][\w-]*)/ig, (match, type, name) => {
                if (type === '\\$') {
                    if (capture) {
                        this._groups.push({ name, cast: Number });
                    }
                    return '(\\d+)';
                }
                else {
                    if (capture) {
                        this._groups.push({ name, cast: String });
                    }
                    return '([^/?#]+)';
                }
            });
            return new RegExp('^(?:' + reCode + ')$');
        }
        test(url, doNormalize = true) {
            if (doNormalize) {
                url = this._normalizeURL(url);
            }
            return this._positiveRegexp.test(url) && !this._isExcluded(url);
        }
        recognize(url, doNormalize = true) {
            if (doNormalize) {
                url = this._normalizeURL(url);
            }
            let match = this._positiveRegexp.exec(url);
            if (match && !this._isExcluded(url)) {
                const resolution = {};
                this._groups.forEach((group, groupIndex) => {
                    let value = match[groupIndex + 1];
                    if (value) {
                        return resolution[group.name] = group.cast(value);
                    }
                });
                return resolution;
            }
        }
        _isExcluded(url) {
            return this._negativeRegexp?.test(url);
        }
    };
    
    
    /***/ }),
    /* 80 */
    /***/ (() => {
    
    up.framework = (function () {
        let readyState = 'evaling';
        function emitReset() {
            up.emit('up:framework:reset', { log: false });
        }
        function boot() {
            if (readyState !== 'configuring') {
                console.error('Unpoly has already booted');
                return;
            }
            let issue = supportIssue();
            if (!issue) {
                readyState = 'booting';
                up.emit('up:framework:boot', { log: false });
                readyState = 'booted';
                up.emit('up:framework:booted', { log: false });
            }
            else {
                console.error("Unpoly cannot boot: %s", issue);
            }
        }
        function mustBootManually() {
            let unpolyScript = document.currentScript;
            if (unpolyScript?.async) {
                return true;
            }
            if (unpolyScript?.getAttribute('up-boot') === 'manual') {
                return true;
            }
            if (document.readyState === 'complete') {
                return true;
            }
        }
        function onEvaled() {
            up.emit('up:framework:evaled', { log: false });
            if (mustBootManually()) {
                console.debug('Call up.boot() after you have configured Unpoly');
            }
            else {
                document.addEventListener('DOMContentLoaded', boot);
            }
            readyState = 'configuring';
        }
        function startExtension() {
            if (readyState !== 'configuring') {
                throw new Error('Unpoly extensions must be loaded before booting');
            }
            readyState = 'evaling';
        }
        function stopExtension() {
            readyState = 'configuring';
        }
        function isSupported() {
            return !supportIssue();
        }
        function supportIssue() {
            for (let feature of ['URL', 'Proxy', 'Promise', 'DOMParser', 'FormData']) {
                if (!window[feature]) {
                    return `Browser doesn't support the ${feature} API`;
                }
            }
            if (document.compatMode === 'BackCompat') {
                return 'Browser is in quirks mode (missing DOCTYPE?)';
            }
        }
        return {
            onEvaled,
            boot,
            startExtension,
            stopExtension,
            reset: emitReset,
            get evaling() { return readyState === 'evaling'; },
            get booted() { return readyState === 'booted'; },
            get beforeBoot() { return readyState !== 'booting' && readyState !== 'booted'; },
            isSupported,
        };
    })();
    up.boot = up.framework.boot;
    
    
    /***/ }),
    /* 81 */
    /***/ (() => {
    
    up.event = (function () {
        const u = up.util;
        const e = up.element;
        function reset() {
            for (let globalElement of [window, document, e.root, document.body]) {
                for (let listener of up.EventListener.allNonDefault(globalElement)) {
                    listener.unbind();
                }
            }
        }
        function on(...args) {
            return buildListenerGroup(args).bind();
        }
        function off(...args) {
            return buildListenerGroup(args).unbind();
        }
        function buildListenerGroup(args, options) {
            return up.EventListenerGroup.fromBindArgs(args, options);
        }
        function buildEmitter(args) {
            return up.EventEmitter.fromEmitArgs(args);
        }
        function emit(...args) {
            return buildEmitter(args).emit();
        }
        function build(...args) {
            const props = u.extractOptions(args);
            const type = args[0] || props.type || up.fail('Expected event type to be passed as string argument or { type } property');
            const event = document.createEvent('Event');
            event.initEvent(type, true, true);
            Object.assign(event, u.omit(props, ['type', 'target']));
            return event;
        }
        function assertEmitted(...args) {
            return buildEmitter(args).assertEmitted();
        }
        function onEscape(listener) {
            return on('keydown', function (event) {
                if (event.key === 'Escape') {
                    return listener(event);
                }
            });
        }
        function halt(event, options = {}) {
            if (options.log)
                up.log.putsEvent(event);
            event.stopImmediatePropagation();
            event.preventDefault();
        }
        const keyModifiers = ['metaKey', 'shiftKey', 'ctrlKey', 'altKey'];
        function isUnmodified(event) {
            return (u.isUndefined(event.button) || (event.button === 0)) &&
                !u.some(keyModifiers, modifier => event[modifier]);
        }
        function fork(originalEvent, newType, copyKeys = []) {
            const newEvent = up.event.build(newType, u.pick(originalEvent, copyKeys));
            newEvent.originalEvent = originalEvent;
            ['stopPropagation', 'stopImmediatePropagation', 'preventDefault'].forEach(function (key) {
                const originalMethod = newEvent[key];
                return newEvent[key] = function () {
                    originalEvent[key]();
                    return originalMethod.call(newEvent);
                };
            });
            if (originalEvent.defaultPrevented) {
                newEvent.preventDefault();
            }
            return newEvent;
        }
        function executeEmitAttr(event, element) {
            if (!isUnmodified(event)) {
                return;
            }
            const eventType = e.attr(element, 'up-emit');
            const eventProps = e.jsonAttr(element, 'up-emit-props');
            const forkedEvent = fork(event, eventType);
            Object.assign(forkedEvent, eventProps);
            up.emit(element, forkedEvent);
        }
        on('up:click', 'a[up-emit]', executeEmitAttr);
        let inputDevices = ['unknown'];
        function getInputDevice() {
            return u.last(inputDevices);
        }
        function observeInputDevice(newModality) {
            inputDevices.push(newModality);
            setTimeout(() => inputDevices.pop());
        }
        on('keydown keyup', { capture: true }, () => observeInputDevice('key'));
        on('pointerdown pointerup', { capture: true }, () => observeInputDevice('pointer'));
        on('up:framework:reset', reset);
        return {
            on,
            off,
            build,
            emit,
            assertEmitted,
            onEscape,
            halt,
            isUnmodified,
            fork,
            keyModifiers,
            get inputDevice() { return getInputDevice(); }
        };
    })();
    up.on = up.event.on;
    up.off = up.event.off;
    up.emit = up.event.emit;
    
    
    /***/ }),
    /* 82 */
    /***/ (() => {
    
    up.protocol = (function () {
        const u = up.util;
        const e = up.element;
        const headerize = function (camel) {
            const header = camel.replace(/(^.|[A-Z])/g, char => '-' + char.toUpperCase());
            return 'X-Up' + header;
        };
        const extractHeader = function (xhr, shortHeader, parseFn = u.identity) {
            let value = xhr.getResponseHeader(headerize(shortHeader));
            if (value) {
                return parseFn(value);
            }
        };
        function targetFromXHR(xhr) {
            return extractHeader(xhr, 'target');
        }
        function parseModifyCacheValue(value) {
            if (value === 'false') {
                return false;
            }
            else {
                return value;
            }
        }
        function evictCacheFromXHR(xhr) {
            return extractHeader(xhr, 'evictCache', parseModifyCacheValue);
        }
        function expireCacheFromXHR(xhr) {
            return extractHeader(xhr, 'expireCache') || up.migrate.clearCacheFromXHR?.(xhr);
        }
        function contextFromXHR(xhr) {
            return extractHeader(xhr, 'context', JSON.parse);
        }
        function methodFromXHR(xhr) {
            return extractHeader(xhr, 'method', u.normalizeMethod);
        }
        function titleFromXHR(xhr) {
            return up.migrate.titleFromXHR?.(xhr) ?? extractHeader(xhr, 'title', JSON.parse);
        }
        function eventPlansFromXHR(xhr) {
            return extractHeader(xhr, 'events', JSON.parse);
        }
        function acceptLayerFromXHR(xhr) {
            return extractHeader(xhr, 'acceptLayer', JSON.parse);
        }
        function dismissLayerFromXHR(xhr) {
            return extractHeader(xhr, 'dismissLayer', JSON.parse);
        }
        const initialRequestMethod = u.memoize(function () {
            return u.normalizeMethod(up.browser.popCookie('_up_method'));
        });
        function locationFromXHR(xhr) {
            return extractHeader(xhr, 'location') || xhr.responseURL;
        }
        function influencingHeadersFromResponse(response) {
            let varyHeaderValue = response.header('Vary');
            return u.parseTokens(varyHeaderValue, { separator: 'comma' });
        }
        const config = new up.Config(() => ({
            methodParam: '_method',
            csrfParam() { return e.metaContent('csrf-param'); },
            csrfToken() { return e.metaContent('csrf-token'); },
            cspNonce() { return e.metaContent('csp-nonce'); },
            csrfHeader: 'X-CSRF-Token',
            maxHeaderSize: 2048,
        }));
        function csrfHeader() {
            return u.evalOption(config.csrfHeader);
        }
        function csrfParam() {
            return u.evalOption(config.csrfParam);
        }
        function csrfToken() {
            return u.evalOption(config.csrfToken);
        }
        function cspNonce() {
            return u.evalOption(config.cspNonce);
        }
        function cspNoncesFromHeader(cspHeader) {
            let nonces = [];
            if (cspHeader) {
                let parts = cspHeader.split(/\s*;\s*/);
                for (let part of parts) {
                    if (part.indexOf('script-src') === 0) {
                        let noncePattern = /'nonce-([^']+)'/g;
                        let match;
                        while (match = noncePattern.exec(part)) {
                            nonces.push(match[1]);
                        }
                    }
                }
            }
            return nonces;
        }
        function wrapMethod(method, params) {
            params.add(config.methodParam, method);
            return 'POST';
        }
        return {
            config,
            locationFromXHR,
            titleFromXHR,
            targetFromXHR,
            methodFromXHR,
            acceptLayerFromXHR,
            contextFromXHR,
            dismissLayerFromXHR,
            eventPlansFromXHR,
            expireCacheFromXHR,
            evictCacheFromXHR,
            csrfHeader,
            csrfParam,
            csrfToken,
            cspNonce,
            initialRequestMethod,
            headerize,
            wrapMethod,
            cspNoncesFromHeader,
            influencingHeadersFromResponse,
        };
    })();
    
    
    /***/ }),
    /* 83 */
    /***/ (() => {
    
    up.log = (function () {
        const u = up.util;
        const config = new up.LogConfig();
        function printToStandard(...args) {
            if (config.enabled) {
                printToStream('log', ...args);
            }
        }
        const printToWarn = (...args) => printToStream('warn', ...args);
        const printToError = (...args) => printToStream('error', ...args);
        function printToStream(stream, trace, message, ...args) {
            printToStreamStyled(stream, trace, '', message, ...args);
        }
        function printToStreamStyled(stream, trace, customStyles, message, ...args) {
            if (message) {
                if (config.format) {
                    console[stream](`%c${trace}%c ${message}`, 'color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;' + customStyles, '', ...args);
                }
                else {
                    console[stream](`[${trace}] ${u.sprintf(message, ...args)}`);
                }
            }
        }
        function printUserEvent(event) {
            if (config.enabled) {
                event = event.originalEvent || event;
                let color = '#5566cc';
                printToStreamStyled('log', event.type, `color: white; border-color: ${color}; background-color: ${color}`, 'Interaction on %o', event.target);
            }
        }
        function printBanner() {
            if (!config.banner) {
                return;
            }
            const logo = " __ _____  ___  ___  / /_ __\n" +
                `/ // / _ \\/ _ \\/ _ \\/ / // /  ${up.version}\n` +
                "\\___/_//_/ .__/\\___/_/\\_. / \n" +
                "        / /            / /\n\n";
            let text = "";
            if (!up.migrate.loaded) {
                text += "Load unpoly-migrate.js to polyfill deprecated APIs.\n\n";
            }
            if (config.enabled) {
                text += "Call `up.log.disable()` to disable logging for this session.";
            }
            else {
                text += "Call `up.log.enable()` to enable logging for this session.";
            }
            const color = 'color: #777777';
            if (config.format) {
                console.log('%c' + logo + '%c' + text, 'font-family: monospace;' + color, color);
            }
            else {
                console.log(logo + text);
            }
        }
        up.on('up:framework:boot', printBanner);
        function enable() {
            config.enabled = true;
        }
        function disable() {
            config.enabled = false;
        }
        return {
            puts: printToStandard,
            putsEvent: printUserEvent,
            error: printToError,
            warn: printToWarn,
            config,
            enable,
            disable,
        };
    })();
    up.puts = up.log.puts;
    up.warn = up.log.warn;
    
    
    /***/ }),
    /* 84 */
    /***/ (() => {
    
    up.script = (function () {
        const u = up.util;
        const e = up.element;
        const config = new up.Config(() => ({
            assetSelectors: [
                'link[rel=stylesheet]',
                'script[src]',
                '[up-asset]'
            ],
            noAssetSelectors: [
                '[up-asset=false]',
            ],
            nonceableAttributes: [
                'up-watch',
                'up-on-accepted',
                'up-on-dismissed',
                'up-on-loaded',
                'up-on-rendered',
                'up-on-finished',
                'up-on-error',
                'up-on-offline',
            ],
            scriptSelectors: [
                'script'
            ],
            noScriptSelectors: [
                'script[type="application/ld+json"]'
            ]
        }));
        const SYSTEM_MACRO_PRIORITIES = {
            '[up-back]': -100,
            '[up-content]': -200,
            '[up-drawer]': -200,
            '[up-modal]': -200,
            '[up-cover]': -200,
            '[up-popup]': -200,
            '[up-tooltip]': -200,
            '[up-dash]': -200,
            '[up-flashes]': -200,
            '[up-expand]': -300,
            '[data-method]': -400,
            '[data-confirm]': -400,
        };
        let registeredCompilers = [];
        let registeredMacros = [];
        function registerCompiler(...args) {
            const compiler = buildCompiler(args);
            return insertCompiler(registeredCompilers, compiler);
        }
        function registerMacro(...args) {
            const macro = buildCompiler(args);
            if (up.framework.evaling) {
                macro.priority ||= detectSystemMacroPriority(macro.selector) ||
                    up.fail('Unregistered priority for system macro %o', macro.selector);
            }
            return insertCompiler(registeredMacros, macro);
        }
        function detectSystemMacroPriority(macroSelector) {
            macroSelector = u.evalOption(macroSelector);
            for (let substr in SYSTEM_MACRO_PRIORITIES) {
                const priority = SYSTEM_MACRO_PRIORITIES[substr];
                if (macroSelector.indexOf(substr) >= 0) {
                    return priority;
                }
            }
        }
        const parseCompilerArgs = function (args) {
            const defaults = u.extractOptions(args);
            const selector = args.shift();
            const callback = args.pop();
            const options = { ...defaults, ...u.extractOptions(args) };
            return [selector, options, callback];
        };
        function buildCompiler(args) {
            let [selector, options, callback] = parseCompilerArgs(args);
            options = u.options(options, {
                selector,
                isDefault: up.framework.evaling,
                priority: 0,
                batch: false,
            });
            return Object.assign(callback, options);
        }
        function insertCompiler(queue, newCompiler) {
            let existingCompiler;
            let index = 0;
            while ((existingCompiler = queue[index]) && (existingCompiler.priority >= newCompiler.priority)) {
                index += 1;
            }
            queue.splice(index, 0, newCompiler);
            if (up.framework.booted) {
                if (newCompiler.priority === 0) {
                    for (let layer of up.layer.stack) {
                        compile(layer.element, { layer, compilers: [newCompiler] });
                    }
                }
                else {
                    up.puts('up.compiler()', 'Compiler %s was registered after booting Unpoly. Compiler will run for future fragments only.', newCompiler.selector);
                }
            }
            return newCompiler;
        }
        function compile(fragment, options) {
            up.emit(fragment, 'up:fragment:compile', { log: false });
            let compilers = options.compilers || registeredMacros.concat(registeredCompilers);
            const pass = new up.CompilerPass(fragment, compilers, options);
            pass.run();
        }
        function registerDestructor(element, destructor) {
            let destructors = element.upDestructors;
            if (!destructors) {
                destructors = [];
                element.upDestructors = destructors;
                element.classList.add('up-can-clean');
            }
            if (u.isArray(destructor)) {
                destructors.push(...destructor);
            }
            else {
                destructors.push(destructor);
            }
        }
        function hello(element, options = {}) {
            element = up.fragment.get(element, options);
            up.puts('up.hello()', "Compiling fragment %o", element);
            compile(element, options);
            up.fragment.emitInserted(element);
            return element;
        }
        function clean(fragment, options = {}) {
            new up.DestructorPass(fragment, options).run();
        }
        function readData(element) {
            element = up.fragment.get(element);
            return element.upData ||= buildData(element);
        }
        function buildData(element) {
            if (!element.getAttribute) {
                return {};
            }
            let rawJSON = element.getAttribute('up-data');
            let parsedJSON;
            if (rawJSON) {
                parsedJSON = JSON.parse(rawJSON);
                if (!u.isOptions(parsedJSON)) {
                    return parsedJSON;
                }
            }
            return {
                ...element.dataset,
                ...parsedJSON,
                ...element.upCompileData,
            };
        }
        function findAssets(head = document.head) {
            return head.querySelectorAll(config.selector('assetSelectors'));
        }
        function assertAssetsOK(newAssets, renderOptions) {
            let oldAssets = findAssets();
            let oldHTML = u.map(oldAssets, 'outerHTML').join();
            let newHTML = u.map(newAssets, 'outerHTML').join();
            if (oldHTML !== newHTML) {
                up.event.assertEmitted('up:assets:changed', { oldAssets, newAssets, renderOptions });
            }
        }
        function disableScript(scriptElement) {
            scriptElement.type = 'up-disabled-script';
        }
        function disableScriptsInSubtree(root) {
            let selector = config.selector('scriptSelectors');
            u.each(e.subtree(root, selector), disableScript);
        }
        function reset() {
            registeredCompilers = u.filter(registeredCompilers, 'isDefault');
            registeredMacros = u.filter(registeredMacros, 'isDefault');
        }
        up.on('up:framework:reset', reset);
        return {
            config,
            compiler: registerCompiler,
            macro: registerMacro,
            destructor: registerDestructor,
            hello,
            clean,
            data: readData,
            findAssets,
            assertAssetsOK,
            disableSubtree: disableScriptsInSubtree,
        };
    })();
    up.compiler = up.script.compiler;
    up.destructor = up.script.destructor;
    up.macro = up.script.macro;
    up.data = up.script.data;
    up.hello = up.script.hello;
    
    
    /***/ }),
    /* 85 */
    /***/ (() => {
    
    up.history = (function () {
        const u = up.util;
        const e = up.element;
        const config = new up.Config(() => ({
            enabled: true,
            updateMetaTags: true,
            restoreTargets: ['body'],
            metaTagSelectors: [
                'meta',
                'link[rel=alternate]',
                'link[rel=canonical]',
                'link[rel=icon]',
                '[up-meta]',
                'script[type="application/ld+json"]',
            ],
            noMetaTagSelectors: [
                'meta[http-equiv]',
                '[up-meta=false]',
                'meta[name=csp-nonce]',
            ],
        }));
        let previousLocation;
        let nextPreviousLocation;
        function reset() {
            previousLocation = undefined;
            nextPreviousLocation = undefined;
            trackCurrentLocation();
        }
        const DEFAULT_NORMALIZE_OPTIONS = { hash: true };
        function normalizeURL(url, options) {
            options = u.merge(DEFAULT_NORMALIZE_OPTIONS, options);
            return u.normalizeURL(url, options);
        }
        function currentLocation(normalizeOptions) {
            return normalizeURL(location.href, normalizeOptions);
        }
        function trackCurrentLocation() {
            const url = currentLocation();
            if (nextPreviousLocation !== url) {
                previousLocation = nextPreviousLocation;
                nextPreviousLocation = url;
            }
        }
        trackCurrentLocation();
        const ADDITIONAL_NORMALIZE_OPTIONS_FOR_COMPARISON = { trailingSlash: false };
        function isLocation(url, options) {
            options = u.merge(ADDITIONAL_NORMALIZE_OPTIONS_FOR_COMPARISON, options);
            return normalizeURL(url, options) === currentLocation(options);
        }
        function replace(location, options = {}) {
            location = normalizeURL(location);
            if (manipulate('replaceState', location) && (options.event !== false)) {
                emitLocationChanged({ location, reason: 'replace', log: `Replaced state for ${location}` });
            }
        }
        function push(location) {
            location = normalizeURL(location);
            if (!isLocation(location) && manipulate('pushState', location)) {
                emitLocationChanged({ location, reason: 'push', log: `Advanced to location ${location}` });
            }
        }
        function emitLocationChanged(props) {
            let event = up.event.build('up:location:changed', props);
            up.migrate?.renamedProperty?.(event, 'url', 'location');
            up.emit(event);
        }
        function manipulate(method, url) {
            if (config.enabled) {
                const state = buildState();
                window.history[method](state, '', url);
                trackCurrentLocation();
                return true;
            }
        }
        function buildState() {
            return { up: {} };
        }
        function restoreStateOnPop(state) {
            if (!state?.up) {
                up.puts('popstate', 'Ignoring a history state not owned by Unpoly');
                return;
            }
            let location = currentLocation();
            if (up.emit('up:location:restore', { location, log: `Restoring location ${location}` }).defaultPrevented) {
                return;
            }
            up.render({
                url: location,
                target: config.restoreTargets,
                fail: false,
                history: true,
                location,
                peel: true,
                layer: 'root',
                cache: true,
                saveScroll: false,
                scroll: ['restore', 'auto'],
                saveFocus: false,
                focus: ['restore', 'auto'],
            });
        }
        function onPop(event) {
            trackCurrentLocation();
            let location = currentLocation();
            emitLocationChanged({ location, reason: 'pop', log: `Navigated to history entry ${location}` });
            up.viewport.saveFocus({ location: previousLocation });
            up.viewport.saveScroll({ location: previousLocation });
            restoreStateOnPop(event.state);
        }
        function register() {
            window.addEventListener('popstate', onPop);
            if (up.protocol.initialRequestMethod() === 'GET') {
                replace(currentLocation(), { event: false });
            }
        }
        up.on('up:framework:boot', function () {
            if ('jasmine' in window) {
                register();
            }
            else {
                setTimeout(register, 100);
            }
        });
        function findMetaTags(head = document.head) {
            return head.querySelectorAll(config.selector('metaTagSelectors'));
        }
        function updateMetaTags(newMetaTags) {
            let oldMetaTags = findMetaTags();
            for (let oldMetaTag of oldMetaTags) {
                oldMetaTag.remove();
            }
            for (let newMetaTag of newMetaTags) {
                document.head.append(newMetaTag);
            }
        }
        up.macro('a[up-back], [up-href][up-back]', function (link) {
            if (previousLocation) {
                e.setMissingAttrs(link, {
                    'up-href': previousLocation,
                    'up-scroll': 'restore'
                });
                link.removeAttribute('up-back');
                up.link.makeFollowable(link);
            }
        });
        up.on('up:framework:reset', reset);
        return {
            config,
            push,
            replace,
            get location() { return currentLocation(); },
            get previousLocation() { return previousLocation; },
            normalizeURL,
            isLocation,
            findMetaTags,
            updateMetaTags,
        };
    })();
    
    
    /***/ }),
    /* 86 */
    /***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
    
    __webpack_require__(87);
    const u = up.util;
    const e = up.element;
    up.fragment = (function () {
        function upTagName(element) {
            let tagName = e.tagName(element);
            if (tagName.startsWith('up-')) {
                return tagName;
            }
        }
        const config = new up.Config(() => ({
            badTargetClasses: [/^up-/],
            targetDerivers: [
                '[up-id]',
                '[id]',
                'html',
                'head',
                'body',
                'main',
                '[up-main]',
                upTagName,
                'link[rel][type]',
                'link[rel=preload][href]',
                'link[rel=preconnect][href]',
                'link[rel=prefetch][href]',
                'link[rel]',
                'meta[property]',
                '*[name]',
                'form[action]',
                'a[href]',
                '[class]',
                '[up-flashes]',
                'form',
            ],
            verifyDerivedTarget: true,
            navigateOptions: {
                cache: 'auto',
                revalidate: 'auto',
                feedback: true,
                fallback: true,
                focus: 'auto',
                scroll: 'auto',
                history: 'auto',
                peel: true,
            },
            match: 'region',
            runScripts: true,
            autoHistoryTargets: [':main'],
            autoFocus: ['hash', 'autofocus', 'main-if-main', 'keep', 'target-if-lost'],
            autoScroll: ['hash', 'layer-if-main'],
            autoRevalidate: (response) => response.expired,
            skipResponse: defaultSkipResponse
        }));
        u.delegate(config, ['mainTargets'], () => up.layer.config.any);
        function defaultSkipResponse({ response, expiredResponse }) {
            return !response.text || response.text === expiredResponse?.text;
        }
        function sourceOf(element, options = {}) {
            element = getSmart(element, options);
            return e.closestAttr(element, 'up-source');
        }
        function timeOf(element) {
            let value = e.closestAttr(element, 'up-time');
            if (value && value !== 'false') {
                if (/^\d+$/.test(value)) {
                    value = Number(value) * 1000;
                }
                return new Date(value);
            }
        }
        function etagOf(element) {
            let value = e.closestAttr(element, 'up-etag');
            if (value && value !== 'false') {
                return value;
            }
        }
        const render = up.mockable((...args) => {
            let options = parseTargetAndOptions(args);
            return new up.RenderJob(options).execute();
        });
        const navigate = up.mockable((...args) => {
            const options = parseTargetAndOptions(args);
            return render({ ...options, navigate: true });
        });
        function emitFragmentInserted(element) {
            return up.emit(element, 'up:fragment:inserted', {
                log: ['Inserted fragment %o', element],
            });
        }
        function emitFragmentKeep(keepPlan) {
            let { oldElement, newElement: newFragment, newData, renderOptions } = keepPlan;
            const log = ['Keeping fragment %o', oldElement];
            const callback = e.callbackAttr(oldElement, 'up-on-keep', { exposedKeys: ['newFragment', 'newData'] });
            return up.emit(oldElement, 'up:fragment:keep', { newFragment, newData, renderOptions, log, callback });
        }
        function emitFragmentDestroyed(fragment, options) {
            const log = options.log ?? ['Destroyed fragment %o', fragment];
            const parent = options.parent || document;
            return up.emit(parent, 'up:fragment:destroyed', { fragment, parent, log });
        }
        function isNotDestroying(element) {
            return !element.closest('.up-destroying');
        }
        function isAlive(fragment) {
            return fragment.isConnected && isNotDestroying(fragment);
        }
        function getSmart(...args) {
            const options = u.extractOptions(args);
            const selector = args.pop();
            const root = args[0];
            if (u.isElementish(selector)) {
                return e.get(selector);
            }
            if (root) {
                return getDumb(root, selector, options);
            }
            return new up.FragmentFinder({
                selector,
                origin: options.origin,
                layer: options.layer,
                match: options.match,
            }).find();
        }
        function getDumb(...args) {
            return getAll(...args)[0];
        }
        function getAll(...args) {
            const options = u.extractOptions(args);
            let selectorString = args.pop();
            const root = args[0];
            if (u.isElement(selectorString)) {
                return [selectorString];
            }
            if (u.isList(selectorString)) {
                return selectorString;
            }
            let selector = new up.Selector(selectorString, root, options);
            return selector.descendants(root);
        }
        function getSubtree(element, selector, options = {}) {
            return new up.Selector(selector, element, options).subtree(element);
        }
        function contains(root, selectorOrElement) {
            if (u.isElement(selectorOrElement)) {
                return e.contains(root, selectorOrElement) && up.layer.get(root).contains(selectorOrElement);
            }
            else {
                return getSubtree(root, selectorOrElement).length > 0;
            }
        }
        function closest(element, selector, options) {
            return new up.Selector(selector, element, options).closest(element);
        }
        function destroy(...args) {
            const options = parseTargetAndOptions(args);
            if (options.element = getSmart(options.target, options)) {
                new up.Change.DestroyFragment(options).execute();
            }
            return up.migrate.formerlyAsync?.('up.destroy()');
        }
        function parseTargetAndOptions(args) {
            const options = u.parseArgIntoOptions(args, 'target');
            if (u.isElement(options.target)) {
                options.origin ||= options.target;
            }
            return options;
        }
        function markFragmentAsDestroying(element) {
            element.classList.add('up-destroying');
            element.setAttribute('aria-hidden', 'true');
        }
        function reload(...args) {
            const options = parseTargetAndOptions(args);
            options.target ||= ':main';
            const element = getSmart(options.target, options);
            options.url ||= sourceOf(element);
            options.headers = u.merge(options.headers, conditionalHeaders(element));
            if (options.keepData || e.booleanAttr(element, 'up-keep-data')) {
                options.data = up.data(element);
            }
            up.migrate.postprocessReloadOptions?.(options);
            return render(options);
        }
        function conditionalHeaders(element) {
            let headers = {};
            let time = timeOf(element);
            if (time) {
                headers['If-Modified-Since'] = time.toUTCString();
            }
            let etag = etagOf(element);
            if (etag) {
                headers['If-None-Match'] = etag;
            }
            return headers;
        }
        function visit(url, options) {
            return navigate({ ...options, url });
        }
        const KEY_PATTERN = /^(onFail|on|fail)?(.+)$/;
        function successKey(key) {
            let match = KEY_PATTERN.exec(key);
            if (match) {
                let [_, prefix, suffix] = match;
                switch (prefix) {
                    case 'onFail':
                        return 'on' + u.upperCaseFirst(suffix);
                    case 'fail':
                        return u.lowerCaseFirst(suffix);
                }
            }
        }
        function failKey(key) {
            let match = KEY_PATTERN.exec(key);
            if (match) {
                let [_, prefix, suffix] = match;
                switch (prefix) {
                    case 'on':
                        return 'onFail' + u.upperCaseFirst(suffix);
                    case undefined:
                        return 'fail' + u.upperCaseFirst(suffix);
                }
            }
        }
        function toTarget(element, options) {
            return u.presence(element, u.isString) || tryToTarget(element, options) || cannotTarget(element);
        }
        function isTargetable(element) {
            return !!tryToTarget(element);
        }
        function untargetableMessage(element) {
            return `Cannot derive good target selector from a <${e.tagName(element)}> element without identifying attributes. Try setting an [id] or configure up.fragment.config.targetDerivers.`;
        }
        function cannotTarget(element) {
            throw new up.CannotTarget(untargetableMessage(element));
        }
        function tryToTarget(element, options) {
            return u.findResult(config.targetDerivers, function (deriver) {
                let target = deriveTarget(element, deriver);
                if (target && isGoodTarget(target, element, options)) {
                    return target;
                }
            });
        }
        function deriveTarget(element, deriver) {
            if (u.isFunction(deriver)) {
                return deriver(element);
            }
            else if (element.matches(deriver)) {
                try {
                    return deriveTargetFromPattern(element, deriver);
                }
                catch (e) {
                    if (e instanceof up.CannotParse) {
                        return deriver;
                    }
                    else {
                        throw e;
                    }
                }
            }
        }
        function deriveTargetFromPattern(element, deriver) {
            let { includePath, excludeRaw } = up.element.parseSelector(deriver);
            if (includePath.length !== 1) {
                throw new up.CannotParse(deriver);
            }
            let { tagName, id, classNames, attributes } = includePath[0];
            let result = '';
            if (tagName === '*') {
                result += e.tagName(element);
            }
            else if (tagName) {
                result += tagName;
            }
            for (let className of classNames) {
                result += e.classSelector(className);
            }
            if (id) {
                result += e.idSelector(id);
            }
            for (let attributeName in attributes) {
                let attributeValue = attributes[attributeName] || element.getAttribute(attributeName);
                if (attributeName === 'id') {
                    result += e.idSelector(attributeValue);
                }
                else if (attributeName === 'class') {
                    for (let goodClass of goodClassesForTarget(element)) {
                        result += e.classSelector(goodClass);
                    }
                }
                else {
                    result += e.attrSelector(attributeName, attributeValue);
                }
            }
            if (excludeRaw) {
                result += excludeRaw;
            }
            return result;
        }
        function isGoodTarget(target, element, options = {}) {
            return !isAlive(element) || !config.verifyDerivedTarget || up.fragment.get(target, { layer: element, ...options }) === element;
        }
        function matchesPattern(pattern, str) {
            if (u.isRegExp(pattern)) {
                return pattern.test(str);
            }
            else {
                return pattern === str;
            }
        }
        function goodClassesForTarget(element) {
            let isGood = (klass) => !u.some(config.badTargetClasses, (badTargetClass) => matchesPattern(badTargetClass, klass));
            return u.filter(element.classList, isGood);
        }
        const MAIN_PSEUDO = /:main\b/;
        const LAYER_PSEUDO = /:layer\b/;
        const ORIGIN_PSEUDO = /:origin\b/;
        function containsMainPseudo(target) {
            return MAIN_PSEUDO.test(target);
        }
        function expandTargets(targets, options = {}) {
            const { layer } = options;
            if (layer !== 'new' && !(layer instanceof up.Layer)) {
                up.fail('Must pass an up.Layer as { layer } option, but got %o', layer);
            }
            targets = u.copy(u.wrapList(targets));
            const expanded = [];
            while (targets.length) {
                let target = targets.shift();
                if (target === true)
                    target = ':main';
                if (containsMainPseudo(target)) {
                    let mode = resolveMode(options);
                    let replaced = up.layer.mainTargets(mode).map((mainTarget) => target.replace(MAIN_PSEUDO, mainTarget));
                    targets.unshift(...replaced);
                }
                else if (LAYER_PSEUDO.test(target)) {
                    if (layer === 'new' || layer.opening)
                        continue;
                    let firstSwappableTarget = toTarget(layer.getFirstSwappableElement(), options);
                    targets.unshift(target.replace(LAYER_PSEUDO, firstSwappableTarget));
                }
                else if (u.isElementish(target)) {
                    expanded.push(toTarget(target, options));
                }
                else if (u.isString(target)) {
                    expanded.push(resolveOrigin(target, options));
                }
            }
            return u.uniq(expanded);
        }
        function resolveMode({ layer, mode }) {
            if (layer === 'new') {
                return mode || up.fail('Must pass a { mode } option together with { layer: "new" }');
            }
            else {
                return layer.mode;
            }
        }
        function modernResolveOrigin(target, { origin } = {}) {
            return target.replace(ORIGIN_PSEUDO, function (match) {
                if (origin) {
                    return toTarget(origin);
                }
                else {
                    up.fail('Missing { origin } element to resolve "%s" reference (found in %s)', match, target);
                }
            });
        }
        function resolveOrigin(...args) {
            return (up.migrate.resolveOrigin || modernResolveOrigin)(...args);
        }
        function splitTarget(target) {
            return u.parseTokens(target, { separator: 'comma' });
        }
        function parseTargetSteps(target, options = {}) {
            let defaultPlacement = options.defaultPlacement || 'swap';
            let defaultMaybe = options.defaultMaybe ?? false;
            let steps = [];
            let simpleSelectors = splitTarget(target);
            for (let selector of simpleSelectors) {
                if (selector === ':none')
                    continue;
                let placement = defaultPlacement;
                let maybe = defaultMaybe;
                selector = selector.replace(/\b::?(before|after)\b/, (_match, customPlacement) => {
                    placement = customPlacement;
                    return '';
                });
                selector = selector.replace(/\b:maybe\b/, () => {
                    maybe = true;
                    return '';
                });
                const step = {
                    ...options,
                    selector,
                    placement,
                    maybe,
                    originalRenderOptions: options,
                };
                steps.push(step);
            }
            return steps;
        }
        function hasAutoHistory(newFragments, layer) {
            let vanillaSelector = expandTargets(config.autoHistoryTargets, { layer }).join();
            for (let newFragment of newFragments) {
                if (e.subtree(newFragment, vanillaSelector).length) {
                    return true;
                }
            }
            up.puts('up.render()', "Will not auto-update history because fragment doesn't contain a selector from up.fragment.config.autoHistoryTargets");
            return false;
        }
        function matches(element, selector, options = {}) {
            element = e.get(element);
            if (u.isElement(selector)) {
                let target = tryToTarget(selector);
                return target && element.matches(target);
            }
            else {
                return new up.Selector(selector, element, options).matches(element);
            }
        }
        function shouldRevalidate(request, response, options = {}) {
            return request.fromCache && u.evalAutoOption(options.revalidate, config.autoRevalidate, response);
        }
        function targetForSteps(steps) {
            let bestSteps = steps.filter((step) => !step.maybe || step.oldElement?.isConnected);
            let selectors = u.map(bestSteps, 'selector');
            return selectors.join(', ') || ':none';
        }
        function isContainedByRivalStep(steps, candidateStep) {
            return u.some(steps, function (rivalStep) {
                return (rivalStep !== candidateStep) &&
                    ((rivalStep.placement === 'swap') || (rivalStep.placement === 'content')) &&
                    rivalStep.oldElement.contains(candidateStep.oldElement);
            });
        }
        function compressNestedSteps(steps) {
            if (steps.length < 2)
                return steps;
            let compressed = u.uniqBy(steps, 'oldElement');
            compressed = u.reject(compressed, step => isContainedByRivalStep(compressed, step));
            return compressed;
        }
        function abort(...args) {
            let options = parseTargetAndOptions(args);
            let testFn;
            let { reason, newLayer } = options;
            let elements;
            if (options.target) {
                elements = getAll(options.target, options);
                testFn = (request) => request.isPartOfSubtree(elements);
                reason ||= 'Aborting requests within fragment';
            }
            else {
                let layers = up.layer.getAll(options);
                elements = u.map(layers, 'element');
                testFn = (request) => u.contains(layers, request.layer);
                reason ||= 'Aborting requests within ' + layers.join(', ');
            }
            let testFnWithAbortable = (request) => request.abortable && testFn(request);
            up.network.abort(testFnWithAbortable, { ...options, reason });
            for (let element of elements) {
                up.emit(element, 'up:fragment:aborted', { reason, newLayer, log: false });
            }
        }
        function onAborted(fragment, callback) {
            let guard = (event) => event.target.contains(fragment);
            let unsubscribe = up.on('up:fragment:aborted', { guard }, callback);
            up.destructor(fragment, unsubscribe);
            return unsubscribe;
        }
        up.on('up:framework:boot', function () {
            const { documentElement } = document;
            documentElement.setAttribute('up-source', u.normalizeURL(location.href, { hash: false }));
            up.hello(documentElement);
            if (!up.browser.canPushState()) {
                return up.warn('Cannot push history changes. Next fragment update will load in a new page.');
            }
        });
        return {
            config,
            reload,
            destroy,
            render,
            navigate,
            get: getSmart,
            getDumb,
            all: getAll,
            subtree: getSubtree,
            contains,
            closest,
            source: sourceOf,
            visit,
            markAsDestroying: markFragmentAsDestroying,
            emitInserted: emitFragmentInserted,
            emitDestroyed: emitFragmentDestroyed,
            emitKeep: emitFragmentKeep,
            successKey,
            failKey,
            expandTargets,
            resolveOrigin,
            toTarget,
            tryToTarget,
            isTargetable,
            matches,
            hasAutoHistory,
            time: timeOf,
            etag: etagOf,
            shouldRevalidate,
            abort,
            onAborted,
            splitTarget,
            parseTargetSteps,
            isAlive,
            isNotDestroying,
            targetForSteps,
            compressNestedSteps,
            containsMainPseudo,
        };
    })();
    up.reload = up.fragment.reload;
    up.destroy = up.fragment.destroy;
    up.render = up.fragment.render;
    up.navigate = up.fragment.navigate;
    up.visit = up.fragment.visit;
    u.delegate(up, ['context'], () => up.layer.current);
    
    
    /***/ }),
    /* 87 */
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    // extracted by mini-css-extract-plugin
    
    
    /***/ }),
    /* 88 */
    /***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
    
    __webpack_require__(89);
    up.viewport = (function () {
        const u = up.util;
        const e = up.element;
        const f = up.fragment;
        const config = new up.Config(() => ({
            viewportSelectors: ['[up-viewport]', '[up-fixed]'],
            fixedTopSelectors: ['[up-fixed~=top]'],
            fixedBottomSelectors: ['[up-fixed~=bottom]'],
            anchoredRightSelectors: ['[up-anchored~=right]', '[up-fixed~=top]', '[up-fixed~=bottom]', '[up-fixed~=right]'],
            revealSnap: 200,
            revealPadding: 0,
            revealTop: false,
            revealMax() { return 0.5 * window.innerHeight; },
            autoFocusVisible({ element, inputDevice }) { return inputDevice === 'key' || up.form.isField(element); }
        }));
        const bodyShifter = new up.BodyShifter();
        up.compiler(config.selectorFn('anchoredRightSelectors'), function (element) {
            return bodyShifter.onAnchoredElementInserted(element);
        });
        function reveal(element, options) {
            options = u.options(options);
            element = f.get(element, options);
            if (!(options.layer = up.layer.get(element))) {
                up.fail('Cannot reveal a detached element');
            }
            if (options.peel) {
                options.layer.peel();
            }
            const motion = new up.RevealMotion(element, options);
            motion.start();
            return up.migrate.formerlyAsync?.('up.reveal()') || true;
        }
        function doFocus(element, { preventScroll, force, inputDevice, focusVisible } = {}) {
            if (force) {
                if (!element.hasAttribute('tabindex') && element.tabIndex === -1) {
                    element.setAttribute('tabindex', '-1');
                }
            }
            inputDevice ??= up.event.inputDevice;
            focusVisible ??= 'auto';
            focusVisible = u.evalAutoOption(focusVisible, config.autoFocusVisible, { element, inputDevice });
            element.focus({
                preventScroll: true,
                focusVisible,
            });
            removeFocusClasses(element);
            element.classList.add(focusVisible ? 'up-focus-visible' : 'up-focus-hidden');
            if (!preventScroll) {
                return reveal(element);
            }
        }
        function removeFocusClasses(element) {
            element?.classList.remove('up-focus-hidden', 'up-focus-visible');
        }
        up.on('focusin', function ({ relatedTarget }) {
            removeFocusClasses(relatedTarget);
        });
        function tryFocus(element, options) {
            doFocus(element, options);
            return element === document.activeElement;
        }
        function revealHash(hash = location.hash, options) {
            let match = firstHashTarget(hash, options);
            if (match) {
                return up.reveal(match, { top: true });
            }
        }
        function allSelector() {
            return [rootSelector(), ...config.viewportSelectors].join();
        }
        function closest(target, options = {}) {
            const element = f.get(target, options);
            return element.closest(allSelector());
        }
        function getSubtree(element, options = {}) {
            element = f.get(element, options);
            return e.subtree(element, allSelector());
        }
        function getAround(element, options = {}) {
            element = f.get(element, options);
            return e.around(element, allSelector());
        }
        function getAll(options = {}) {
            return f.all(allSelector(), options);
        }
        function rootSelector() {
            return getRoot().tagName;
        }
        function getRoot() {
            return document.scrollingElement;
        }
        function rootWidth() {
            return e.root.clientWidth;
        }
        function rootHeight() {
            return e.root.clientHeight;
        }
        function isRoot(element) {
            return element === getRoot();
        }
        function rootHasReducedWidthFromScrollbar() {
            return window.innerWidth > document.documentElement.offsetWidth;
        }
        function rootOverflowElement() {
            const { body } = document;
            const html = document.documentElement;
            const element = u.find([html, body], wasChosenAsOverflowingElement);
            return element || getRoot();
        }
        function wasChosenAsOverflowingElement(element) {
            const overflowY = e.style(element, 'overflow-y');
            return overflowY === 'auto' || overflowY === 'scroll';
        }
        const scrollbarWidth = u.memoize(function () {
            const outerStyle = {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100px',
                height: '100px',
                overflowY: 'scroll'
            };
            const outer = up.element.affix(document.body, '[up-viewport]', { style: outerStyle });
            const width = outer.offsetWidth - outer.clientWidth;
            outer.remove();
            return width;
        });
        function scrollTopKey(viewport) {
            return up.fragment.tryToTarget(viewport);
        }
        function fixedElements(root = document) {
            const queryParts = ['[up-fixed]'].concat(config.fixedTopSelectors).concat(config.fixedBottomSelectors);
            return root.querySelectorAll(queryParts.join());
        }
        function saveScroll(...args) {
            const [viewports, options] = parseOptions(args);
            const location = options.location || options.layer.location;
            if (location) {
                const tops = getScrollTopsForSave(viewports);
                options.layer.lastScrollTops.set(location, tops);
            }
        }
        function getScrollTopsForSave(viewports) {
            let tops = {};
            for (let viewport of viewports) {
                let key = scrollTopKey(viewport);
                if (key) {
                    tops[key] = viewport.scrollTop;
                }
                else {
                    up.warn('up.viewport.saveScroll()', 'Cannot save scroll positions for untargetable viewport %o', viewport);
                }
            }
            return tops;
        }
        function restoreScroll(...args) {
            const [viewports, options] = parseOptions(args);
            const { location } = options.layer;
            const locationScrollTops = options.layer.lastScrollTops.get(location);
            if (locationScrollTops) {
                setScrollTops(viewports, locationScrollTops);
                up.puts('up.viewport.restoreScroll()', 'Restored scroll positions to %o', locationScrollTops);
                return true;
            }
            else {
                return false;
            }
        }
        function saveFocus(options = {}) {
            const layer = up.layer.get(options);
            const location = options.location || layer.location;
            if (location) {
                const focusCapsule = up.FocusCapsule.preserve(layer);
                layer.lastFocusCapsules.set(location, focusCapsule);
            }
        }
        function restoreFocus(options = {}) {
            const layer = up.layer.get(options);
            const location = options.location || layer.location;
            const locationCapsule = options.layer.lastFocusCapsules.get(location);
            if (locationCapsule && locationCapsule.restore(layer)) {
                up.puts('up.viewport.restoreFocus()', 'Restored focus to "%s"', locationCapsule.target);
                return true;
            }
            else {
                return false;
            }
        }
        function newStateCache() {
            return new up.FIFOCache({ capacity: 30, normalizeKey: up.history.normalizeURL });
        }
        function parseOptions(args) {
            const options = u.copy(u.extractOptions(args));
            options.layer = up.layer.get(options);
            let viewports;
            if (args[0]) {
                viewports = [closest(args[0], options)];
            }
            else if (options.around) {
                viewports = getAround(options.around, options);
            }
            else {
                viewports = getAll(options);
            }
            return [viewports, options];
        }
        function resetScroll(...args) {
            const [viewports, _options] = parseOptions(args);
            setScrollTops(viewports, {});
        }
        function setScrollTops(viewports, tops) {
            for (let viewport of viewports) {
                const key = scrollTopKey(viewport);
                viewport.scrollTop = tops[key] || 0;
            }
        }
        function absolutize(element, options = {}) {
            const viewport = closest(element);
            const viewportRect = viewport.getBoundingClientRect();
            const originalRect = element.getBoundingClientRect();
            const boundsRect = new up.Rect({
                left: originalRect.left - viewportRect.left,
                top: originalRect.top - viewportRect.top,
                width: originalRect.width,
                height: originalRect.height
            });
            options.afterMeasure?.();
            e.setStyle(element, {
                position: element.style.position === 'static' ? 'static' : 'relative',
                top: 'auto',
                right: 'auto',
                bottom: 'auto',
                left: 'auto',
                width: '100%',
                height: '100%'
            });
            const bounds = e.createFromSelector('up-bounds');
            e.insertBefore(element, bounds);
            bounds.appendChild(element);
            const moveBounds = function (diffX, diffY) {
                boundsRect.left += diffX;
                boundsRect.top += diffY;
                return e.setStyle(bounds, boundsRect);
            };
            moveBounds(0, 0);
            const newElementRect = element.getBoundingClientRect();
            moveBounds(originalRect.left - newElementRect.left, originalRect.top - newElementRect.top);
            u.each(fixedElements(element), e.fixedToAbsolute);
            return {
                bounds,
                moveBounds
            };
        }
        function firstHashTarget(hash, options = {}) {
            if (hash = pureHash(hash)) {
                const selector = [
                    e.attrSelector('id', hash),
                    'a' + e.attrSelector('name', hash)
                ].join();
                return f.get(selector, options);
            }
        }
        function pureHash(value) {
            return value?.replace(/^#/, '');
        }
        function focusedElementWithin(scopeElement) {
            const focusedElement = document.activeElement;
            if (up.fragment.contains(scopeElement, focusedElement)) {
                return focusedElement;
            }
        }
        const CURSOR_PROPS = ['selectionStart', 'selectionEnd', 'scrollLeft', 'scrollTop'];
        function copyCursorProps(from, to = {}) {
            for (let key of CURSOR_PROPS) {
                try {
                    to[key] = from[key];
                }
                catch (error) {
                }
            }
            return to;
        }
        let userScrolled = false;
        up.on('scroll', { once: true, beforeBoot: true }, () => userScrolled = true);
        up.on('up:framework:boot', function () {
            u.task(function () {
                if (!userScrolled) {
                    return revealHash();
                }
            });
        });
        up.on(window, 'hashchange', () => revealHash());
        return {
            reveal,
            revealHash,
            firstHashTarget,
            config,
            get: closest,
            subtree: getSubtree,
            around: getAround,
            get root() { return getRoot(); },
            rootWidth,
            rootHeight,
            rootHasReducedWidthFromScrollbar,
            rootOverflowElement,
            isRoot,
            scrollbarWidth,
            saveScroll,
            restoreScroll,
            resetScroll,
            saveFocus,
            restoreFocus,
            absolutize,
            focus: doFocus,
            tryFocus,
            newStateCache,
            focusedElementWithin,
            copyCursorProps,
            bodyShifter,
        };
    })();
    up.focus = up.viewport.focus;
    up.reveal = up.viewport.reveal;
    
    
    /***/ }),
    /* 89 */
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    // extracted by mini-css-extract-plugin
    
    
    /***/ }),
    /* 90 */
    /***/ (() => {
    
    up.motion = (function () {
        const u = up.util;
        const e = up.element;
        let namedAnimations = {};
        let namedTransitions = {};
        const motionController = new up.MotionController('motion');
        const config = new up.Config(() => ({
            duration: 175,
            easing: 'ease',
            enabled: !matchMedia('(prefers-reduced-motion: reduce)').matches
        }));
        function pickDefault(registry) {
            return u.pickBy(registry, 'isDefault');
        }
        function reset() {
            motionController.reset();
            namedAnimations = pickDefault(namedAnimations);
            namedTransitions = pickDefault(namedTransitions);
        }
        function isEnabled() {
            return config.enabled;
        }
        function animate(element, animation, options) {
            element = up.fragment.get(element);
            options = u.options(options);
            let animationFn = findAnimationFn(animation);
            const willRun = willAnimate(element, animation, options);
            animationFn = up.error.guardFn(animationFn);
            if (willRun) {
                const runNow = () => animationFn(element, options);
                return motionController.startFunction(element, runNow, options);
            }
            else {
                return skipAnimate(element, animation);
            }
        }
        function willAnimate(element, animationOrTransition, options) {
            applyConfig(options);
            return isEnabled() && !isNone(animationOrTransition) && (options.duration > 0) && !e.isSingleton(element);
        }
        function skipAnimate(element, animation) {
            if (u.isOptions(animation)) {
                e.setStyle(element, animation);
            }
            return Promise.resolve();
        }
        function animateNow(element, lastFrame, options) {
            options = { ...options, finishEvent: motionController.finishEvent };
            const cssTransition = new up.CSSTransition(element, lastFrame, options);
            return cssTransition.start();
        }
        function applyConfig(options) {
            options.easing ||= config.easing;
            options.duration ||= config.duration;
        }
        function findNamedAnimation(name) {
            return namedAnimations[name] || up.fail("Unknown animation %o", name);
        }
        function finish(element) {
            return motionController.finish(element);
        }
        function morph(oldElement, newElement, transitionObject, options) {
            options = u.options(options);
            applyConfig(options);
            oldElement = up.fragment.get(oldElement);
            newElement = up.fragment.get(newElement);
            let transitionFn = findTransitionFn(transitionObject);
            const willMorph = willAnimate(oldElement, transitionFn, options);
            transitionFn = up.error.guardFn(transitionFn);
            const beforeStart = u.pluckKey(options, 'beforeStart') || u.noop;
            const afterInsert = u.pluckKey(options, 'afterInsert') || u.noop;
            const beforeDetach = u.pluckKey(options, 'beforeDetach') || u.noop;
            const afterDetach = u.pluckKey(options, 'afterDetach') || u.noop;
            const scrollNew = u.pluckKey(options, 'scrollNew') || u.noop;
            beforeStart();
            if (willMorph) {
                if (motionController.isActive(oldElement) && (options.trackMotion === false)) {
                    return transitionFn(oldElement, newElement, options);
                }
                up.puts('up.morph()', 'Morphing %o to %o with transition %O over %d ms', oldElement, newElement, transitionObject, options.duration);
                const viewport = up.viewport.get(oldElement);
                const scrollTopBeforeReveal = viewport.scrollTop;
                const oldRemote = up.viewport.absolutize(oldElement, {
                    afterMeasure() {
                        e.insertBefore(oldElement, newElement);
                        afterInsert();
                    }
                });
                const trackable = async function () {
                    scrollNew();
                    const scrollTopAfterReveal = viewport.scrollTop;
                    oldRemote.moveBounds(0, scrollTopAfterReveal - scrollTopBeforeReveal);
                    await transitionFn(oldElement, newElement, options);
                    beforeDetach();
                    oldRemote.bounds.remove();
                    afterDetach();
                };
                return motionController.startFunction([oldElement, newElement], trackable, options);
            }
            else {
                beforeDetach();
                swapElementsDirectly(oldElement, newElement);
                afterInsert();
                afterDetach();
                scrollNew();
                return Promise.resolve();
            }
        }
        function findTransitionFn(object) {
            if (isNone(object)) {
                return undefined;
            }
            else if (u.isFunction(object)) {
                return object;
            }
            else if (u.isArray(object)) {
                return composeTransitionFn(...object);
            }
            else if (u.isString(object)) {
                let namedTransition;
                if (object.indexOf('/') >= 0) {
                    return composeTransitionFn(...object.split('/'));
                }
                else if (namedTransition = namedTransitions[object]) {
                    return findTransitionFn(namedTransition);
                }
            }
            else {
                up.fail("Unknown transition %o", object);
            }
        }
        function composeTransitionFn(oldAnimation, newAnimation) {
            if (!isNone(oldAnimation) && !isNone(newAnimation)) {
                const oldAnimationFn = findAnimationFn(oldAnimation) || u.asyncNoop;
                const newAnimationFn = findAnimationFn(newAnimation) || u.asyncNoop;
                return (oldElement, newElement, options) => Promise.all([
                    oldAnimationFn(oldElement, options),
                    newAnimationFn(newElement, options)
                ]);
            }
        }
        function findAnimationFn(object) {
            if (isNone(object)) {
                return undefined;
            }
            else if (u.isFunction(object)) {
                return object;
            }
            else if (u.isString(object)) {
                return findNamedAnimation(object);
            }
            else if (u.isOptions(object)) {
                return (element, options) => animateNow(element, object, options);
            }
            else {
                up.fail('Unknown animation %o', object);
            }
        }
        const swapElementsDirectly = up.mockable(function (oldElement, newElement) {
            oldElement.replaceWith(newElement);
        });
        function motionOptions(element, options, parserOptions) {
            options = u.options(options);
            let parser = new up.OptionsParser(element, options, parserOptions);
            parser.booleanOrString('animation');
            parser.booleanOrString('transition');
            parser.string('easing');
            parser.number('duration');
            return options;
        }
        function registerTransition(name, transition) {
            const fn = findTransitionFn(transition);
            fn.isDefault = up.framework.evaling;
            namedTransitions[name] = fn;
        }
        function registerAnimation(name, animation) {
            const fn = findAnimationFn(animation);
            fn.isDefault = up.framework.evaling;
            namedAnimations[name] = fn;
        }
        up.on('up:framework:boot', function () {
            if (!isEnabled()) {
                up.puts('up.motion', 'Animations are disabled');
            }
        });
        function isNone(animationOrTransition) {
            return !animationOrTransition || animationOrTransition === 'none';
        }
        function registerOpacityAnimation(name, from, to) {
            registerAnimation(name, function (element, options) {
                element.style.opacity = 0;
                e.setStyle(element, { opacity: from });
                return animateNow(element, { opacity: to }, options);
            });
        }
        registerOpacityAnimation('fade-in', 0, 1);
        registerOpacityAnimation('fade-out', 1, 0);
        function translateCSS(dx, dy) {
            return { transform: `translate(${dx}px, ${dy}px)` };
        }
        function noTranslateCSS() {
            return { transform: null };
        }
        function untranslatedBox(element) {
            e.setStyle(element, noTranslateCSS());
            return element.getBoundingClientRect();
        }
        function registerMoveAnimations(direction, boxToTransform) {
            const animationToName = `move-to-${direction}`;
            const animationFromName = `move-from-${direction}`;
            registerAnimation(animationToName, function (element, options) {
                const box = untranslatedBox(element);
                const transform = boxToTransform(box);
                return animateNow(element, transform, options);
            });
            registerAnimation(animationFromName, function (element, options) {
                const box = untranslatedBox(element);
                const transform = boxToTransform(box);
                e.setStyle(element, transform);
                return animateNow(element, noTranslateCSS(), options);
            });
        }
        registerMoveAnimations('top', function (box) {
            const travelDistance = box.top + box.height;
            return translateCSS(0, -travelDistance);
        });
        registerMoveAnimations('bottom', function (box) {
            const travelDistance = up.viewport.rootHeight() - box.top;
            return translateCSS(0, travelDistance);
        });
        registerMoveAnimations('left', function (box) {
            const travelDistance = box.left + box.width;
            return translateCSS(-travelDistance, 0);
        });
        registerMoveAnimations('right', function (box) {
            const travelDistance = up.viewport.rootWidth() - box.left;
            return translateCSS(travelDistance, 0);
        });
        registerTransition('cross-fade', ['fade-out', 'fade-in']);
        registerTransition('move-left', ['move-to-left', 'move-from-right']);
        registerTransition('move-right', ['move-to-right', 'move-from-left']);
        registerTransition('move-up', ['move-to-top', 'move-from-bottom']);
        registerTransition('move-down', ['move-to-bottom', 'move-from-top']);
        up.on('up:framework:reset', reset);
        return {
            morph,
            animate,
            finish,
            finishCount() { return motionController.finishCount; },
            transition: registerTransition,
            animation: registerAnimation,
            config,
            isEnabled,
            isNone,
            willAnimate,
            swapElementsDirectly,
            motionOptions,
        };
    })();
    up.transition = up.motion.transition;
    up.animation = up.motion.animation;
    up.morph = up.motion.morph;
    up.animate = up.motion.animate;
    
    
    /***/ }),
    /* 91 */
    /***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
    
    __webpack_require__(92);
    const u = up.util;
    up.network = (function () {
        const config = new up.Config(() => ({
            concurrency: 6,
            wrapMethod: true,
            cacheSize: 70,
            cacheExpireAge: 15 * 1000,
            cacheEvictAge: 90 * 60 * 1000,
            badResponseTime: 400,
            fail(response) { return (response.status < 200 || response.status > 299) && response.status !== 304; },
            autoCache(request) { return request.isSafe(); },
            expireCache(request, _response) { return !request.isSafe(); },
            evictCache: false,
            progressBar: true,
            timeout: 90000,
        }));
        const queue = new up.Request.Queue();
        const cache = new up.Request.Cache();
        let progressBar = null;
        function reset() {
            abortRequests();
            queue.reset();
            cache.reset();
            progressBar?.destroy();
            progressBar = null;
        }
        function makeRequest(...args) {
            const options = parseRequestOptions(args);
            const request = new up.Request(options);
            processRequest(request);
            return request;
        }
        function parseRequestOptions(args) {
            const options = u.extractOptions(args);
            if (!options.url) {
                options.url = args[0];
            }
            up.migrate.handleRequestOptions?.(options);
            return options;
        }
        function processRequest(request) {
            useCachedRequest(request) || queueRequest(request);
        }
        function useCachedRequest(newRequest) {
            let cachedRequest;
            if (newRequest.willCache() && (cachedRequest = cache.get(newRequest))) {
                up.puts('up.request()', 'Re-using previous request to %s', newRequest.description);
                if (!newRequest.background) {
                    queue.promoteToForeground(cachedRequest);
                }
                cache.track(cachedRequest, newRequest, { onIncompatible: processRequest });
                return true;
            }
        }
        function queueRequest(request) {
            handleCaching(request);
            queue.asap(request);
            return true;
        }
        function handleCaching(request) {
            if (request.willCache()) {
                cache.put(request);
                request.onLoading = () => cache.put(request);
            }
            u.always(request, function (responseOrError) {
                let expireCache = responseOrError.expireCache ?? request.expireCache ?? u.evalOption(config.expireCache, request, responseOrError);
                if (expireCache) {
                    cache.expire(expireCache, { except: request });
                }
                let evictCache = responseOrError.evictCache ?? request.evictCache ?? u.evalOption(config.evictCache, request, responseOrError);
                if (evictCache) {
                    cache.evict(evictCache, { except: request });
                }
                if (cache.get(request)) {
                    cache.put(request);
                }
                if (!responseOrError.isCacheable?.()) {
                    cache.evict(request);
                }
            });
        }
        function isBusy() {
            return queue.isBusy();
        }
        function loadPage(requestsAttrs) {
            new up.Request(requestsAttrs).loadPage();
        }
        function abortRequests(...args) {
            up.migrate.preprocessAbortArgs?.(args);
            queue.abort(...args);
        }
        function registerAliasForRedirect(request, response) {
            if (request.cache && response.url && request.url !== response.url) {
                const newRequest = u.variant(request, {
                    method: response.method,
                    url: response.url
                });
                cache.alias(request, newRequest);
            }
        }
        function isSafeMethod(method) {
            return u.contains(['GET', 'OPTIONS', 'HEAD'], u.normalizeMethod(method));
        }
        function onLate() {
            if (u.evalOption(config.progressBar)) {
                progressBar = new up.ProgressBar();
            }
        }
        function onRecover() {
            progressBar?.conclude();
        }
        up.on('up:network:late', onLate);
        up.on('up:network:recover', onRecover);
        up.on('up:framework:reset', reset);
        return {
            request: makeRequest,
            cache,
            isBusy,
            isSafeMethod,
            config,
            abort: abortRequests,
            registerAliasForRedirect,
            queue,
            loadPage,
        };
    })();
    up.request = up.network.request;
    up.cache = up.network.cache;
    
    
    /***/ }),
    /* 92 */
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    // extracted by mini-css-extract-plugin
    
    
    /***/ }),
    /* 93 */
    /***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
    
    __webpack_require__(94);
    const u = up.util;
    const e = up.element;
    up.layer = (function () {
        const LAYER_CLASSES = [
            up.Layer.Root,
            up.Layer.Modal,
            up.Layer.Popup,
            up.Layer.Drawer,
            up.Layer.Cover
        ];
        const config = new up.Config(function () {
            const newConfig = {
                mode: 'modal',
                any: {
                    mainTargets: [
                        "[up-main='']",
                        'main',
                        ':layer'
                    ]
                },
                root: {
                    mainTargets: ['[up-main~=root]'],
                    history: true
                },
                overlay: {
                    mainTargets: ['[up-main~=overlay]'],
                    openAnimation: 'fade-in',
                    closeAnimation: 'fade-out',
                    dismissLabel: '×',
                    dismissAriaLabel: 'Dismiss dialog',
                    dismissable: true,
                    history: 'auto'
                },
                cover: {
                    mainTargets: ['[up-main~=cover]']
                },
                drawer: {
                    mainTargets: ['[up-main~=drawer]'],
                    backdrop: true,
                    position: 'left',
                    size: 'medium',
                    openAnimation(layer) {
                        switch (layer.position) {
                            case 'left': return 'move-from-left';
                            case 'right': return 'move-from-right';
                        }
                    },
                    closeAnimation(layer) {
                        switch (layer.position) {
                            case 'left': return 'move-to-left';
                            case 'right': return 'move-to-right';
                        }
                    }
                },
                modal: {
                    mainTargets: ['[up-main~=modal]'],
                    backdrop: true,
                    size: 'medium'
                },
                popup: {
                    mainTargets: ['[up-main~=popup]'],
                    position: 'bottom',
                    size: 'medium',
                    align: 'left',
                    dismissable: 'outside key'
                },
                foreignOverlaySelectors: ['dialog']
            };
            for (let Class of LAYER_CLASSES) {
                newConfig[Class.mode].Class = Class;
            }
            return newConfig;
        });
        let stack = null;
        let handlers = [];
        function mainTargets(mode) {
            return u.flatMap(modeConfigs(mode), 'mainTargets');
        }
        function modeConfigs(mode) {
            if (mode === 'root') {
                return [config.root, config.any];
            }
            else {
                return [config[mode], config.overlay, config.any];
            }
        }
        function normalizeOptions(options) {
            up.migrate.handleLayerOptions?.(options);
            if (u.isGiven(options.layer)) {
                let match = String(options.layer).match(/^(new|shatter|swap)( (\w+))?/);
                if (match) {
                    options.layer = 'new';
                    const openMethod = match[1];
                    const shorthandMode = match[3];
                    options.mode ||= shorthandMode || config.mode;
                    if (openMethod === 'swap') {
                        if (up.layer.isOverlay()) {
                            options.baseLayer = 'parent';
                        }
                    }
                    else if (openMethod === 'shatter') {
                        options.baseLayer = 'root';
                    }
                }
            }
            else {
                if (options.mode) {
                    options.layer = 'new';
                }
                else if (u.isElementish(options.target)) {
                    options.layer = stack.get(options.target, { normalizeLayerOptions: false });
                }
                else if (options.origin) {
                    options.layer = 'origin';
                }
                else {
                    options.layer = 'current';
                }
            }
            if (!options.context) {
                options.context = {};
            }
            options.baseLayer = stack.get('current', { ...options, normalizeLayerOptions: false });
        }
        function build(options, beforeNew) {
            const { mode } = options;
            const { Class } = config[mode];
            const configs = u.reverse(modeConfigs(mode));
            let handleDeprecatedConfig = up.migrate.handleLayerConfig;
            if (handleDeprecatedConfig) {
                configs.forEach(handleDeprecatedConfig);
            }
            options.openAnimation ??= u.pluckKey(options, 'animation');
            options = u.mergeDefined(...configs, { mode, stack }, options);
            if (beforeNew) {
                options = beforeNew(options);
            }
            return new Class(options);
        }
        function openCallbackAttr(link, attr) {
            return e.callbackAttr(link, attr, { exposedKeys: ['layer'] });
        }
        function closeCallbackAttr(link, attr) {
            return e.callbackAttr(link, attr, { exposedKeys: ['layer', 'value', 'response'] });
        }
        function reset() {
            stack.reset();
            handlers = u.filter(handlers, 'isDefault');
        }
        async function open(options) {
            options = u.options(options, {
                layer: 'new',
                defaultToEmptyContent: true,
                navigate: true
            });
            let result = await up.render(options);
            return result.layer;
        }
        function ask(options) {
            return new Promise(function (resolve, reject) {
                options = {
                    ...options,
                    onAccepted: (event) => resolve(event.value),
                    onDismissed: (event) => reject(event.value)
                };
                open(options);
            });
        }
        function anySelector() {
            return u.map(LAYER_CLASSES, Class => Class.selector()).join();
        }
        function optionToString(option) {
            if (u.isString(option)) {
                return `layer "${option}"`;
            }
            else {
                return option.toString();
            }
        }
        function isWithinForeignOverlay(element) {
            let selector = config.selector('foreignOverlaySelectors');
            return !!(selector && element.closest(selector));
        }
        up.on('up:fragment:destroyed', function () {
            stack.sync();
        });
        up.on('up:framework:evaled', function () {
            stack = new up.LayerStack();
        });
        up.on('up:framework:reset', reset);
        const api = {
            config,
            mainTargets,
            open,
            build,
            ask,
            normalizeOptions,
            openCallbackAttr,
            closeCallbackAttr,
            anySelector,
            optionToString,
            get stack() { return stack.layers; },
            isWithinForeignOverlay
        };
        u.delegate(api, [
            'get',
            'getAll',
            'root',
            'overlays',
            'current',
            'front',
            'sync',
            'count',
            'dismissOverlays'
        ], () => stack);
        u.delegate(api, [
            'accept',
            'dismiss',
            'isRoot',
            'isOverlay',
            'isFront',
            'on',
            'off',
            'emit',
            'parent',
            'history',
            'location',
            'mode',
            'context',
            'element',
            'contains',
            'size',
            'affix'
        ], () => stack.current);
        return api;
    })();
    
    
    /***/ }),
    /* 94 */
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    // extracted by mini-css-extract-plugin
    
    
    /***/ }),
    /* 95 */
    /***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
    
    __webpack_require__(96);
    up.link = (function () {
        const u = up.util;
        const e = up.element;
        const linkPreloader = new up.LinkPreloader();
        let lastMousedownTarget = null;
        const LINKS_WITH_LOCAL_HTML = ['a[up-content]', 'a[up-fragment]', 'a[up-document]'];
        const LINKS_WITH_REMOTE_HTML = ['a[href]', '[up-href]'];
        const ATTRIBUTES_SUGGESTING_FOLLOW = ['[up-follow]', '[up-target]', '[up-layer]', '[up-transition]', '[up-preload]', '[up-instant]', '[up-href]'];
        function combineFollowableSelectors(elementSelectors, attributeSelectors) {
            return u.flatMap(elementSelectors, elementSelector => attributeSelectors.map(attrSelector => elementSelector + attrSelector));
        }
        const config = new up.Config(() => ({
            followSelectors: combineFollowableSelectors(LINKS_WITH_REMOTE_HTML, ATTRIBUTES_SUGGESTING_FOLLOW).concat(LINKS_WITH_LOCAL_HTML),
            noFollowSelectors: ['[up-follow=false]', 'a[download]', 'a[target]', 'a[href^="#"]:not([up-content]):not([up-fragment]):not([up-document])', 'a[href^="javascript:"]', 'a[href^="mailto:"]', e.crossOriginSelector('href'), e.crossOriginSelector('up-href')],
            instantSelectors: ['[up-instant]'],
            noInstantSelectors: ['[up-instant=false]', '[onclick]'],
            preloadSelectors: combineFollowableSelectors(LINKS_WITH_REMOTE_HTML, ['[up-preload]']),
            noPreloadSelectors: ['[up-preload=false]'],
            clickableSelectors: LINKS_WITH_LOCAL_HTML.concat(['[up-emit]', '[up-accept]', '[up-dismiss]', '[up-clickable]']),
            preloadDelay: 90,
        }));
        function isPreloadDisabled(link) {
            return !up.browser.canPushState() || !isFollowable(link) || !willCache(link);
        }
        function willCache(link) {
            const options = parseRequestOptions(link);
            if (options.url) {
                if (options.cache == null) {
                    options.cache = 'auto';
                }
                options.basic = true;
                const request = new up.Request(options);
                return request.willCache();
            }
        }
        function reset() {
            lastMousedownTarget = null;
            linkPreloader.reset();
        }
        const follow = up.mockable(function (link, options) {
            return up.render(followOptions(link, options));
        });
        function parseRequestOptions(link, options, parserOptions) {
            options = u.options(options);
            const parser = new up.OptionsParser(link, options, { ...parserOptions, fail: false });
            options.url = followURL(link, options);
            options.method = followMethod(link, options);
            parser.json('headers');
            parser.json('params');
            parser.booleanOrString('cache');
            parser.booleanOrString('expireCache');
            parser.booleanOrString('evictCache');
            parser.booleanOrString('revalidate');
            parser.booleanOrString('abort');
            parser.boolean('abortable');
            parser.boolean('background');
            parser.string('contentType');
            parser.number('badResponseTime');
            parser.number('timeout');
            return options;
        }
        function followOptions(link, options, parserOptions) {
            link = up.fragment.get(link);
            options = u.options(options);
            const parser = new up.OptionsParser(link, options, { fail: true, ...parserOptions });
            parser.include(parseRequestOptions);
            parser.boolean('feedback');
            options.origin ||= link;
            parser.boolean('fail');
            parser.boolean('navigate', { default: true });
            parser.string('confirm', { attr: ['up-confirm', 'data-confirm'] });
            parser.string('target');
            parser.booleanOrString('fallback');
            parser.string('match');
            parser.string('content');
            parser.string('fragment');
            parser.string('document');
            parser.boolean('useKeep');
            parser.boolean('useHungry');
            parser.callback('onLoaded');
            parser.callback('onRendered', { mainKey: 'result' });
            parser.callback('onFinished', { mainKey: 'result' });
            parser.callback('onOffline', { mainKey: 'error' });
            parser.callback('onError', { mainKey: 'error' });
            parser.boolean('peel');
            parser.string('layer');
            parser.string('baseLayer');
            parser.json('context');
            parser.string('mode');
            parser.string('align');
            parser.string('position');
            parser.string('class');
            parser.string('size');
            parser.booleanOrString('dismissable');
            parser.parse(up.layer.openCallbackAttr, 'onOpened');
            parser.parse(up.layer.closeCallbackAttr, 'onAccepted');
            parser.parse(up.layer.closeCallbackAttr, 'onDismissed');
            parser.string('acceptEvent');
            parser.string('dismissEvent');
            parser.string('acceptLocation');
            parser.string('dismissLocation');
            parser.booleanOrString('history');
            parser.booleanOrString('focus');
            parser.boolean('saveScroll');
            parser.boolean('saveFocus');
            parser.booleanOrString('scroll');
            parser.boolean('revealTop');
            parser.number('revealMax');
            parser.number('revealPadding');
            parser.number('revealSnap');
            parser.string('scrollBehavior');
            parser.booleanOrString('history');
            parser.booleanOrString('location');
            parser.booleanOrString('title');
            parser.boolean('metaTags');
            parser.include(up.motion.motionOptions);
            if (!options.guardEvent) {
                options.guardEvent = up.event.build('up:link:follow', { log: 'Following link' });
            }
            return options;
        }
        function preload(link, options) {
            link = up.fragment.get(link);
            let issue = preloadIssue(link);
            if (issue) {
                return Promise.reject(new up.Error(issue));
            }
            const guardEvent = up.event.build('up:link:preload', { log: ['Preloading link %o', link] });
            return follow(link, {
                abortable: false,
                ...options,
                guardEvent,
                preload: true
            });
        }
        function preloadIssue(link) {
            if (!isSafe(link)) {
                return 'Will not preload an unsafe link';
            }
        }
        function followMethod(link, options = {}) {
            return u.normalizeMethod(options.method || link.getAttribute('up-method') || link.getAttribute('data-method'));
        }
        function followURL(link, options = {}) {
            const url = options.url || link.getAttribute('up-href') || link.getAttribute('href');
            if (url !== '#') {
                return url;
            }
        }
        function isFollowable(link) {
            link = up.fragment.get(link);
            return config.matches(link, 'followSelectors');
        }
        function makeFollowable(link) {
            if (!isFollowable(link)) {
                link.setAttribute('up-follow', '');
            }
        }
        function makeClickable(link) {
            if (link.matches('a[href], button')) {
                return;
            }
            e.setMissingAttrs(link, {
                tabindex: '0',
                role: 'link',
                'up-clickable': ''
            });
            link.addEventListener('keydown', function (event) {
                if ((event.key === 'Enter') || (event.key === 'Space')) {
                    return forkEventAsUpClick(event);
                }
            });
        }
        up.macro(config.selectorFn('clickableSelectors'), makeClickable);
        function shouldFollowEvent(event, link) {
            if (event.defaultPrevented) {
                return false;
            }
            const betterTargetSelector = `a, [up-href], ${up.form.fieldSelector()}`;
            const betterTarget = event.target.closest(betterTargetSelector);
            return !betterTarget || (betterTarget === link);
        }
        function isInstant(linkOrDescendant) {
            const element = linkOrDescendant.closest(config.selector('instantSelectors'));
            return element && !isInstantDisabled(element);
        }
        function isInstantDisabled(link) {
            return config.matches(link, 'noInstantSelectors') || config.matches(link, 'noFollowSelectors');
        }
        function convertClicks(layer) {
            layer.on('click', function (event, element) {
                if (!up.event.isUnmodified(event)) {
                    return;
                }
                if (isInstant(element) && lastMousedownTarget) {
                    up.event.halt(event);
                }
                else if (layer.wasHitByMouseEvent(event) && !didUserDragAway(event)) {
                    forkEventAsUpClick(event);
                }
                return lastMousedownTarget = null;
            });
            layer.on('mousedown', function (event, element) {
                if (!up.event.isUnmodified(event)) {
                    return;
                }
                lastMousedownTarget = event.target;
                if (isInstant(element)) {
                    forkEventAsUpClick(event);
                }
            });
        }
        function didUserDragAway(clickEvent) {
            return lastMousedownTarget && (lastMousedownTarget !== clickEvent.target);
        }
        function forkEventAsUpClick(originalEvent) {
            let forwardedProps = ['clientX', 'clientY', 'button', ...up.event.keyModifiers];
            const newEvent = up.event.fork(originalEvent, 'up:click', forwardedProps);
            up.emit(originalEvent.target, newEvent, { log: false });
        }
        function isSafe(link) {
            const method = followMethod(link);
            return up.network.isSafeMethod(method);
        }
        up.on('up:click', config.selectorFn('followSelectors'), function (event, link) {
            if (shouldFollowEvent(event, link)) {
                up.event.halt(event, { log: true });
                up.focus(link, { preventScroll: true });
                up.error.muteUncriticalRejection(follow(link));
            }
        });
        up.macro('[up-expand]', function (area) {
            const selector = area.getAttribute('up-expand') || 'a, [up-href]';
            let childLink = e.get(area, selector);
            if (childLink) {
                const areaAttrs = e.upAttrs(childLink);
                areaAttrs['up-href'] ||= childLink.getAttribute('href');
                e.setMissingAttrs(area, areaAttrs);
                const areaClasses = e.upClasses(childLink);
                area.classList.add(...areaClasses);
                makeFollowable(area);
            }
        });
        up.compiler(config.selectorFn('preloadSelectors'), function (link) {
            if (!isPreloadDisabled(link)) {
                linkPreloader.watchLink(link);
            }
        });
        up.on('up:framework:reset', reset);
        return {
            follow,
            followOptions,
            preload,
            makeFollowable,
            makeClickable,
            isSafe,
            isFollowable,
            shouldFollowEvent,
            followMethod,
            convertClicks,
            config,
            combineFollowableSelectors,
            preloadIssue,
        };
    })();
    up.follow = up.link.follow;
    
    
    /***/ }),
    /* 96 */
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    // extracted by mini-css-extract-plugin
    
    
    /***/ }),
    /* 97 */
    /***/ (() => {
    
    up.form = (function () {
        const u = up.util;
        const e = up.element;
        const ATTRIBUTES_SUGGESTING_SUBMIT = ['[up-submit]', '[up-target]', '[up-layer]', '[up-transition]'];
        const config = new up.Config(() => ({
            groupSelectors: ['[up-form-group]', 'fieldset', 'label', 'form'],
            fieldSelectors: ['select', 'input:not([type=submit]):not([type=image])', 'button[type]:not([type=submit])', 'textarea'],
            submitSelectors: up.link.combineFollowableSelectors(['form'], ATTRIBUTES_SUGGESTING_SUBMIT),
            noSubmitSelectors: ['[up-submit=false]', '[target]', e.crossOriginSelector('action')],
            submitButtonSelectors: ['input[type=submit]', 'input[type=image]', 'button[type=submit]', 'button:not([type])'],
            watchInputEvents: ['input', 'change'],
            watchInputDelay: 0,
            watchChangeEvents: ['change'],
        }));
        function fieldSelector(suffix = '') {
            return config.fieldSelectors.map(field => field + suffix).join();
        }
        function isField(element) {
            return element.matches(fieldSelector());
        }
        function findFields(root) {
            root = e.get(root);
            let fields = e.subtree(root, fieldSelector());
            if (root.matches('form[id]')) {
                const outsideFieldSelector = fieldSelector(e.attrSelector('form', root.getAttribute('id')));
                const outsideFields = up.fragment.all(outsideFieldSelector, { layer: root });
                fields.push(...outsideFields);
                fields = u.uniq(fields);
            }
            return fields;
        }
        function findSubmitButtons(root) {
            return e.subtree(root, submitButtonSelector());
        }
        function submittingButton(form) {
            const selector = submitButtonSelector();
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.form === form) {
                if (focusedElement.matches(selector)) {
                    return focusedElement;
                }
            }
            return e.get(form, selector);
        }
        function submitButtonSelector() {
            return config.selector('submitButtonSelectors');
        }
        const submit = up.mockable((form, options) => {
            return up.render(submitOptions(form, options));
        });
        function submitOptions(form, options, parserOptions) {
            form = getForm(form);
            options = u.options(options);
            let parser = new up.OptionsParser(form, options, parserOptions);
            parser.include(destinationOptions);
            parser.string('failTarget', { default: up.fragment.tryToTarget(form) });
            parser.booleanOrString('disable');
            options.guardEvent ||= up.event.build('up:form:submit', {
                submitButton: options.submitButton,
                log: 'Submitting form',
                params: options.params
            });
            options.origin ||= up.viewport.focusedElementWithin(form) || options.submitButton || form;
            parser.include(up.link.followOptions);
            return options;
        }
        function watchOptions(field, options, parserOptions = {}) {
            options = u.options(options);
            let parser = new up.OptionsParser(field, options, { ...parserOptions, closest: true, attrPrefix: 'up-watch-' });
            parser.boolean('feedback');
            parser.booleanOrString('disable');
            parser.string('event');
            parser.number('delay');
            let config = up.form.config;
            if (options.event === 'input') {
                options.event = u.evalOption(config.watchInputEvents, field);
                options.delay ??= config.watchInputDelay;
            }
            else if (options.event === 'change') {
                options.event = u.evalOption(config.watchChangeEvents, field);
            }
            options.origin ||= field;
            return options;
        }
        function disableContainer(container) {
            let focusedElement = document.activeElement;
            let focusFallback;
            let controls = [...findFields(container), ...findSubmitButtons(container)];
            for (let control of controls) {
                if (control === focusedElement) {
                    focusFallback = findGroup(focusedElement);
                }
                raiseDisableStack(control);
            }
            if (focusFallback) {
                up.focus(focusFallback, { force: true, preventScroll: true });
            }
            return function () {
                controls.forEach(lowerDisableStack);
            };
        }
        function raiseDisableStack(control) {
            if (!control.upDisableCount) {
                control.upDisableCount ||= 0;
                control.upOriginalDisabled = control.disabled;
            }
            control.upDisableCount++;
            control.disabled = true;
        }
        function lowerDisableStack(control) {
            if (control.upDisableCount) {
                if (!control.disabled) {
                    control.upDisableCount = 0;
                }
                else {
                    control.upDisableCount--;
                    if (!control.upDisableCount) {
                        control.disabled = control.upOriginalDisabled;
                    }
                }
            }
        }
        function disableWhile(promise, options) {
            let undoDisable = handleDisableOption(options);
            u.always(promise, undoDisable);
        }
        function handleDisableOption({ disable, origin }) {
            if (!disable)
                return u.noop;
            let missingOption = (key) => { up.fail("Cannot process { disable: '%s' } option without { %s }", disable, key); };
            let getOrigin = () => origin || missingOption('origin');
            let getOriginForm = () => getScope(getOrigin());
            let containers;
            if (disable === true) {
                containers = [getOriginForm()];
            }
            else if (u.isString(disable)) {
                containers = up.fragment.subtree(getOriginForm(), disable, { origin });
            }
            return u.sequence(containers.map(disableContainer));
        }
        function destinationOptions(form, options, parserOptions) {
            options = u.options(options);
            form = getForm(form);
            const parser = new up.OptionsParser(form, options, parserOptions);
            parser.string('contentType', { attr: 'enctype' });
            parser.json('headers');
            const params = up.Params.fromForm(form);
            const submitButton = submittingButton(form);
            if (submitButton) {
                options.submitButton = submitButton;
                params.addField(submitButton);
                options.method ||= submitButton.getAttribute('formmethod');
                options.url ||= submitButton.getAttribute('formaction');
            }
            params.addAll(options.params);
            options.params = params;
            parser.string('url', { attr: 'action', default: up.fragment.source(form) });
            parser.string('method', {
                attr: ['up-method', 'data-method', 'method'],
                default: 'GET',
                normalize: u.normalizeMethod
            });
            if (options.method === 'GET') {
                options.url = up.Params.stripURL(options.url);
            }
            return options;
        }
        up.on('up:click', submitButtonSelector, function (event, button) {
            const form = getForm(button);
            if (form && isSubmittable(form)) {
                button.focus();
            }
        });
        function watch(root, ...args) {
            root = up.element.get(root);
            const callback = u.extractCallback(args) || watchCallbackFromElement(root) || up.fail('No callback given for up.watch()');
            let options = u.extractOptions(args);
            const watcher = new up.FieldWatcher(root, options, callback);
            watcher.start();
            return () => watcher.stop();
        }
        function watchCallbackFromElement(element) {
            let rawCallback = element.getAttribute('up-watch');
            if (rawCallback) {
                return up.NonceableCallback.fromString(rawCallback).toFunction('value', 'name').bind(element);
            }
        }
        function autosubmit(target, options = {}) {
            const onChange = (_diff, renderOptions) => submit(target, renderOptions);
            return watch(target, { options, batch: true }, onChange);
        }
        function getGroupSelectors() {
            return up.migrate.migratedFormGroupSelectors?.() || config.groupSelectors;
        }
        function findGroup(field) {
            return findGroupSolution(field).element;
        }
        function findGroupSolution(field) {
            return u.findResult(getGroupSelectors(), function (groupSelector) {
                let group = field.closest(groupSelector);
                if (group) {
                    let goodDerivedGroupTarget = up.fragment.tryToTarget(group);
                    let goodDerivedFieldTarget = up.fragment.tryToTarget(field);
                    let groupHasFieldTarget = goodDerivedFieldTarget && (group !== field) && `${groupSelector}:has(${goodDerivedFieldTarget})`;
                    let target = goodDerivedGroupTarget || groupHasFieldTarget;
                    if (target) {
                        return {
                            target,
                            element: group,
                            origin: field
                        };
                    }
                }
            });
        }
        function validate(...args) {
            let options = parseValidateArgs(...args);
            let validator = up.FormValidator.forElement(options.origin);
            return validator.validate(options);
        }
        function parseValidateArgs(originOrTarget, ...args) {
            const options = u.extractOptions(args);
            if (options.origin) {
                options.target ||= up.fragment.toTarget(originOrTarget);
            }
            else {
                options.origin ||= up.fragment.get(originOrTarget);
            }
            return options;
        }
        function switcherValues(field) {
            let value;
            let meta;
            if (field.matches('input[type=checkbox]')) {
                if (field.checked) {
                    value = field.value;
                    meta = ':checked';
                }
                else {
                    meta = ':unchecked';
                }
            }
            else if (field.matches('input[type=radio]')) {
                const form = getScope(field);
                const groupName = field.getAttribute('name');
                const checkedButton = form.querySelector(`input[type=radio]${e.attrSelector('name', groupName)}:checked`);
                if (checkedButton) {
                    meta = ':checked';
                    value = checkedButton.value;
                }
                else {
                    meta = ':unchecked';
                }
            }
            else {
                value = field.value;
            }
            const values = [];
            if (u.isPresent(value)) {
                values.push(value);
                values.push(':present');
            }
            else {
                values.push(':blank');
            }
            if (u.isPresent(meta)) {
                values.push(meta);
            }
            return values;
        }
        function switchTargets(switcher, options = {}) {
            const targetSelector = options.target || options.target || switcher.getAttribute('up-switch');
            const form = getScope(switcher);
            targetSelector || up.fail("No switch target given for %o", switcher);
            const fieldValues = switcherValues(switcher);
            for (let target of up.fragment.all(form, targetSelector)) {
                switchTarget(target, fieldValues);
            }
        }
        const switchTarget = up.mockable(function (target, fieldValues) {
            let show;
            fieldValues ||= switcherValues(findSwitcherForTarget(target));
            let hideValues = target.getAttribute('up-hide-for');
            if (hideValues) {
                hideValues = parseSwitchTokens(hideValues);
                show = u.intersect(fieldValues, hideValues).length === 0;
            }
            else {
                let showValues = target.getAttribute('up-show-for');
                showValues = showValues ? parseSwitchTokens(showValues) : [':present', ':checked'];
                show = u.intersect(fieldValues, showValues).length > 0;
            }
            e.toggle(target, show);
            target.classList.add('up-switched');
        });
        function parseSwitchTokens(str) {
            return u.parseTokens(str, { json: true });
        }
        function findSwitcherForTarget(target) {
            const form = getScope(target);
            const switchers = form.querySelectorAll('[up-switch]');
            const switcher = u.find(switchers, function (switcher) {
                const targetSelector = switcher.getAttribute('up-switch');
                return target.matches(targetSelector);
            });
            return switcher || up.fail('Could not find [up-switch] field for %o', target);
        }
        function getForm(elementOrSelector, options = {}) {
            const element = up.fragment.get(elementOrSelector, options);
            return element.form || element.closest('form');
        }
        function getScope(element, options) {
            return getForm(element, options) || up.layer.get(element).element;
        }
        function focusedField() {
            return u.presence(document.activeElement, isField);
        }
        function isSubmittable(form) {
            form = up.fragment.get(form);
            return config.matches(form, 'submitSelectors');
        }
        up.on('submit', config.selectorFn('submitSelectors'), function (event, form) {
            if (event.defaultPrevented)
                return;
            up.event.halt(event, { log: true });
            up.error.muteUncriticalRejection(submit(form));
        });
        up.compiler(validatingFieldSelector, function (fieldOrForm) {
            let validator = up.FormValidator.forElement(fieldOrForm);
            validator.watchContainer(fieldOrForm);
        });
        function validatingFieldSelector() {
            return config.fieldSelectors.map((selector) => `${selector}[up-validate], [up-validate] ${selector}`).join(', ');
        }
        up.compiler('[up-switch]', (switcher) => {
            switchTargets(switcher);
        });
        up.on('change', '[up-switch]', (_event, switcher) => {
            switchTargets(switcher);
        });
        up.compiler('[up-show-for]:not(.up-switched), [up-hide-for]:not(.up-switched)', (element) => {
            switchTarget(element);
        });
        up.compiler('[up-watch]', (formOrField) => watch(formOrField));
        up.compiler('[up-autosubmit]', (formOrField) => autosubmit(formOrField));
        return {
            config,
            submit,
            submitOptions,
            destinationOptions,
            watchOptions,
            isSubmittable,
            watch,
            validate,
            autosubmit,
            fieldSelector,
            fields: findFields,
            isField,
            submitButtons: findSubmitButtons,
            focusedField,
            switchTarget,
            disableWhile,
            disable: disableContainer,
            group: findGroup,
            groupSolution: findGroupSolution,
            groupSelectors: getGroupSelectors,
            get: getForm,
            getScope,
        };
    })();
    up.submit = up.form.submit;
    up.watch = up.form.watch;
    up.autosubmit = up.form.autosubmit;
    up.validate = up.form.validate;
    
    
    /***/ }),
    /* 98 */
    /***/ (() => {
    
    up.feedback = (function () {
        const u = up.util;
        const e = up.element;
        const config = new up.Config(() => ({
            currentClasses: ['up-current'],
            navSelectors: ['[up-nav]', 'nav'],
        }));
        function reset() {
            up.layer.root.feedbackLocation = null;
        }
        const CLASS_ACTIVE = 'up-active';
        const CLASS_LOADING = 'up-loading';
        const SELECTOR_LINK = 'a, [up-href]';
        function navSelector() {
            return config.selector('navSelectors');
        }
        function normalizeURL(url) {
            if (url) {
                return u.normalizeURL(url, { trailingSlash: false, hash: false });
            }
        }
        function linkURLs(link) {
            return link.upFeedbackURLs ||= new up.LinkFeedbackURLs(link);
        }
        function updateFragment(fragment) {
            const layerOption = { layer: up.layer.get(fragment) };
            if (up.fragment.closest(fragment, navSelector(), layerOption)) {
                const links = up.fragment.subtree(fragment, SELECTOR_LINK, layerOption);
                updateLinks(links, layerOption);
            }
            else {
                updateLinksWithinNavs(fragment, layerOption);
            }
        }
        function updateLinksWithinNavs(fragment, options) {
            const navs = up.fragment.subtree(fragment, navSelector(), options);
            const links = u.flatMap(navs, nav => e.subtree(nav, SELECTOR_LINK));
            updateLinks(links, options);
        }
        function getNormalizedLayerLocation(layer) {
            return layer.feedbackLocation || normalizeURL(layer.location);
        }
        function updateLinks(links, options = {}) {
            if (!links.length) {
                return;
            }
            const layer = options.layer || up.layer.get(links[0]);
            let layerLocation = getNormalizedLayerLocation(layer);
            if (layerLocation) {
                for (let link of links) {
                    const isCurrent = linkURLs(link).isCurrent(layerLocation);
                    for (let currentClass of config.currentClasses) {
                        link.classList.toggle(currentClass, isCurrent);
                    }
                    e.toggleAttr(link, 'aria-current', 'page', isCurrent);
                }
            }
        }
        function findActivatableArea(element) {
            return e.ancestor(element, SELECTOR_LINK) || element;
        }
        function showAroundRequest(request, options) {
            if (!options.feedback) {
                return;
            }
            let clean = (fn) => u.always(request, fn);
            let activeElement = getActiveElementFromRenderOptions(request);
            if (activeElement) {
                clean(e.addTemporaryClass(activeElement, CLASS_ACTIVE));
            }
            for (let fragment of request.fragments) {
                clean(e.addTemporaryClass(fragment, CLASS_LOADING));
            }
        }
        function getActiveElementFromRenderOptions(request) {
            let activeElement = request.origin;
            if (activeElement) {
                return findActivatableArea(activeElement);
            }
        }
        function updateLayerIfLocationChanged(layer) {
            const processedLocation = layer.feedbackLocation;
            const layerLocation = getNormalizedLayerLocation(layer.location);
            if (!processedLocation || (processedLocation !== layerLocation)) {
                layer.feedbackLocation = layerLocation;
                updateLinksWithinNavs(layer.element, { layer });
            }
        }
        function onBrowserLocationChanged() {
            const frontLayer = up.layer.front;
            if (frontLayer.showsLiveHistory()) {
                updateLayerIfLocationChanged(frontLayer);
            }
        }
        up.on('up:location:changed', (_event) => {
            onBrowserLocationChanged();
        });
        up.on('up:fragment:compile', (_event, newFragment) => {
            updateFragment(newFragment);
        });
        up.on('up:layer:location:changed', (event) => {
            updateLayerIfLocationChanged(event.layer);
        });
        up.on('up:framework:reset', reset);
        return {
            config,
            showAroundRequest,
            normalizeURL,
        };
    })();
    
    
    /***/ }),
    /* 99 */
    /***/ (() => {
    
    up.radio = (function () {
        const e = up.element;
        const config = new up.Config(() => ({
            hungrySelectors: ['[up-hungry]'],
            pollInterval: 30000,
        }));
        function hungrySteps(renderOptions) {
            let { useHungry, origin, layer: renderLayer } = renderOptions;
            let steps = { current: [], other: [] };
            if (!useHungry)
                return steps;
            let hungrySelector = config.selector('hungrySelectors');
            const layerPreference = [renderLayer, ...renderLayer.ancestors, ...renderLayer.descendants];
            for (let elementLayer of layerPreference) {
                let hungries = up.fragment.all(elementLayer.element, hungrySelector, { layer: elementLayer });
                for (let element of hungries) {
                    let selector = up.fragment.tryToTarget(element, { origin });
                    if (!selector) {
                        up.warn('[up-hungry]', 'Ignoring untargetable fragment %o', element);
                        continue;
                    }
                    let ifLayer = e.attr(element, 'up-if-layer');
                    let applicableLayers = ifLayer ? up.layer.getAll(ifLayer, { baseLayer: elementLayer }) : [elementLayer];
                    let motionOptions = up.motion.motionOptions(element);
                    let selectEvent = up.event.build('up:fragment:hungry', { log: false });
                    let selectCallback = e.callbackAttr(element, 'up-on-hungry', { exposedKeys: ['newFragment', 'renderOptions'] });
                    let step = {
                        selector,
                        oldElement: element,
                        layer: elementLayer,
                        origin,
                        ...motionOptions,
                        placement: 'swap',
                        useKeep: true,
                        maybe: true,
                        selectEvent,
                        selectCallback,
                        originalRenderOptions: renderOptions,
                    };
                    if (applicableLayers.includes(renderLayer)) {
                        let list = renderLayer === elementLayer ? steps.current : steps.other;
                        list.push(step);
                    }
                }
            }
            steps.other = up.fragment.compressNestedSteps(steps.other);
            return steps;
        }
        function startPolling(fragment, options = {}) {
            up.FragmentPolling.forFragment(fragment).forceStart(options);
        }
        function stopPolling(element) {
            up.FragmentPolling.forFragment(element).forceStop();
        }
        function pollOptions(fragment, options = {}) {
            const parser = new up.OptionsParser(fragment, options);
            parser.number('interval', { default: config.pollInterval });
            parser.string('ifLayer', { default: 'front' });
            return options;
        }
        up.compiler('[up-poll]:not([up-poll=false])', function (fragment) {
            up.FragmentPolling.forFragment(fragment).onPollAttributeObserved();
        });
        up.macro('[up-flashes]', function (fragment) {
            e.setMissingAttrs(fragment, {
                'up-hungry': '',
                'up-if-layer': 'subtree',
                'up-keep': '',
                'role': 'alert',
            });
            fragment.addEventListener('up:fragment:keep', function (event) {
                if (!e.isEmpty(event.newFragment))
                    event.preventDefault();
            });
        });
        return {
            config,
            hungrySteps,
            startPolling,
            stopPolling,
            pollOptions,
        };
    })();
    
    
    /***/ }),
    /* 100 */
    /***/ (() => {
    
    (function () {
        const e = up.element;
        function isRails() {
            return window.Rails ||
                window.jQuery?.rails;
        }
        for (let feature of ['method', 'confirm']) {
            const upAttribute = `up-${feature}`;
            const dataAttribute = `data-${feature}`;
            up.macro(`a[${dataAttribute}]`, function (link) {
                if (isRails() && up.link.isFollowable(link)) {
                    e.setMissingAttr(link, upAttribute, link.getAttribute(dataAttribute));
                    link.removeAttribute(dataAttribute);
                }
            });
        }
    })();
    
    
    /***/ })
    /******/ 	]);
    /************************************************************************/
    /******/ 	// The module cache
    /******/ 	var __webpack_module_cache__ = {};
    /******/ 	
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/ 		// Check if module is in cache
    /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 		if (cachedModule !== undefined) {
    /******/ 			return cachedModule.exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = __webpack_module_cache__[moduleId] = {
    /******/ 			// no module.id needed
    /******/ 			// no module.loaded needed
    /******/ 			exports: {}
    /******/ 		};
    /******/ 	
    /******/ 		// Execute the module function
    /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/ 	
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/ 	
    /************************************************************************/
    /******/ 	/* webpack/runtime/make namespace object */
    /******/ 	(() => {
    /******/ 		// define __esModule on exports
    /******/ 		__webpack_require__.r = (exports) => {
    /******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    /******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    /******/ 			}
    /******/ 			Object.defineProperty(exports, '__esModule', { value: true });
    /******/ 		};
    /******/ 	})();
    /******/ 	
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    (() => {
    __webpack_require__(1);
    __webpack_require__(2);
    __webpack_require__(3);
    __webpack_require__(4);
    __webpack_require__(5);
    __webpack_require__(6);
    __webpack_require__(7);
    __webpack_require__(9);
    __webpack_require__(10);
    __webpack_require__(11);
    __webpack_require__(12);
    __webpack_require__(13);
    __webpack_require__(14);
    __webpack_require__(15);
    __webpack_require__(16);
    __webpack_require__(17);
    __webpack_require__(18);
    __webpack_require__(19);
    __webpack_require__(20);
    __webpack_require__(21);
    __webpack_require__(22);
    __webpack_require__(23);
    __webpack_require__(24);
    __webpack_require__(25);
    __webpack_require__(26);
    __webpack_require__(27);
    __webpack_require__(28);
    __webpack_require__(29);
    __webpack_require__(30);
    __webpack_require__(31);
    __webpack_require__(32);
    __webpack_require__(33);
    __webpack_require__(34);
    __webpack_require__(35);
    __webpack_require__(36);
    __webpack_require__(37);
    __webpack_require__(38);
    __webpack_require__(39);
    __webpack_require__(40);
    __webpack_require__(41);
    __webpack_require__(42);
    __webpack_require__(43);
    __webpack_require__(44);
    __webpack_require__(45);
    __webpack_require__(46);
    __webpack_require__(47);
    __webpack_require__(48);
    __webpack_require__(49);
    __webpack_require__(50);
    __webpack_require__(51);
    __webpack_require__(52);
    __webpack_require__(53);
    __webpack_require__(54);
    __webpack_require__(55);
    __webpack_require__(56);
    __webpack_require__(57);
    __webpack_require__(58);
    __webpack_require__(59);
    __webpack_require__(60);
    __webpack_require__(61);
    __webpack_require__(62);
    __webpack_require__(63);
    __webpack_require__(64);
    __webpack_require__(65);
    __webpack_require__(66);
    __webpack_require__(67);
    __webpack_require__(68);
    __webpack_require__(69);
    __webpack_require__(70);
    __webpack_require__(71);
    __webpack_require__(72);
    __webpack_require__(73);
    __webpack_require__(74);
    __webpack_require__(75);
    __webpack_require__(76);
    __webpack_require__(77);
    __webpack_require__(78);
    __webpack_require__(79);
    __webpack_require__(80);
    __webpack_require__(81);
    __webpack_require__(82);
    __webpack_require__(83);
    __webpack_require__(84);
    __webpack_require__(85);
    __webpack_require__(86);
    __webpack_require__(88);
    __webpack_require__(90);
    __webpack_require__(91);
    __webpack_require__(93);
    __webpack_require__(95);
    __webpack_require__(97);
    __webpack_require__(98);
    __webpack_require__(99);
    __webpack_require__(100);
    up.framework.onEvaled();
    
    })();
    
    /******/ })()
    ;