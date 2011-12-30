
PascalCompiler = function PascalCompiler(codeStr)
{
    this.codeStr = codeStr;
    this.cur = 0;

    this.line = 1;
    this.char = 1;
    this.posStack = []; // stack to save cursor positions to properly show error place
    this.buildInFunc = {
        'write': {
            'signature': 'var', // var args
            'inline': 'write'
        },
        'writeln': {
            'signature': 'var', // var args
            'inline': 'writeln'
        },
        'move': {
            'signature': ['integer'],
            'inline': 'tank-move'
        },
        'turn': {
            'signature': ['string'],
            'inline': 'tank-turn'
        }
    };
};

PascalCompiler.prototype.isSpace = /\s/;
PascalCompiler.prototype.isNum = /[0-9]/;
PascalCompiler.prototype.isChar = /[a-z]/i;
PascalCompiler.prototype.isSymbol = /\w/i;
PascalCompiler.prototype.isKeyword = /program|var|begin|end|if/i;

PascalCompiler.prototype.parse = function()
{
    return this.parseProgram();
};

PascalCompiler.prototype.parseProgram = function()
{
    this.symbolTable = new SymbolTable();
    this.varOffset = 2;
    var code = ['jmp', 0 /* will changed */];
    this.eatIdentifier('program');
    var name = this.parseIdentifier();
    this.token(';');
    var chunk = this.parseBlock();
    this.token('.');
    // allocate space for global vars
    for (var i = 0, l = this.symbolTable.length() ; i < l ; i++) {
        code.push(0);
    }
    code = code.concat(chunk);
    // jump over vars space
    code[1] = this.symbolTable.length();
    return {
        code: code
    };
};

PascalCompiler.prototype.parseBlock = function()
{
    if (this.lookIdentifier() == 'var') {
        this.parseVariableDeclaration();
    }
    return this.parseBlock5();
};

PascalCompiler.prototype.parseVariableDeclaration = function()
{
    var vars, type, v;
    this.eatIdentifier('var');
    while (true) {
        if (this.isKeyword.test(this.lookIdentifier())) {
            break;
        }
        vars = [];
        do {
            vars.push(this.parseIdentifier());
        } while (this.look() == ',' && this.token(','));
        this.token(':');
        type = this.parseIdentifier();

        try {
            while (v = vars.pop()) {
                this.symbolTable.addVar(v, type);
            }
        } catch (ex) {
            throw new Error(ex.message + ' at ' + this.formatPos());
        }

        if (this.look() == ';') {
            this.token(';');
        } else {
            break;
        }
    }
};

PascalCompiler.prototype.parseBlock5 = function()
{
    this.eatIdentifier('begin');
    var chunk = this.parseStatementList();
    this.eatIdentifier('end');
    return chunk;
};

PascalCompiler.prototype.parseStatementList = function()
{
    var code = [];
    while (true) {
        code = code.concat(this.parseStatement());
        if (this.lookIdentifier() == 'end') {
            break;
        }
        this.token(';');
    }
    return code;
};

PascalCompiler.prototype.parseStatement = function()
{
    var code = [];
    var look = this.lookIdentifier();
    if (look.length > 0) {
        if (this.isKeyword.test(look)) {
            if (look == 'if') {
                code = this.parseIf();
            }
        } else {
            var name = this.parseIdentifier();
            if (this.look() == ':') {
                code = this.parseAssigment(name);
            } else if (this.look() == '(' || this.look() == ';' || this.test(this.isChar)) {
                code = this.parseFunctionCall(name);
            }
        }
    }
    return code;
};

PascalCompiler.prototype.parseIf = function(name)
{
    var code = [];
    this.token('if');
    var ex = this.parseExpression();
    this.token('then');
    var ifStatement = this.parseStatement();
    var elseStatement = [];
    if (this.lookIdentifier() == 'else') {
        this.token('else');
        elseStatement = this.parseStatement();
    }
    code = code.concat(ex.code);
    code.push('pop-reg');
    code.push('ax');
    if (elseStatement.length == 0) {
        code.push('jz');
        code.push(ifStatement.length);
        code = code.concat(ifStatement);
    } else {
        code.push('jz');
        code.push(ifStatement.length + 2 /* jmp over elseStatement */);
        code = code.concat(ifStatement);
        code.push('jmp');
        code.push(elseStatement.length);
        code = code.concat(elseStatement);
    }
    return code;
};

PascalCompiler.prototype.parseAssigment = function(name)
{
    var code = [];
    this.token(':=');
    var ex = this.parseExpression();
    code = code.concat(ex.code);
    var v;
    if ((v = this.symbolTable.look(name))) {
        if (v.type == ex.type) {
            code.push('pop-reg');
            code.push('ax');
            code.push('move-mem-reg', v.offset + this.varOffset, 'ax');
        } else {
            throw new Error('Mistmatch types "' + v.type + '" and "'
                    + ex.type + '" at ' + this.formatPos());
        }
    } else {
        throw new Error('Undefined variable "' + name + '" at ' + this.formatPos());
    }
    return code;
};

