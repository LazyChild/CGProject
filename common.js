var drawPixel = function (context, p, color) {
    // uses the canvas api
    if (color) {
        context.fillStyle = "rgb(" + color.r + "," +color.g + "," + color.b + ")";
    } else {
        context.fillStyle = "black";
    }
    context.fillRect(p.x, p.y, 1, 1);
};

var swap = function (p0, p1) {
    var temp = {x: p0.x, y: p0.y};
    p0.x = p1.x;
    p1.x = temp.x;
    p0.y = p1.y;
    p1.y = temp.y;
};

var swapXY = function (p) {
    return {x: p.y, y: p.x};
};

var copy = function (p) {
    return {x: p.x, y: p.y};
};


var getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};
