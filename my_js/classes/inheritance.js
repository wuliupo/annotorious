/**
 * Created by Bain on 12/5/2016.
 */

// Shape - superclass
function Shape() {
    this.x = 0;
    this.y = 0;
}

//Superclass method
Shape.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    console.info('Shape moved');
}

// Rectangle - subclass
function Rectangle() {
    Shape.call(this);
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

console.log('Is rect an instance of Rectangle?', rect instanceof Rectangle);
console.log('Is rect an instance of Shape?', rect instanceof Shape);
rect.move(1, 1);
