/**
 * Created by Bain on 12/7/2016.
 */

function simple_test() {
    var a = ["a", "b", "c"];
    a.forEach(function (element, index, array) {
        console.log("a[" + index + "]=" + element);
    });
}

// simple_test();

function harder_code() {
    function logArrayElement(element, index) {
        console.log('a[' + index + ']=' + element);
    }

    [4, 9, 11].forEach(logArrayElement);
}
// harder_code();


function using_this() {
    function Counter() {
        this.sum = 0;
        this.count = 0;
    }

    Counter.prototype.add = function (array) {
        array.forEach(function (entry) {
            this.sum += entry;
            this.count++;
        }, this);
    }
    var obj = new Counter();
    obj.add([4, 7, 11]);
    console.log(obj.sum);
    console.log(obj.count);
}
// using_this();

function array_shift_effect() {
    var words = [1, 2, 3, 4];
    words.forEach(function (word) {
        console.log(word);
        if (word == 1) {
            words.shift();
            console.log(words);
        }
    });
}
array_shift_effect();


