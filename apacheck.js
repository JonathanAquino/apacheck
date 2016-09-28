/**
 * Miscellaneous checks for conformity with APA citation and format style.
 *
 * @see
 */
var apacheck = {
    rules: [
        {
            description: 'A description of the rule.',
            /**
             * Returns a list of excerpts for each violation of the rule.
             *
             * @param string body The portion of the document before the "References" heading.
             * @param string references The portion of the document after the "References" heading.
             *
             * @return Array|null An array of short excerpts around each violation.
             */
            check: function (body, references) {
                return [];
            }
        },
        {
            description: 'Lowercase the letter that comes after the year: 1999a, not 1999A',
            check: function (body, references) {
                var regexp = XRegExp(
                    '('
                  +     '.{0,10}'          // 10 characters of context
                  +     '\\b\\d\\d\\d\\d[A-Z][),]'
                  +     '.{0,10}'          // 10 characters of context
                  + ')'
                , 'g');
                return body.match(regexp) || [];
            }
        },
        {
            description: 'Do not put a comma before "et al."',
            check: function (body, references) {
                var regexp = XRegExp(
                    '('
                  +     '.{0,10}'          // 10 characters of context
                  +     ', et al\\.'       // , et al.
                  +     '.{0,10}'          // 10 characters of context
                  + ')'
                , 'g');
                return body.match(regexp) || [];
            }
        },
        {
            description: 'References: Put period after date.',
            check: function (body, references) {
                var regexp = XRegExp(
                    '('
                  +     '.{0,10}'                   // 10 characters of context
                  +     '\\(\\d\\d\\d\\d[^)]*\\)'   // The date
                  +     '[^.]'                      // No period
                  +     '.{0,10}'                   // 10 characters of context
                  + ')'
                , 'g');
                return references.match(regexp) || [];
            }
        },
        {
            description: 'References: Put & before last author.',
            check: function (body, references) {
                var regexp = XRegExp(
                    '('
                  +     '^'                     // Start of the line
                  +     '[^(,]+'                // Non-comma characters
                  +     ','                     // Comma
                  +     '[^(,]+'                // Non-comma characters
                  +     ','                     // Comma
                  +     '('
                  +         '(?!\\. \\. \\.)'
                  +         '(?!\\.\\.\\.)'     // Does not already have & or . . .
                  +         '[^(&]'
                  +     ')+'
                  +     '\\('                   // (
                  + ')'
                , 'g');
                return references.match(regexp) || [];
            }
        },
        {
            description: 'References: Consider lowercasing the words in this title if it is for an article.',
            check: function (body, references) {
                var regexp = XRegExp(
                    '('
                  +     '\\)\\.\\s*' // ). followed by whitespace
                  +     '[A-Z]'      // First letter is uppercase
                  +     '[^.:]*'     // Any characters other than . or :
                  +     '[A-Z]'      // Uppercase letter
                  +     '[^.]*'      // Any characters other than .
                  +     '\\.'        // .
                  + ')'
                , 'g');
                return references.match(regexp) || [];
            }
        },
        {
            description: 'Every period should be followed by a space.',
            check: function (body, references) {
                var content = (body + ' ' + references).replace(/http:\/\/[^ ]*/g, '');
                var regexp = XRegExp(
                    '('
                  +     '.{0,10}'         // 10 characters of context
                  +     '(?!\\b).'        // If there is a single letter before the period, it's ok
                  +     '\\.[^ ,\n0-9)]'  // Period followed by something other than a space, comma, or newline
                  + ')'
                , 'g');
                return (content).match(regexp) || [];
            }
        },
        {
            description: 'Combine separate references into one with a semicolon. <strong>Bad:</strong> (Jones 2000) (Smith 1990) <strong>Good:</strong> (Jones 2000; Smith 1990)',
            check: function (body, references) {
                var regexp = XRegExp(
                    '('
                  +     '.{0,10}'                  // 10 characters of context
                  +     '\\([^)]+ \\d\\d\\d\\d\\)' // First reference
                  +     '[ ,]*'                    // Space or comma
                  +     '\\([^)]+ \\d\\d\\d\\d\\)' // Second reference
                  + ')'
                , 'g');
                return (body).match(regexp) || [];
            }
        },
        {
            description: 'References need to be included in the sentence, so the period is after the reference. <strong>Bad:</strong> text. (Jones, 2000) Text <strong>Good:</strong> text (Jones, 2000). Text <strong>Also Good:</strong> text (Jones, 2000) text. Text',
            check: function (body, references) {
                var regexp = XRegExp(
                    '('
                  +     '.{0,10}'                  // 10 characters of context
                  +     '\\.\\s+'                  // Period followed by whitespace
                  +     '\\([^)]+ \\d\\d\\d\\d\\)' // Second reference
                  + ')'
                , 'g');
                return (body).match(regexp) || [];
            }
        },
        {
            description: 'In-text citations use &amp; for multiple authors if the names are in brackets. <strong>Bad:</strong> (Wegener and Petty, 1994) <strong>Good:</strong> (Wegener &amp; Petty, 1994)',
            check: function (body, references) {
                var regexp = XRegExp(
                    '('
                  +     '.{0,10}'          // 10 characters of context
                  +     '\\('              // Opening parenthesis
                  +     '[^)]+ and [^)]+'  // ... and ...
                  +     ' \\d\\d\\d\\d\\)' // Year, closing parenthesis
                  + ')'
                , 'g');
                return (body).match(regexp) || [];
            }
        },
        {
            description: 'In-text citations use "and" for multiple authors if only the year is in brackets. <strong>Bad:</strong> Wegener & Petty (1994) <strong>Good:</strong> Wegener and Petty (1994)',
            check: function (body, references) {
                var regexp = XRegExp(
                    '('
                  +     '.{0,10}'            // 10 characters of context
                  +     '&'                  // &
                  +     '[^.,()]{0,100}'     // Up to 100 of anythings besides .,()
                  +     '\\(\\d\\d\\d\\d\\)' // Year in brackets
                  + ')'
                , 'g');
                return (body).match(regexp) || [];
            }
        }
    ],
    /**
     * Returns an object whose keys are rule descriptions and values are arrays
     * of excerpts around each violation.
     *
     * @param string s The document to check.
     *
     * @return Object Error excerpts keyed by rule descriptions.
     */
    check: function (s) {
        var parts = this.split(s);
        var results = {};
        $.each(this.rules, function (i, rule) {
            var excerpts = rule.check(parts.body, parts.references);
            if (excerpts.length > 0) {
                results[rule.description] = excerpts;
            }
        })
        return results;
    },
    /**
     * Splits the document into two parts: body (before the "References" heading)
     * and references (after the "References" heading).
     *
     * @param string s The document to check.
     *
     * @return Object Hash with two keys: body and references.
     */
    split: function (s) {
        var match = XRegExp.exec(s, XRegExp('^\\s*References\\s*$', 'm'));
        if (!match) {
            return {body: s, references: ''};
        }
        return {
            body: s.substring(0, match.index).trim(),
            references: s.substring(match.index + match[0].length).trim()
        };
    }
}