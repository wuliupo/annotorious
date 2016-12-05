/**
 * Created by Bain on 12/4/2016.
 * An arrow function expression has a shorter syntax compared to function expressions and does not bind its own this,
 * arguments, super, or new.target. Arrow functions are always anonymous.
 * These function expressions are best suited for non-method functions and they can not be used as constructors.
 */
// var f = ([a, b] = [4, 5], {x: c} = {x: a * b}) => a * b * c;
// f();
// console.log(f());
var f = s => s.length;
console.log(f('i like codes'));

var add = (a, b, c) => a * b * c;
console.log(add(4, 2, 3));

function Person() {
    this.age = 0;

    var life = setInterval(() => {
        this.age++;
        console.log("p's age is " + this.age);
        if (this.age > 2) {
            clearInterval(life);
        }
    }, 1000);

}
var p = new Person();
var anotherLife = setInterval(() => {
    p.age++;
    console.log("Another life's age is " + p.age);
    if (p.age > 5) {
        clearInterval(anotherLife);
    }
}, 1000);
setTimeout(() => {
    console.log("p's new age is " + p.age)
}, 2000);
console.log(() => {
    console.log(1 + 1)
});

var adder = {
    base: 1,
    add: function (a) {
        var f = v => v + this.base;
        return f(a);
    },

    addThruCall: function (a) {
        var f = v => v + this.base;
        //The call() method calls a function with a given this value and arguments provided individually.
        return f.call(a, 100);
    }
};
console.log('ADDER: ' + adder.add(2));
console.log('ADDER: ' + adder.addThruCall(1));
