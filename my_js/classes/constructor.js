/**
 * Created by Bain on 12/4/2016.
 */
"use strict";
class Flower {

    constructor(color) {
        this.color = color;
    }

    get colorName() {
        return this.color;
    }

    set colorName(value) {
        this.color = value;
    }
}

var flower = new Flower('Black');
console.log(flower.colorName);
console.log(flower.colorName = 'Rainbow');

class Polygon {
    constructor(height, width) {
        this.name = 'Polygon';
        this.height = height;
        this.width = width;
    }

    sayName() {
        console.log("I'm Polygon");
    }

    sayHistory() {
        console.log('"Polygon" is derived from the Greek polus (many) and gonia (angle).');
    }
}
class Square extends Polygon {
    constructor(length) {
        super(length, length);
        this.name = 'Square';
    }

    get area() {
        return this.height * this.width;
    }

    set area(value) {
        this.height = this.width = Math.sqrt(value);
    }
}
var square = new Square(4);
console.log(square.area);
square.area = 24;
console.log(square.height);
square.sayName();
square.sayHistory();

