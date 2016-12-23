/**
 * Created by Bain on 12/20/2016.
 */
Zoomer = function () {
}

Zoomer.prototype.createCanvas = function ($img) {
    this.$img = $img;
    this.$img.css({
        "position": "absolute",
        "left": 0,
        "top": 0,
        "width": $img.width(),
        "height": $img.height()
    });

    this.$parent = $("<div/>");
    // this.$img.appendTo(this.$parent);
    this.$parent.css({
        "position": "relative",
        "display": "block",
        "overflow": "hidden",
        "padding": 0,
        "margin": 0,
        "width": $img.width(),
        "height": $img.height()
    });
    $img.before(this.$parent);
    $img.appendTo(this.$parent);

    var canvas = $("<canvas/>");
    canvas.width($img.width());
    canvas.height($img.height());
    canvas.css({
        "position": "absolute",
    });

    canvas.hover(function () {
        $(this).css("cursor", "move");
    });

    canvas.offset({
        left: 0,
        top: 0
    });
    canvas.appendTo($img.parent());
    this.$canvas = canvas;
    this.$canvas.attr("_width", $img.width());
    this.$canvas.attr("_height", $img.height());
    this.$canvas.attr("id", "XZOOMER")
    this.init();
}

Zoomer.prototype.findOtherCanvas = function () {
    var self = this;
    var $canvases = this.$parent.parent().find("canvas");
    return $.grep($canvases, function (canvas) {
        return canvas !== self.$canvas[0];
    });
}

Zoomer.prototype.rest = function () {
    this.$canvas.hide();
}

Zoomer.prototype.wake = function () {
    this.$canvas.show();
}

Zoomer.prototype.removeDrag = function () {
    $(this).off("mousemove", this.mouseMoveListener)
        .off("mouseup", this.mouseUpListener);
}

Zoomer.prototype.move = function (moveX, moveY) {
    var $img = this.$img;
    if (moveX > 0) {
        moveX = 0;
    } else if ($img.width() + moveX - this.$canvas.attr('_width') < 0) {
        moveX = this.$canvas.attr('_width') - $img.width();
    }
    if (moveY > 0) {
        moveY = 0;
    } else if ($img.height() + moveY - this.$canvas.attr('_height') < 0) {
        moveY = this.$canvas.attr('_height') - $img.height();
    }
    $img.css({
        "left": moveX,
        "top": moveY
    });
    this.wheelOtherCanvases($img.position().left, $img.position().top, $img.width(), $img.height());
}

Zoomer.prototype.mouseDown = function () {
    var self = this;
    this.$canvas.mousedown(function (downEvent) {
        downEvent.preventDefault();
        var offsetX = self.$img.position().left;
        var offsetY = self.$img.position().top;
        console.log(offsetX + " " + offsetY);
        $(document).mousemove(function (e) {
            e.preventDefault();
            var moveX = offsetX + e.pageX - downEvent.pageX;
            var moveY = offsetY + e.pageY - downEvent.pageY;
            self.move(moveX, moveY);
        }).mouseup(self.removeDrag);
    });
}


Zoomer.prototype.mouseWheel = function () {
    var self = this;
    this.$canvas.on("wheel", function (e) {
        var deltaY = 0;
        e = e.originalEvent;
        e.preventDefault();

        if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
            deltaY = e.deltaY;
        } else if (e.wheelDelta) {
            deltaY = -e.wheelDelta;
        }

        var $this = $(this);
        var $img = self.$img;

        var rect = $img[0].getBoundingClientRect();
        var offsetX = e.pageX - rect.left - window.pageXOffset;
        var offsetY = e.pageY - rect.top - window.pageYOffset;

        var imgCursorX = offsetX - $img.position().left;
        var imgCursorY = offsetY - $img.position().top;

        var ratioX = imgCursorX / $img.width();
        var ratioY = imgCursorY / $img.height();

        console.log(imgCursorX, imgCursorY, ratioX, ratioY);

        var width;
        var height;
        if (deltaY < 0) {
            width = $img.width() * 1.1;
            if (width > $img.prop('naturalWidth')) {
                width = $img.prop('naturalWidth');
                height = $img.prop('naturalHeight');
            } else {
                height = $img.height() * 1.1;
            }
        } else {
            width = $this.attr("_width") > $img.width() * 0.9 ? $this.attr("_width") : $img.width() * 0.9;
            height = $this.attr("_height") > $img.height() * 0.9 ? $this.attr("_height") : $img.height() * 0.9;
        }
        $img.width(width);
        $img.height(height);

        var moveToX = offsetX - width * ratioX;
        var moveToY = offsetY - height * ratioY;
        self.move(moveToX, moveToY);
    })
}

Zoomer.prototype.wheelOtherCanvases = function (left, top, width, height) {
    var self = this;
    $.each(this.$otherCanvases, function (index) {
        $(this).css({
            "left": left,
            "top": top,
            "width": width,
            "height": height
        });
        $(this).attr("width", width);
        $(this).attr("height", height);

        // var ratio = width / self.$canvas.attr("_width");
        // var ctx = this.getContext("2d");
        // ctx.scale(ratio, ratio);
        // ctx.transform(ratio, 0, 0, ratio, left, top);
        // $(this).attr("_scale", ratio);
    });
}

Zoomer.prototype.init = function () {
    this.$otherCanvases = this.findOtherCanvas();
    this.$canvas.before(this.$otherCanvases);
    this.mouseDown();
    this.mouseWheel()
}

window.zoomer = new Zoomer();