function TokenStream(input) {
    var current = null;
    var keywords = ' if then else lambda λ true false ';

    function next() {
        var tok = current;
        current = null;
        return tok || read_next();
    }

    function eof() {
        return peek() === null;
    }

    function peek() {
        return current || (current = read_next());
    }

    function read_while(fn) {
        var str = '';
        while (!input.eof() && fn(input.peek())) {
            str += input.next();
        }
        return str;
    }

    function is_whitespace(ch) {
        return ' \t\n'.indexOf(ch) > -1;
    }

    function is_digit(ch) {
        return /[0-9]/i.test(ch);
    }

    function is_op_char(ch) {
        return "+-*/%=&|<>!".indexOf(ch) > -1;
    }

    function is_keyword(x) {
        return keywords.indexOf(' ' + x + ' ') > -1;
    }

    function is_id_start(ch) {
        return /[a-zλ_]/i.test(ch);
    }

    function is_id(ch) {
        return is_id_start(ch) || "?!-<>=0123456789".indexOf(ch) > -1;
    }

    function is_punc(ch) {
        return ",;(){}[]".indexOf(ch) > -1;
    }

    function read_ident() {
        var id = read_while(is_id);
        return {
            type: is_keyword(id) ? "kw" : "var",
            value: id
        };
    }

    function read_number() {
        var has_dot = false;
        var number = read_while(function(ch) {
            if (ch == ".") {
                if (has_dot) return false;
                has_dot = true;
                return true;
            }
            return is_digit(ch);
        });
        return {
            type: "num",
            value: parseFloat(number)
        };
    }

    function read_escaped(end) {
        var escaped = false,
            str = "";
        var a = input.next();
        while (!input.eof()) {
            var ch = input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }

    function read_string() {
        return {
            type: "str",
            value: read_escaped('"')
        };
    }

    function skip_comment() {
        read_while(function(ch) {
            return ch !== "\n"
        });
        input.next();
    }

    function read_next() {
        read_while(is_whitespace);
        if (input.eof()) return null;
        var ch = input.peek();
        // console.log('*******************', ch);
        if (ch == "#") {
            skip_comment();
            return read_next();
        }
        if (ch == '"') return read_string();
        if (is_digit(ch)) return read_number();
        if (is_id_start(ch)) return read_ident();
        if (is_punc(ch)) {
            // console.log(ch, nextChar, '<------punk or op');
            var nextChar = input.next();
            return {
                type: "punc",
                value: nextChar
            };
        }
        if (is_op_char(ch)) return {
            type: "op",
            value: read_while(is_op_char)
        };
        input.croak("Can't handle character: " + ch);
    }

    return {
        next: next,
        peek: peek,
        eof: eof,
        croak: input.croak,
        version: 'token'
    }
}

module.exports = TokenStream;