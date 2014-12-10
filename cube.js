var rotate2D = function (p, degree) {
    return {
        x: p.x * Math.cos(degree) - p.y * Math.sin(degree),
        y: p.x * Math.sin(degree) + p.y * Math.cos(degree)
    };
};

/**
 * The rotate a point according to one axis.
 *
 * @param p - the original point
 * @param axis - one of the three axises
 * @param degree - the rotation degree
 * @returns {*} - the rotated point
 */
var rotate = function (p, axis, degree) {
    var t;
    if (axis.x > 0) {
        t = rotate2D({x: -p.z, y: p.y}, degree);
        return {x: p.x, y: t.y, z: -t.x};
    } else if (axis.y > 0) {
        t = rotate2D({x: p.x, y: -p.z}, degree);
        return {x: t.x, y: p.y, z: -t.y};
    } else if (axis.z > 0) {
        t = rotate2D({x: p.x, y: p.y}, degree);
        return {x: t.x, y: t.y, z: p.z};
    }
    return p;
};

var scale = function (p, scalar) {
    return {
        x: p.x * scalar,
        y: p.y * scalar,
        z: p.z * scalar
    };
};

var Cube = function (r) {
    this.r = r;

    // 8 vertexes
    this.points = [];
    this.points.push({x: +r, y: +r, z: +r});
    this.points.push({x: -r, y: +r, z: +r});
    this.points.push({x: -r, y: -r, z: +r});
    this.points.push({x: +r, y: -r, z: +r});
    this.points.push({x: +r, y: +r, z: -r});
    this.points.push({x: -r, y: +r, z: -r});
    this.points.push({x: -r, y: -r, z: -r});
    this.points.push({x: +r, y: -r, z: -r});

    // 6 surfaces
    this.surfaces = [];
    this.surfaces.push({v: [0, 1, 2, 3], color: {r: 255, g: 0, b: 0}});
    this.surfaces.push({v: [0, 1, 5, 4], color: {r: 0, g: 255, b: 0}});
    this.surfaces.push({v: [3, 0, 4, 7], color: {r: 0, g: 0, b: 255}});
    this.surfaces.push({v: [4, 5, 6, 7], color: {r: 0, g: 255, b: 255}});
    this.surfaces.push({v: [3, 2, 6, 7], color: {r: 255, g: 0, b: 255}});
    this.surfaces.push({v: [2, 1, 5, 6], color: {r: 255, g: 255, b: 0}});

    /**
     * Rotate the cubic according to given axis and degree.
     *
     * @param axis - the axis
     * @param degree - the degree to be rotate
     */
    this.rotate = function (axis, degree) {
        for (var i = 0; i < this.points.length; ++i) {
            this.points[i] = rotate(this.points[i], axis, degree);
        }
    };

    this.resize = function (radius) {
        for (var i = 0; i < this.points.length; ++i) {
            this.points[i] = scale(this.points[i], radius / this.r);
        }
        this.r = radius;
    };

    this.draw = function (canvas) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        var center = {x: canvas.width / 2, y: canvas.height / 2};

        for (var i = 0; i < this.surfaces.length; ++i) {
            var surface = this.surfaces[i];
            var points = [];
            var sumZ = 0;
            for (var j = 0; j < surface.v.length; ++j) {
                var point = this.points[surface.v[j]];
                points.push({x: Math.floor(point.x + center.x), y: Math.floor(point.y + center.y)});
                sumZ += point.z;
            }
            if (sumZ > 0) {
                drawPolygon(canvas, points, surface.color);
            }
        }
    };
};
