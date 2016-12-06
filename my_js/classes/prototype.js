/**
 * Created by Bain on 12/5/2016.
 */

var Obj = function (name, desc) {
    this.name = name;
    this.desc = desc
}

var obj = new Obj('Bain', 'Coder');
console.log(obj);
console.log(obj.name + " is a " + obj.desc);

Obj.prototype.show = function () {
    console.log('Show: ' + this.name + " is a " + this.name);
}
obj.show();

Obj.prototype['change'] = Obj.prototype.show;
obj.change();

console.log(Obj.prototype['change']);
console.log(Obj.show);
console.log('name ' + Obj.name);
console.log('name ' + Obj.prototype.name);
console.log(Obj.prototype.change);
console.log(Obj.prototype['change'] === Obj.prototype.show);
console.log(Obj.prototype.show === Obj.prototype.name)

