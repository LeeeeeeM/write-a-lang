function InputStream(input) {
    var pos = 0;
    var line = 1;
    var col = 0;

    function next() {
        var ch = input.charAt(pos++);
        if (ch === '\n') {
            line++;
            col = 0;
        } else {
            col++;
        }
        return ch;
    }

    function peek() {
        return input.charAt(pos);
    }

    function eof() {
        return peek() === '';
    }

    function croak(msg) {
        throw new Error(msg + '(' + line + ':' + col + ')');
    }

    return {
        next: next,
        peek: peek,
        eof: eof,
        croak: croak,
        version: 'input'
    };
}

module.exports = InputStream;