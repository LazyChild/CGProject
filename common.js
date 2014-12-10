var drawPixel = function (context, p) {
    // uses the canvas api
    context.fillStyle = "black";
    context.fillRect(p.x, p.y, 1, 1);
};

var getPixel = function (context, p) {
    var data = context.getImageData(p.x, p.y, 1, 1).data;
    return data[0] || data[1] || data[2] || data[3];
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
