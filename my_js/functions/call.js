/**
 * Created by Bain on 12/4/2016.
 * The call() method calls a function with a given this value and arguments provided individually.
 */
function showFun() {
    function fun() {
        var args = arguments;
        for (var i = 0; i < args.length; i++) {
            console.log(args[i]);
        }
    }

    var x = fun;
    x.call(this, 1, 2, 3, 4, 5);
}


function using_call_to_chain_constructors() {

    function Product(name, price) {
        this.name = name;
        this.price = price;

        if (price < 0) {
            throw RangeError('Cannot create product ' + this.name + ' with a negative price');
        }
    }

    function Food(name, price) {
        Product.call(this, name, price);
        this.category = 'food';
    }

    function Toy(name, price) {
        Product.call(this, name, price);
        this.category = 'toy';
    }

    var food = new Food('egg', 1);
    console.log(food.category + " " + food.name + " is " + food.price);

    var toy = new Toy('train', -1);
    console.log(toy.category + " " + toy.name + " is " + toy.price);
}

function using_call_to_invoke_an_anonymous_function() {
    var animals = [
        {species: 'Lion', name: 'Max'},
        {species: 'Whale', name: 'Giga'}
    ];

    for (var i = 0; i < animals.length; i++) {
        ( function (i) {
            console.log('#' + i + " " + this.species + "'s name is " + this.name);
        }).call(animals[i], i);
    }
}

function using_call_to_invoke_a_function_and_specifying_the_context_for_this() {
    function greet() {
        var reply = [this.name, "is an awesome", this.role].join(" ");
        console.log(reply);
    }

    var god = {
        name: "Bain",
        role: "Coder"
    };
    greet.call(god);
}
// using_call_to_chain_constructors();
// using_call_to_invoke_an_anonymous_function();
using_call_to_invoke_a_function_and_specifying_the_context_for_this();