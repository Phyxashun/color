# Colors

There are several different ways to specify a color in CSS, which are described in the following sections.

## Named Notation

Colors can be set by simply typing the common name of that color.

```css
color: red;             /* color paragraphs red */
```

The HTML and CSS color specification includes 140 predefined color names, such as white, lime, and olive. These colors are all supported by the major browsers.

## Hexadecimal Notation

For the full palette, the red, green, and blue components of the color can be set individually. Each color component consists of a two-digit hexadecimal number, and the whole six-digit number is prefixed by a hash sign (#RRGGBB). Hexadecimal means base-16 counting, so valid digits are 0 through 9 and A through F. Each red-green-blue pair can range from 00 to FF, or 0-255 in decimal notation. All in all, this provides 16 million colors to choose from.

```css
color: '#FF0000'        /* red:255, green:0, blue:0 */
```

Although this color notation is the most obfuscated one, it is also the most common one because of its precision, conciseness, and browser support. An easy way to discover the hexadecimal value of a color is to use a color picker tool, for instance the one provided by the Google search engine when searching for “color picker.”
