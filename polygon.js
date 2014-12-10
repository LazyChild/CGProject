/**
 * Draw a line from p0 to p1 using Bresenham Algorithm.
 *
 * @param context - the context to draw
 * @param p0 - first point
 * @param p1 - second point
 * @param color - the RGB color
 */
var drawLine = function (context, p0, p1, color) {
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

    var yStep = p0.y < p1.y ? 1 : -1;

    for (var i = 0; i <= dx; ++i) {
        drawPixel(context, steep ? swapXY(p) : p, color);

        ++p.x;
        e += k;
        if (e >= 0) {
            p.y += yStep;
            e -= 1;
        }
    }
};

var setPixel = function (pixels, border, point, color) {
    var x = point.x - border.x0;
    var y = point.y - border.y0;

    var pos = (y * (border.x1 - border.x0 + 1) + x) * 4;
    if (color) {
        pixels[pos + 0] = color.r;
        pixels[pos + 1] = color.g;
        pixels[pos + 2] = color.b;
    }
    pixels[pos + 3] = 255;
};

/**
 * According to the textbook, we need to init the edge table first according to y-Axis.
 *
 * @param border - the border of this polygon
 * @param points - the points of this polygon
 * @returns {{}} - the edge table
 */
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

/**
 * Use scan line [y-min, y-max], maintain the active edge table and fill all necessary pixels.
 *
 * @param border - the border
 * @param edgeTable - the global edge table
 * @param pixels - the pixels vector
 * @param color - the RGB color
 */
var scanLineFill = function (border, edgeTable, pixels, color) {
    var activeEdgeTable = [];

    for (var y = border.y0; y <= border.y1; ++y) {
        var i;
        // Add new edges
        if (edgeTable.hasOwnProperty(y)) {
            for (i = 0; i < edgeTable[y].length; ++i) {
                activeEdgeTable.push(edgeTable[y][i]);
            }
        }
        activeEdgeTable.sort(comparator);

        // Fill each segments
        var parity = 0;
        for (i = 0; i < activeEdgeTable.length - 1; ++i) {
            parity = 1 - parity;
            if (parity !== 0) {
                var fromX = Math.ceil(activeEdgeTable[i].x);
                var toX = Math.floor(activeEdgeTable[i + 1].x);
                for (var x = fromX; x <= toX; ++x) {
                    setPixel(pixels, border, {x: x, y: y}, color);
                }
            }
        }

        // Remove edges which y-max is out of range
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

var fillPolygon = function (context, border, points, color) {
    var imageData = context.getImageData(border.x0, border.y0, border.x1 - border.x0 + 1, border.y1 - border.y0 + 1);
    var pixels = imageData.data;

    // Scan Line Polygon Filling Algorithm

    var edgeTable = initEdgeTable(border, points);
    scanLineFill(border, edgeTable, pixels, color);

    context.putImageData(imageData, border.x0, border.y0);
};

var drawPolygon = function (canvas, points, color) {
    var context = canvas.getContext("2d");
    var border = {x0: canvas.width, x1: 0, y0: canvas.height, y1: 0};
    for (var i = 0; i < points.length; ++i) {
        var point = points[i];
        drawLine(context, copy(point), copy(points[(i + 1) % points.length]), color);

        if (point.x < border.x0) {
            border.x0 = point.x;
        }
        if (point.x > border.x1) {
            border.x1 = point.x;
        }
        if (point.y < border.y0) {
            border.y0 = point.y;
        }
        if (point.y > border.y1) {
            border.y1 = point.y;
        }
    }
    fillPolygon(context, border, points, color);
};
