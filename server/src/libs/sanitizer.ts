import * as sanitizeHtml from 'sanitize-html';


const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre',
    'figure', 'caption', 'figcaption', 'img',
  ],
  allowedAttributes: {
    'a': [ 'href' ],
    '*': [ 'class' ],
    'img': [ 'src', 'alt' ],
  },
  // allowedSchemes: [ 'http', 'https', 'steam' ]
  allowedSchemesByTag: {
    'a': [ 'http', 'https', 'steam' ]
  }
};


/**
 * Sanitize HTML
 * @param  {string} htmlInput       the HTML to sanitize
 * @return {string}                 the sanitized HTML output
 */
const sanitizer = (htmlInput: string) => sanitizeHtml(htmlInput, sanitizeOptions);

export const sanitize = sanitizer;
