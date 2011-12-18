/**
 * Интерпретатор эмулирует синхронное выполнение кода оправляя команды обработчику
 * и дожидаясь выполнения каждой команды.
 *
 * @var code массив действий для выполнения
 *
 * Система команд:
 *  <move> <distance>
 *  <turn> <direction>
 */


Vm = function Vm(codeStr)
{
    this.data = [];
    this.code = new PascalCompiler(codeStr).parse();
    this.pointer = 0;
};

Eventable(Vm.prototype);

Vm.prototype.step = function()
{
    var command = this.code[this.pointer];
    if (command) {
        this.pointer++;
        this[command]();
    } else {
        this.emit('terminate');
    }
};

Vm.prototype.move = function()
{
    this.emit('action', {
        'move': this.code[this.pointer++] * 16
    });
};

Vm.prototype.turn = function()
{
    this.emit('action', {
        'turn': this.code[this.pointer++]
    });
};