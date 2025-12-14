import { isIdentifierStart, isIdentifierChar } from "./identifier.js"
import { types as tt, keywords as keywordTypes } from "./tokentype.js"
import { Parser } from "./state.js"
import { SourceLocation } from "./locutil.js"
import { RegExpValidationState } from "./regexp.js"
import { lineBreak, nextLineBreak, isNewLine, nonASCIIwhitespace } from "./whitespace.js"
import { codePointToString } from "./util.js"

// Object type used to represent tokens. Note that normally, tokens
// simply exist as properties on the parser object. This is only
// used for the onToken callback and the external tokenizer.

export class Token {
}

// ## Tokenizer

const pp = Parser.prototype

// Move to the next token

pp.next = function (ignoreEscapeSequenceInKeyword) {
}

pp.getToken = function () {
    this.next()
    return new Token(this)
}

// If we're in an ES6 environment, make parsers iterable
if (typeof Symbol !== "undefined")
    pp[Symbol.iterator] = function () {
        return {
            next: () => {
            }
        }
    }

// Toggle strict mode. Re-reads the next number or string to please
// pedantic tests (`"use strict"; 010;` should fail).

// Read a single token, updating the parser object's token-related
// properties.

pp.nextToken = function () {
}

pp.readToken = function (code) {
}

pp.fullCharCodeAt = function (pos) {
}

pp.fullCharCodeAtPos = function () {
    return this.fullCharCodeAt(this.pos)
}

pp.skipBlockComment = function () {
}

pp.skipLineComment = function (startSkip) {
}

// Called at the start of the parse and after every token. Skips
// whitespace and comments, and.

pp.skipSpace = function () {
}

// Called at the end of every token. Sets `end`, `val`, and
// maintains `context` and `exprAllowed`, and skips the space after
// the token, so that the next one's `start` will point at the
// right position.

pp.finishToken = function (type, val) {
}

// ### Token reading

// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.
//
pp.readToken_dot = function () {
}

pp.readToken_slash = function () { // '/'
}

pp.readToken_mult_modulo_exp = function (code) { // '%*'
}

pp.readToken_pipe_amp = function (code) { // '|&'
}

pp.readToken_caret = function () { // '^'
}

pp.readToken_plus_min = function (code) { // '+-'
}

pp.readToken_lt_gt = function (code) { // '<>'
}

pp.readToken_eq_excl = function (code) { // '=!'
}

pp.readToken_question = function () { // '?'
}

pp.readToken_numberSign = function () { // '#'
}

pp.getTokenFromCode = function (code) {
}

pp.finishOp = function (type, size) {
}

pp.readRegexp = function () {
}

// Read an integer in the given radix. Return null if zero digits
// were read, the integer value otherwise. When `len` is given, this
// will return `null` unless the integer has exactly `len` digits.

pp.readInt = function (radix, len, maybeLegacyOctalNumericLiteral) {
}

function stringToNumber(str, isLegacyOctalNumericLiteral) {
}

function stringToBigInt(str) {
}

pp.readRadixNumber = function (radix) {
}

// Read an integer, octal integer, or floating-point number.

pp.readNumber = function (startsWithDot) {
}

// Read a string value, interpreting backslash-escapes.

pp.readCodePoint = function () {
}

pp.readString = function (quote) {
}

// Reads template string tokens.

const INVALID_TEMPLATE_ESCAPE_ERROR = {}

pp.tryReadTemplateToken = function () {
}

pp.invalidStringToken = function (position, message) {
}

pp.readTmplToken = function () {
}

// Reads a template token to search for the end, without validating any escape sequences
pp.readInvalidTemplateToken = function () {
}

// Used to read escaped characters

pp.readEscapedChar = function (inTemplate) {
}

// Used to read character escape sequences ('\x', '\u', '\U').

pp.readHexChar = function (len) {
}

// Read an identifier, and return it as a string. Sets `this.containsEsc`
// to whether the word contained a '\u' escape.
//
// Incrementally adds only escaped chars, adding other chunks as-is
// as a micro-optimization.

pp.readWord1 = function () {
}

// Read an identifier or keyword token. Will check for reserved
// words when necessary.

pp.readWord = function () {
}