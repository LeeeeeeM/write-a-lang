function Environment(parent) {
    this.vars = Object.create(parent ? parent.vars : null);
    this.parent = parent;
}


Environment.prototype = {
    constructor: Environment,
    extend: function() {
        return new Environment(this);
    },
    lookup: function(key) {
        var scope = this;
        while(scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, key)) {
                return scope;
            }
            scope = scope.parent;
        }
        throw new Error('no such vars')
    },
    get: function(key) {
        var scope = this.lookup(key);
        if (scope) {
            return scope[key];
        }
        throw new Error('Undefined variable' + name);
    },
    set: function(key, value) {
        return this.vars[key] = value;
    },
    def: function(key, value) {
        return this.vars[key] = value;
    }
}


function evaluate(exp, env) {
    switch (exp.type) {
        case 'num':
        case 'str':
        case 'bool':
            return exp.value;
        case 'var':
            return env.get(exp.value);
        case 'assign':
            if (exp.left.type !== 'var') {
                throw new Error('can\'t assign to' + JSON.stringify(exp.left.value));
            }
            return env.set(exp.left.value, evaluate(exp.right, env));
        case 'binary':
            return apply_op(exp.operator,
                evaluate(exp.left, env),
                evaluate(exp.right, env));
        case 'lambda':
            return make_lambda(exp, env);

        case 'if':
            var cond = evaluate(exp.cond, env);
            if (cond !== false) {
                return evaluate(exp.then, env);
            }
            return exp.else ? evaluate(exp.else, env) : false;

        case 'call':
            var fn = evaluate(exp.func, env);
            return fn.apply(null, exp.args.map(function(arg) {
                return evaluate(arg, env);
            }));

        case 'prog':
            var val = false;
            exp.prog.forEach(function(exp) {
                val = evaluate(exp, env);
            });
            return val;

        default:
            throw new Error('can\'t deal with this type');
    }
}

function make_lambda(exp, env) {
    return function () {
        var names = exp.vars;
        var scope = env.extend();
        for (var i = 0; i < names.length; i++) {
            scope.set(names[i], arguments[i] || false);
        }
        return evaluate(exp.body, scope);
    }
}


function apply_op(op, a, b) {
    function num(x) {
        if (typeof x !== 'number') {
            throw new Error('expected number but got' + x);
        }
        return x;
    }

    function div(x) {
        if (num(x) === 0) {
            throw new Error('can\'t divided by zero');
        }
        return x;
    }
    switch (op) {
        case '+': 
            return num(a) + num(b);
        case '-':
            return num(a) - num(b);
        case '*':
            return num(a) * num(b);
        case '/':
            return num(a) / div(b);
        case '%':
            return num(a) % div(b);
        case '&&':
            return a && b;
        case '||':
            return a || b;
        case '<':
            return num(a) < num(b);
        case '>':
            return num(a) > num(b);
        case '<=':
            return num(a) <= num(b);
        case '>=':
            return num(a) >= num(b);
        case '==':
            return a === b;
        case '!=':
            return a !== b;
        default:
            throw new Error('Can\'t apply operator' + op);
    }
}



module.exports.Environment = Environment;
module.exports.evaluate = evaluate;