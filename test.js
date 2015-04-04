describe('noCommaBeforeEtAl', function() {

    var rule = apacheck.rules.noCommaBeforeEtAl;

    it('passes if there is no comma before et al.', function() {
        var result = rule.check('Foo et al.', '');
        expect(result).toEqual([]);
    });

    it('fails if there is a comma before et al.', function() {
        var result = rule.check('Foo, et al.', '');
        expect(result).toEqual(['Foo, et al.']);
    });

});

describe('periodAfterDateInReferences', function() {

    var rule = apacheck.rules.periodAfterDateInReferences;

    it('passes if there is a period after the date.', function() {
        var result = rule.check('', 'Foo. (2006, January). Blah.');
        expect(result).toEqual([]);
    });

    it('fails if there is no period after the date.', function() {
        var result = rule.check('', 'Foo. (2006, January) Blah.');
        expect(result).toEqual(['Foo. (2006, January) Blah.']);
    });

});

describe('ampersandBeforeLastAuthorInReferences', function() {

    var rule = apacheck.rules.ampersandBeforeLastAuthorInReferences;

    it('passes if there is an ampersand before the last author.', function() {
        var result = rule.check('', 'Foo, F., Bar, B., & Qux, Q. (2006)');
        expect(result).toEqual([]);
    });

    it('fails if there is no ampersand before the last author.', function() {
        var result = rule.check('', 'Foo, F., Bar, B., Qux, Q. (2006)');
        expect(result).toEqual(['Foo, F., Bar, B., Qux, Q. (']);
    });

});

describe('lowercasedTitleInReferences', function() {

    var rule = apacheck.rules.lowercasedTitleInReferences;

    it('passes if the title is lowercased.', function() {
        var result = rule.check('', 'Foo, F. (2006). The box: A retrospective.');
        expect(result).toEqual([]);
    });

    it('fails if the title is not lowercased.', function() {
        var result = rule.check('', 'Foo, F. (2006). The Box: A retrospective.');
        expect(result).toEqual(['). The Box: A retrospective.']);
    });

});

describe('periodFollowedBySpace', function() {

    var rule = apacheck.rules.periodFollowedBySpace;

    it('passes if periods are followed by spaces.', function() {
        var result = rule.check('Hello. World. Foo.', '');
        expect(result).toEqual([]);
    });

    it('fails if if periods are not followed by spaces.', function() {
        var result = rule.check('Hello.World.Foo.', '');
        expect(result).toEqual(['Hello.World.F']);
    });

    it('passes if n.d. encountered', function() {
        var result = rule.check('Smith (n.d.).', '');
        expect(result).toEqual([]);
    });

    it('passes if e.g. encountered', function() {
        var result = rule.check('Smith (n.d.).', '');
        expect(result).toEqual([]);
    });

});

describe('split', function() {

    it('passes if split returns body and references.', function() {
        var result = apacheck.split('This is (References) the body.\nReferences \nThese are the references.');
        expect(result).toEqual({body: 'This is (References) the body.', references: 'These are the references.'});
    });

    it('passes if split returns empty string for references if no references.', function() {
        var result = apacheck.split('This is (References) the body.');
        expect(result).toEqual({body: 'This is (References) the body.', references: ''});
    });

    it('passes if split returns empty string for body if no body.', function() {
        var result = apacheck.split('References \nThese are the references.');
        expect(result).toEqual({body: '', references: 'These are the references.'});
    });

});

