/**
 * Created by Bain on 12/3/2016.
 */
var log = ['test', 1, 2];
var obj = {
    get latest() {
        if (log.length == 0) {
            return undefined;
        }
        // return log[log.length - 1];
        return log.pop();
    },
    set current(name) {
        log[log.length] = name;
    },
    x: "Saber",
    foo(){
        console.log(this.x + " like me");
    },
    bar(name){
        console.log(name + " bar ");
    },
    foo0: function () {
        console.log("foo0");
    },
    ["foo" + 1](){
        console.log("foo" + 1);
    },
    g: function*() {
        var index = 0;
        while (true) {
            yield index++;
        }
    },
    * f(){
        var index = 0;
        while (true) {
            console.log(yield index++);
        }
    }
}


obj.foo();
obj.bar('funny');
obj.foo();
obj.foo0();
obj.foo1();
g = obj.g();
for (var i = 0; i < 3; i++) {
    console.log(g.next());
}
f = obj.f();
for (var i = 3; i < 6; i++) {
    f.next(i);
}
console.log('pop ' + obj.latest);
console.log('pop ' + obj.latest);
console.log('pop ' + obj.latest);

Object.defineProperty(obj, "b", {
    get: function () {
        return 1;
    }
});
console.log('defined getter b ' + obj.b);
console.log(delete obj.foo);
try {
    obj.foo();
} catch (e) {
    console.log("Method has been removed " + e);
}
obj.current = 'Lancer';
console.log(obj.latest);

