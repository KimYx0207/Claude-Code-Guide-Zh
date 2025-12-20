"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/decode-named-character-reference";
exports.ids = ["vendor-chunks/decode-named-character-reference"];
exports.modules = {

/***/ "(ssr)/./node_modules/decode-named-character-reference/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/decode-named-character-reference/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   decodeNamedCharacterReference: () => (/* binding */ decodeNamedCharacterReference)\n/* harmony export */ });\n/* harmony import */ var character_entities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! character-entities */ \"(ssr)/./node_modules/character-entities/index.js\");\n\n\n// To do: next major: use `Object.hasOwn`.\nconst own = {}.hasOwnProperty\n\n/**\n * Decode a single character reference (without the `&` or `;`).\n * You probably only need this when you’re building parsers yourself that follow\n * different rules compared to HTML.\n * This is optimized to be tiny in browsers.\n *\n * @param {string} value\n *   `notin` (named), `#123` (deci), `#x123` (hexa).\n * @returns {string|false}\n *   Decoded reference.\n */\nfunction decodeNamedCharacterReference(value) {\n  return own.call(character_entities__WEBPACK_IMPORTED_MODULE_0__.characterEntities, value) ? character_entities__WEBPACK_IMPORTED_MODULE_0__.characterEntities[value] : false\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZGVjb2RlLW5hbWVkLWNoYXJhY3Rlci1yZWZlcmVuY2UvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBb0Q7O0FBRXBEO0FBQ0EsY0FBYzs7QUFFZDtBQUNBLDZEQUE2RDtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUCxrQkFBa0IsaUVBQWlCLFdBQVcsaUVBQWlCO0FBQy9EIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFkbWluXFxEZXNrdG9wXFxLaW1Qcm9qZWN0XFzlhazkvJflj7flhpnkvZzliqnmiYtcXHdlYi1hcHBcXGZyb250ZW5kXFxub2RlX21vZHVsZXNcXGRlY29kZS1uYW1lZC1jaGFyYWN0ZXItcmVmZXJlbmNlXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NoYXJhY3RlckVudGl0aWVzfSBmcm9tICdjaGFyYWN0ZXItZW50aXRpZXMnXG5cbi8vIFRvIGRvOiBuZXh0IG1ham9yOiB1c2UgYE9iamVjdC5oYXNPd25gLlxuY29uc3Qgb3duID0ge30uaGFzT3duUHJvcGVydHlcblxuLyoqXG4gKiBEZWNvZGUgYSBzaW5nbGUgY2hhcmFjdGVyIHJlZmVyZW5jZSAod2l0aG91dCB0aGUgYCZgIG9yIGA7YCkuXG4gKiBZb3UgcHJvYmFibHkgb25seSBuZWVkIHRoaXMgd2hlbiB5b3XigJlyZSBidWlsZGluZyBwYXJzZXJzIHlvdXJzZWxmIHRoYXQgZm9sbG93XG4gKiBkaWZmZXJlbnQgcnVsZXMgY29tcGFyZWQgdG8gSFRNTC5cbiAqIFRoaXMgaXMgb3B0aW1pemVkIHRvIGJlIHRpbnkgaW4gYnJvd3NlcnMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiAgIGBub3RpbmAgKG5hbWVkKSwgYCMxMjNgIChkZWNpKSwgYCN4MTIzYCAoaGV4YSkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfGZhbHNlfVxuICogICBEZWNvZGVkIHJlZmVyZW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZU5hbWVkQ2hhcmFjdGVyUmVmZXJlbmNlKHZhbHVlKSB7XG4gIHJldHVybiBvd24uY2FsbChjaGFyYWN0ZXJFbnRpdGllcywgdmFsdWUpID8gY2hhcmFjdGVyRW50aXRpZXNbdmFsdWVdIDogZmFsc2Vcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/decode-named-character-reference/index.js\n");

/***/ })

};
;