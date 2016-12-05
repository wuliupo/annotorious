/**
 * Created by Bain on 12/2/2016.
 */
function loop_print() {
    // Synatax
    function* idMaker() {
        yield -3;
        yield -2;
        yield -1;
        var index = 0;
        while (true)
            yield index++;
    }

    var gen = idMaker();

    for (var i = 0; i < 10; i++)
        console.log(gen.next().value);
}

function sending_values_to_the_generator() {
    function* gen() {
        var i = 0;
        while (true) {
            var value = yield 100;
            i++;
            console.log(value)
        }
    }

    var g = gen();
    console.log(g.next(1));
    console.log(g.next(2));
    console.log(g.next(3));

}

function yield_to_delegate_to_another_generator() {
    function* g1() {
        yield 2;
        yield 3;
    }

    function* g2() {
        yield 1;
        yield* g1();
        yield* "4";
        yield 5;
        yield* [6, 7];

    }

    var iterator = g2();
    for (var i = 0; i < 10; i++) {
        console.log(iterator.next());
    }
}

function yield_throw() {
    function* gen() {
        var x;
        while (true) {
            try {
                x = yield 42;
                console.log(1 / y);
            } catch (e) {
                console.log("Error caught! " + e.message);
                break;
            }
        }
        return x;
    }

    var g = gen();
    console.log(g.next());
    console.log(g.next(66))
    // console.log(g.throw(new Error("Someting went wrong")));
}

function yield_return() {
    function* gen() {
        yield 1, 2, 3;
        yield 4;
        yield 5;
    }

    var g = gen();
    console.log(g.next());
    console.log(g.next());
    console.log(g.return("foo"));
}
function legacy_generator() {
    function* gen() {
        var next = 0;
        while (true) {
            var t = yield next++;
            console.log("t=" + t);
            if (next > 10 || t > 10) {
                break;
            }
        }
        return 100;
    }

    var g = gen();
    var done = false;
    console.log(g.next(1));
    console.log(g.next(3));

    do {
        var next = g.next();
        if (next.value == 8) {
            next = g.next(11);
        }
        done = next.done;
        console.log(next.value);
    } while (!done)

}
function passing_arguments_into_generators() {
    function* logGenerator() {
        console.log(yield);
        console.log(yield);
        console.log(yield);
    }

    var gen = logGenerator();
    console.log(gen.next());
    gen.next('Bain');
    gen.next("Andrian");
    gen.next("Shawn");
    console.log(gen.next("None"));
}
// loop_print()legacy_generator;
// sending_values_to_the_generator();
// yield_to_delegate_to_another_generator();
// yield_throw();
// yield_return();
// legacy_generator();
passing_arguments_into_generators();