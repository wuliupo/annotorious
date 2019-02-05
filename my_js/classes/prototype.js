/**
 * Created by Bain on 12/5/2016.
 */
function level_1() {
    var Obj = function (name, desc) {
        this.name = name;
        this.desc = desc;
        this.mow = function () {
            console.log('MOW~~ ' + this.name);
        };
    }

    var obj = new Obj('Bain', 'Coder');
    console.log(obj);
    console.log(obj.name + " is a " + obj.desc);
    obj.mow();

    Obj.prototype.show = function () {
        console.log('Show: ' + this.name + " is a " + this.desc);
    }
    obj.show();

    Obj.prototype['change'] = Obj.prototype.show;
    obj.change();

    Obj.take = function () {
        console.log(this.name + " becomes a " + this.desc);
    };

    console.log(Obj.prototype['change']);
    console.log(Obj.show);
    console.log('name ' + Obj.name);
    console.log('name ' + Obj.prototype.name);
    console.log(Obj.prototype.change);
    console.log(Obj.prototype['change'] === Obj.prototype.show);
    console.log(Obj.prototype.show === Obj.prototype.name)
    Obj.take();
    obj.create = function () {
        console.log(this.name + " create a lot of " + this.desc);
    };
    obj.create();
    obj.change();
    obj.show();
}

function level_2() {
    console.log("level 2 ________________________");
    var B = function () {
        this.x = function () {
            console.log('i')
        };
    };

    B.prototype.updateX = function (value) {
        B.prototype.x = function () {
            console.log(value);
        };
    };

    B.prototype.updateThisX = function (value) {
        this.x = function () {
            console.log(value);
        };
    };

    var b1 = new B();
    var b2 = new B();
    b1.x();
    b2.x();

    b1.updateX('x');
    b1.x();
    b2.x();

    b1.updateThisX('This x');
    b1.x();
    b2.x();
}
level_2();

(function level_3() {
    console.log('level_3 _________________________');

    var B = function () {
    };

    B.prototype.x = function () {
        console.log("X");
    };

    B.prototype.updateX = function (value) {
        B.prototype.x = function () {
            console.log(value);
        };
    };

    B.prototype.xx = function () {
        console.log("↓");
        this.x();
        console.log("↑");
    }

    var b1 = new B();
    var b2 = new B();
    b1.x();
    b2.x();

    b1.updateX('XXX');
    b1.x();
    b2.x();

    b2.xx();
})();


