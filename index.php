<h1>APA Checker</h1>
<p>
    This APA Checker/Lint/Validator does miscellaneous checks for conformity with
    the American Psychological Association (APA)
    <a href="https://owl.english.purdue.edu/owl/resource/560/01/">citation and format style</a>.
</p>
<p>
    Just paste in your document below, then press Validate.
</p>
<p>
    (<a href="https://github.com/JonathanAquino/apacheck/blob/master/index.php">source code,</a>
    <a href="https://github.com/JonathanAquino/apacheck">project page</a>)
</p>
<?php
if ($_POST) {
    // The first capturing group will be output in the error message.
    $rules = array(
        array(
            'description' => 'Do not put a comma before "et al."',
            'forReferences' => false,
            'regex' => '@
                (
                    .{10}          # 10 characters of context
                    ,[ ]et[ ]al\.  # , et al.
                    .{10}          # 10 characters of context
                )
            @x',
        ),
        array(
            'description' => 'References: Put period after date.',
            'forReferences' => true,
            'regex' => '@
                (
                    .{10}             # 10 characters of context
                    \(\d\d\d\d[^)]*\) # The date
                    [^.]              # No period
                    .{10}             # 10 characters of context
                )
            @x',
        ),
        array(
            'description' => 'References: Put & before last author.',
            'forReferences' => true,
            'regex' => '@
                (
                    \n                # Start of the line
                    [^\n(,]+          # Non-comma characters
                    ,                 # Comma
                    [^\n(,]+          # Non-comma characters
                    ,                 # Comma
                    (
                        (?!\.[ ]\.[ ]\.)
                        (?!\.\.\.)    # Does not already have & or . . .
                        [^\n(&]
                    )+
                    \(                # (
                )
            @x',
        ),
        array(
            'description' => 'Consider lowercasing the words in this title if it is for an article.',
            'forReferences' => true,
            'regex' => '@
                (
                    \)\.\s            # ). followed by whitespace
                    [A-Z]             # First letter can be uppercase
                    [^\n.:]*          # Any characters
                    [A-Z]             # Uppercase character
                    [^\n.]*           # Any characters
                    \.                # .
                )
            @x',
        )
    );
    list($document, $references) = preg_split('@\n\s*References\s*\n@', $_POST['document']);
    echo "<h2>Results</h2>\n";
    echo "<ul>\n";
    $issuesFound = false;
    foreach ($rules as $rule) {
        $content = $rule['forReferences'] ? $references : $document;
        preg_match_all($rule['regex'], $content, $matches);
        if ($matches[1]) {
            $issuesFound = true;
            echo "<li>\n";
            echo htmlentities($rule['description']) . "\n";
            echo "<ul>\n";
            foreach ($matches[1] as $match) {
                echo "<li>\n";
                echo htmlentities($match) . "\n";
                echo "</li>\n";
            }
            echo "</ul>\n";
            echo "</li>\n";
        }
    }
    echo "</ul>\n";
    if (!$issuesFound) {
        echo "<p>No issues found.</p>\n";
    }
} ?>
<style>
textarea {
    width: 500px;
    height: 300px;
}
</style>
<form method="post">
<dl>
<dd><textarea name="document"><?php echo htmlentities($_POST['document']) ?></textarea></dd>
<dd><input type="submit" value="Validate"></dd>
</dl>
</form>