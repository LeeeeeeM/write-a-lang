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



module.exports = Environment;