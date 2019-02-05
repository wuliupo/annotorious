/**
 * Created by Bain on 12/4/2016.
 */
function kkk() {
    arguments[0] = 3;
    arguments[1] = 4;
    return arguments;
}
var args = kkk(1, 2, 5);
console.log(args);
console.log(Array.prototype.slice.call(args, 1));
var array = Array.from(args);
console.log(array);
console.log(array.join(";"))

function separateArray(separator) {
    var array = Array.prototype.slice.call(arguments, 1);
    return array.join(separator);
}

console.log(':)  ' + separateArray('|', 'Lancer', "Saber", "Rider", "Ruler"));
