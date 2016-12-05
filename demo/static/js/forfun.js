/**
 * Created by Bain on 12/1/2016.
 */
ForFun = function (name) {
    this.name = name;
    this.coordinates = {
        x: "x",
        y: "y"
    };
}
ForFun.prototype.tastes = 'Good';
ForFun.prototype.play = function (codes) {
    console.log(this.name + " says: \"" + codes + "\"" + " " + this.tastes);
};

var fun = new ForFun("Bain");
fun.play("I like codes");

catName("Chloe");

function catName(name) {
    console.log("My can's name is " + name);
}

