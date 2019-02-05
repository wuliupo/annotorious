/**
 * Created by Bain on 12/6/2016.
 */

var ima_celebrity = "Everyone can see me! I'm famous",
    the_president = "I'm the decider";

function pleasantville() {
    var the_mayor = "I rule Pleasantville with an iron fist!",
        ima_celebrity = "All my neighbors know who I am!";

    function lonely_house() {
        var agoraphobic = "I fear the day star!",
            a_cat = "Meow.";
    }
}

function BigComputer(answer) {
    this.the_answer = answer;
    this.ask_question = function () {
        return this.the_answer;
    }
}

var deep_thought = new BigComputer(42);
var the_meaning = deep_thought.ask_question();
console.log(the_meaning);

function what_is_this() {
    function test_this() {
        return this;
    }

    var i_wonder_what_this_is = test_this();
    console.log(i_wonder_what_this_is);
}
what_is_this();

(function call_function(){
    var first_object = {
        num:42
    };

    var second_object = {
        num: 24
    };

    function multiply(mult){
        return this.num*mult;
    }

    console.log(multiply.call(first_object, 5));
    console.log(multiply.call(second_object, 5));
})();


