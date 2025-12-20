"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/longest-streak";
exports.ids = ["vendor-chunks/longest-streak"];
exports.modules = {

/***/ "(ssr)/./node_modules/longest-streak/index.js":
/*!**********************************************!*\
  !*** ./node_modules/longest-streak/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   longestStreak: () => (/* binding */ longestStreak)\n/* harmony export */ });\n/**\n * Get the count of the longest repeating streak of `substring` in `value`.\n *\n * @param {string} value\n *   Content to search in.\n * @param {string} substring\n *   Substring to look for, typically one character.\n * @returns {number}\n *   Count of most frequent adjacent `substring`s in `value`.\n */\nfunction longestStreak(value, substring) {\n  const source = String(value)\n  let index = source.indexOf(substring)\n  let expected = index\n  let count = 0\n  let max = 0\n\n  if (typeof substring !== 'string') {\n    throw new TypeError('Expected substring')\n  }\n\n  while (index !== -1) {\n    if (index === expected) {\n      if (++count > max) {\n        max = count\n      }\n    } else {\n      count = 1\n    }\n\n    expected = index + substring.length\n    index = source.indexOf(substring, expected)\n  }\n\n  return max\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbG9uZ2VzdC1zdHJlYWsvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYWRtaW5cXERlc2t0b3BcXEtpbVByb2plY3RcXOWFrOS8l+WPt+WGmeS9nOWKqeaJi1xcd2ViLWFwcFxcZnJvbnRlbmRcXG5vZGVfbW9kdWxlc1xcbG9uZ2VzdC1zdHJlYWtcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogR2V0IHRoZSBjb3VudCBvZiB0aGUgbG9uZ2VzdCByZXBlYXRpbmcgc3RyZWFrIG9mIGBzdWJzdHJpbmdgIGluIGB2YWx1ZWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiAgIENvbnRlbnQgdG8gc2VhcmNoIGluLlxuICogQHBhcmFtIHtzdHJpbmd9IHN1YnN0cmluZ1xuICogICBTdWJzdHJpbmcgdG8gbG9vayBmb3IsIHR5cGljYWxseSBvbmUgY2hhcmFjdGVyLlxuICogQHJldHVybnMge251bWJlcn1cbiAqICAgQ291bnQgb2YgbW9zdCBmcmVxdWVudCBhZGphY2VudCBgc3Vic3RyaW5nYHMgaW4gYHZhbHVlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvbmdlc3RTdHJlYWsodmFsdWUsIHN1YnN0cmluZykge1xuICBjb25zdCBzb3VyY2UgPSBTdHJpbmcodmFsdWUpXG4gIGxldCBpbmRleCA9IHNvdXJjZS5pbmRleE9mKHN1YnN0cmluZylcbiAgbGV0IGV4cGVjdGVkID0gaW5kZXhcbiAgbGV0IGNvdW50ID0gMFxuICBsZXQgbWF4ID0gMFxuXG4gIGlmICh0eXBlb2Ygc3Vic3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHN1YnN0cmluZycpXG4gIH1cblxuICB3aGlsZSAoaW5kZXggIT09IC0xKSB7XG4gICAgaWYgKGluZGV4ID09PSBleHBlY3RlZCkge1xuICAgICAgaWYgKCsrY291bnQgPiBtYXgpIHtcbiAgICAgICAgbWF4ID0gY291bnRcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAxXG4gICAgfVxuXG4gICAgZXhwZWN0ZWQgPSBpbmRleCArIHN1YnN0cmluZy5sZW5ndGhcbiAgICBpbmRleCA9IHNvdXJjZS5pbmRleE9mKHN1YnN0cmluZywgZXhwZWN0ZWQpXG4gIH1cblxuICByZXR1cm4gbWF4XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/longest-streak/index.js\n");

/***/ })

};
;