
var drawLine = function (context, p0, p1) {
    // Bresenham Algorithm
    var steep = Math.abs(p1.y - p0.y) > Math.abs(p1.x - p0.x);
    if (steep) {
        p0 = swapXY(p0);
        p1 = swapXY(p1);
    }
    if (p0.x > p1.x) {
        swap(p0, p1);
    }

    var dx = p1.x - p0.x;
    var dy = Math.abs(p1.y - p0.y);
    var k = dy / dx;
    var e = -0.5;
    var p = {x: p0.x, y: p0.y};

    var ystep = p0.y < p1.y ? 1 : -1;

    for (var i = 0; i <= dx; ++i) {
        drawPixel(context, steep ? swapXY(p) : p);

        ++p.x;
        e += k;
        if (e >= 0) {
            p.y += ystep;
            e -= 1;
        }
    }
};

var setPixel = function (pixels, border, point) {
    var x = point.x - border.x0;
    var y = point.y - border.y0;

    var pos = (y * (border.x1 - border.x0 + 1) + x) * 4;
    pixels[pos + 3] = 255;
};

var initEdgeTable = function (border, points) {
    var edgeTable = {};

    var n = points.length;
    for (var i = 0; i < n; ++i) {
        var p1 = points[i];
        var p2 = points[(i + 1) % n];
        var p3 = points[(i + n - 1) % n];
        var p4 = points[(i + 2) % n];

        if (p1.y !== p2.y) {
            var node = {};
            node.k = (p1.x - p2.x) / (p1.y - p2.y);
            if (p2.y > p1.y) {
                node.x = p1.x;

                if (p4.y >= p2.y) {
                    node.yMax = p2.y - 1;
                } else {
                    node.yMax = p2.y;
                }

                if (!edgeTable.hasOwnProperty(p1.y)) {
                    edgeTable[p1.y] = [];
                }
                edgeTable[p1.y].push(node);
            } else {
                node.x = p2.x;

                if (p3.y >= p1.y) {
                    node.yMax = p1.y - 1;
                } else {
                    node.yMax = p1.y;
                }

                if (!edgeTable.hasOwnProperty(p2.y)) {
                    edgeTable[p2.y] = [];
                }
                edgeTable[p2.y].push(node);
            }
        }
    }

    return edgeTable;
};


var comparator = function (a, b) {
    return a.x - b.x;
};

var scanLineFill = function (border, edgeTable, pixels) {
    var activeEdgeTable = [];

    for (var y = border.y0; y <= border.y1; ++y) {
        var i;
        if (edgeTable.hasOwnProperty(y)) {
            for (i = 0; i < edgeTable[y].length; ++i) {
                activeEdgeTable.push(edgeTable[y][i]);
            }
        }

        activeEdgeTable.sort(comparator);

        var parity = 0;
        for (i = 0; i < activeEdgeTable.length - 1; ++i) {
            parity = 1 - parity;
            if (parity !== 0) {
                var fromX = Math.ceil(activeEdgeTable[i].x);
                var toX = Math.floor(activeEdgeTable[i + 1].x);
                for (; fromX <= toX; ++fromX) {
                    setPixel(pixels, border, {x: fromX, y: y});
                }
            }
        }

        var newAET = [];
        for (i = 0; i < activeEdgeTable.length; ++i) {
            var node = activeEdgeTable[i];
            if (node.yMax !== y) {
                node.x += node.k;
                newAET.push(node);
            }
        }
        activeEdgeTable = newAET;
    }
};

var fillPolygon = function (context, border, points) {
    var imageData = context.getImageData(border.x0, border.y0, border.x1 - border.x0 + 1, border.y1 - border.y0 + 1);
    var pixels = imageData.data;

    // Scan Line Polygon Filling Algorithm

    var edgeTable = initEdgeTable(border, points);
    scanLineFill(border, edgeTable, pixels);

    context.putImageData(imageData, border.x0, border.y0);
};
