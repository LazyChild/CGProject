/**
 * Computer Graphics Course Project 2.
 * Rotating Cube.
 *
 * @author Renyu Liu & Yifan Li
 */

document.addEventListener("DOMContentLoaded", function () {

    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var radius = 80;

    var randomDegree = function () {
        return (Math.floor(Math.random() * 360) - 180) * Math.PI / 180;
    };

    var cube = new Cube(radius);
    // Random initial positions
    cube.rotate({x: 1, y: 0, z: 0}, randomDegree());
    cube.rotate({x: 0, y: 1, z: 0}, randomDegree());
    cube.rotate({x: 0, y: 0, z: 1}, randomDegree());
    cube.draw(canvas);

    window.addEventListener('keydown', function (evt) {
        var axis;
        switch (evt.keyCode) {
            case 88:
                // x
                axis = {x: 1, y: 0, z: 0};
                break;
            case 89:
                // y
                axis = {x: 0, y: 1, z: 0};
                break;
            case 90:
                // z
                axis = {x: 0, y: 0, z: 1};
                break;
            default:
                break;
        }

        cube.rotate(axis, Math.PI / 180);
        cube.draw(canvas);
    });

    var sizeRange = document.getElementById('sizeRange');
    sizeRange.addEventListener('change', function (evt) {
        var newRadius = parseInt(sizeRange.value);
        cube.resize(newRadius);
        cube.draw(canvas);
    });
});
