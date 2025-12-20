"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/space-separated-tokens";
exports.ids = ["vendor-chunks/space-separated-tokens"];
exports.modules = {

/***/ "(ssr)/./node_modules/space-separated-tokens/index.js":
/*!******************************************************!*\
  !*** ./node_modules/space-separated-tokens/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   parse: () => (/* binding */ parse),\n/* harmony export */   stringify: () => (/* binding */ stringify)\n/* harmony export */ });\n/**\n * Parse space-separated tokens to an array of strings.\n *\n * @param {string} value\n *   Space-separated tokens.\n * @returns {Array<string>}\n *   List of tokens.\n */\nfunction parse(value) {\n  const input = String(value || '').trim()\n  return input ? input.split(/[ \\t\\n\\r\\f]+/g) : []\n}\n\n/**\n * Serialize an array of strings as space separated-tokens.\n *\n * @param {Array<string|number>} values\n *   List of tokens.\n * @returns {string}\n *   Space-separated tokens.\n */\nfunction stringify(values) {\n  return values.join(' ').trim()\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvc3BhY2Utc2VwYXJhdGVkLXRva2Vucy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxzQkFBc0I7QUFDakM7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPO0FBQ1A7QUFDQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxhZG1pblxcRGVza3RvcFxcS2ltUHJvamVjdFxc5YWs5LyX5Y+35YaZ5L2c5Yqp5omLXFx3ZWItYXBwXFxmcm9udGVuZFxcbm9kZV9tb2R1bGVzXFxzcGFjZS1zZXBhcmF0ZWQtdG9rZW5zXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBhcnNlIHNwYWNlLXNlcGFyYXRlZCB0b2tlbnMgdG8gYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqICAgU3BhY2Utc2VwYXJhdGVkIHRva2Vucy5cbiAqIEByZXR1cm5zIHtBcnJheTxzdHJpbmc+fVxuICogICBMaXN0IG9mIHRva2Vucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKHZhbHVlKSB7XG4gIGNvbnN0IGlucHV0ID0gU3RyaW5nKHZhbHVlIHx8ICcnKS50cmltKClcbiAgcmV0dXJuIGlucHV0ID8gaW5wdXQuc3BsaXQoL1sgXFx0XFxuXFxyXFxmXSsvZykgOiBbXVxufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBhbiBhcnJheSBvZiBzdHJpbmdzIGFzIHNwYWNlIHNlcGFyYXRlZC10b2tlbnMuXG4gKlxuICogQHBhcmFtIHtBcnJheTxzdHJpbmd8bnVtYmVyPn0gdmFsdWVzXG4gKiAgIExpc3Qgb2YgdG9rZW5zLlxuICogQHJldHVybnMge3N0cmluZ31cbiAqICAgU3BhY2Utc2VwYXJhdGVkIHRva2Vucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeSh2YWx1ZXMpIHtcbiAgcmV0dXJuIHZhbHVlcy5qb2luKCcgJykudHJpbSgpXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/space-separated-tokens/index.js\n");

/***/ })

};
;