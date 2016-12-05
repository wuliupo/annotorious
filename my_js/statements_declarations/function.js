/**
 * Created by Bain on 12/4/2016.
 */

var x = function (y) {
    return y * y;
}
console.log(x(5));
console.log(x.toString());

function creating_a_bound_function() {
    this.x = 9;
    var module = {
        x: 81,
        getX: function () {
            return this.x;
        }
    }
    console.log(module.getX());

    var retrieveX = module.getX;
    console.log(retrieveX());
    // Create a new function with 'this' bound to module
    // New programmers might confuse the
    // global var x with module's property x
    var boundGetX = retrieveX.bind(module);
    console.log(boundGetX());
}

function set_timeout_bound() {
    function LateBloomer() {
        this.petalCount = Math.ceil(Math.random() * 12) + 1;
        this.maker = 'Bain';
    }

    LateBloomer.prototype.bloom = function () {
        setTimeout(this.declare.bind(this), 1000);
        // setTimeout(this.declare, 1000);
    };

    LateBloomer.prototype.declare = function () {
        console.log('I am a beautiful flower with ' + this.petalCount + ' petals! And I was made by ' + this.maker);
    };

    var flower = new LateBloomer();
    flower.bloom();
}

function slice_bound() {
    var slice = Array.prototype.slice;
    console.log(slice.apply(arguments));

    var xslice = Function.prototype.apply.bind(slice);
    console.log(xslice(arguments));
}
// creating_a_bound_function();
// set_timeout_bound();
slice_bound(1, 2, 3, 4, 5);
