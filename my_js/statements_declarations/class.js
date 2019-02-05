/**
 * Created by Bain on 12/4/2016.
 */
'use strict';
var Foo = class {
};
var Foo = class {
};

console.log(typeof Foo);
console.log(typeof class {
});
console.log(Foo instanceof Object);
console.log(Foo instanceof Function);
// class Foo { } ;//Not allowed duplicate declaration

var Foo = class {
    constructor() {
        this.a = 1;
        this.b = 2;
    }

    bar() {
        return "Hello World";
    }
};
var instance = new Foo();
console.log(instance.bar());
console.log(instance.a + instance.b);

var Bar = class NamedFoo {
    constructor() {
    }

    whoIsThere() {
        return NamedFoo.name;
    }
}
var bar = new Bar();
console.log('Who? ' + bar.whoIsThere());
// console.log(NamedFoo.name);
console.log('Me! ' + Bar.name);