PascalCompiler.prototype.parseFunctionCall = function(name)
{
    var code = [], ex;
    if ((func = this.buildInFunc[name])) {
        if (func.signature) {
            this.token('(');
            var param = [];
            do {
                if (this.look() == ')') {
                    break;
                }
                ex = this.parseExpression();
                param.push(ex);
                code = code.concat(ex.code);
            } while (this.look() == ',' && this.token(','));
            this.token(')');
            if (func.signature == 'var') {
                code.push('push-val');
                code.push(param.length);
            } else {
                if (func.signature.length == param.length) {
                    for (var i = 0 ; i < param.length ; i++) {
                        if (param[i].type != func.signature[i]) {
                            throw new Error('Mismatch argument type in function "'
                                    + name + '" call, argument ' + i
                                    + ', at ' + this.formatPos());
                        }
                    }
                } else {
                    throw new Error('Mismatch parameters count for function "'
                            + name + '" at ' + this.formatPos());
                }
            }
        }
        code.push(func.inline);
    } else {
        throw new Error('Undefined function or procedure "' + name
                + '" at ' + this.formatPos());
    }
    return code;
};

/**
 * parse an expression and put result in on top of the stack
 * @return
 */
PascalCompiler.prototype.parseExpression = function()
{
    var code = [], type, value;
    if (this.test(this.isChar)) {
        var name = this.parseIdentifier();
        var v;
        if (v = this.symbolTable.look(name)) {
            code.push('push-mem');
            code.push(v.offset + this.varOffset);
            type = v.type;
        } else {
            throw new Error('Undefined variable "' + name + '" at ' + this.formatPos());
        }
    } else if (this.test(this.isNum)) {
        value = this.parseNumber();
        code.push('push-val');
        code.push(value);
        type = 'integer';
    } else if (this.test("'")) {
        value = this.parseString();
        type = 'string';
        code.push('push-val');
        code.push(value);
    } else {
        throw new Error('Unexpected "' + this.look() + '". Expression expected at ' + this.formatPos());
    }
    return {
        type: type,
        code: code
    }
};

PascalCompiler.prototype.parseNumber = function()
{
    var next;
    if (next = this.test(this.isNum)) {
        var res = 0;
        while (next = this.test(this.isNum)) {
            res = res * 10 + parseInt(next);
            this.eat(next);
        }
        this.eatWs();
        return res;
    } else {
        throw new Error('Unexpected "' + this.look() + '". Num expected at ' + this.formatPos());
    }
};

PascalCompiler.prototype.parseString = function()
{
    this.eat("'");
    var next;
    var res = '';
    while (!this.test("'")) {
        next = this.look();
        res += next;
        this.eat(next);
    }
    this.eat("'");
    this.eatWs();
    return res;
};

PascalCompiler.prototype.testIdentifier = function(identifier)
{
    this.pushCur();
    var res = this.parseIdentifier();
    this.popCur();
    return res == identifier;
};

PascalCompiler.prototype.eatIdentifier = function(identifier)
{
    this.pushPos();
    if (this.parseIdentifier() != identifier) {
        throw new Error(identifier + ' expected at ' + this.formatPos());
    }
    this.popPos();
};

PascalCompiler.prototype.parseIdentifier = function()
{
    var next;
    if (next = this.test(this.isChar)) {
        var res = '';
        while (next = this.test(this.isSymbol)) {
            res += next;
            this.eat(next);
        }
        this.eatWs();
        return res.toLowerCase();
    } else {
        throw new Error('Unexpected "' + this.look() + '". Identifier expected at ' + this.formatPos());
    }
};

PascalCompiler.prototype.look = function()
{
    return this.codeStr.charAt(this.cur);
};

PascalCompiler.prototype.lookIdentifier = function()
{
    this.pushCur();
    var next, res = false;
    if (next = this.test(this.isChar)) {
        res = '';
        while (next = this.test(this.isSymbol)) {
            res += next;
            this.eat(next);
        }
    }
    this.popCur();
    return res;
};

/**
 * @param char char || RegExp
 * @return
 */
PascalCompiler.prototype.test = function(check)
{
    var res = this.look();
    if (check) {
        if ((typeof check == 'string') && res != check ||
            (typeof check == 'object') && !check.test(res)) {
            return false;
        }
    }
    return res;
};

/**
 * @param char should not be '\n'
 */
PascalCompiler.prototype.eat = function(str)
{
    var look = this.codeStr.substr(this.cur, str.length);
    if (look == str) {
        this.cur += str.length;
        this.char += str.length;
    } else {
        throw new Error('"' + str + '" expected at ' + this.formatPos() + ', but "' + look + '" given');
    }
};

PascalCompiler.prototype.token = function(token)
{
    this.eat(token);
    this.eatWs();
    return true;
};

PascalCompiler.prototype.eatWs = function()
{
    while (this.isSpace.test(this.look())) {
        if (this.look() == '\n') {
            this.line++;
            this.char = 1;
        } else {
            this.char++;
        }
        this.cur++;
    }
};

PascalCompiler.prototype.formatPos = function()
{
    if (this.posStack.length > 0) {
        var pos = this.popPos();
        return 'line: ' + pos.line + ', char: ' + pos.char;
    } else {
        return 'line: ' + this.line + ', char: ' + this.char;
    }
};

PascalCompiler.prototype.pushPos = function()
{
    this.posStack.push({line: this.line, char: this.char});
};

PascalCompiler.prototype.popPos = function()
{
    return this.posStack.pop();
};

PascalCompiler.prototype.pushCur = function()
{

    this.posStack.push({line: this.line, char: this.char, cur: this.cur});
};

PascalCompiler.prototype.popCur = function()
{
    var pos   = this.posStack.pop();
    this.line = pos.line;
    this.char = pos.char;
    this.cur  = pos.cur;
};
