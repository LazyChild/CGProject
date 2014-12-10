/**
 * Computer Graphics Course Project 1.
 * Polygon filling.
 *
 * @author Renyu Liu & Yifan Li
 */

document.addEventListener("DOMContentLoaded", function () {

    var writeMessage = function (canvas, message) {
        var context = canvas.getContext('2d');
        context.font = '20px Calibri';
        context.fillStyle = 'black';

        var size = context.measureText(message);
        context.clearRect(10, 0, size.width, 30);
        context.fillText(message, 10, 25);
    };

    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(canvas, message);
    }, false);

    var points = [];
    canvas.addEventListener('click', function (evt) {
        var point = getMousePos(canvas, evt);
        if (points.length > 0) {
            drawLine(context, copy(point), copy(points[points.length - 1]));
        }
        points.push(point);
    });

    var clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', function (evt) {
        points = [];
        border = {x0: canvas.width, x1: 0, y0: canvas.height, y1: 0};
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    var closeButton = document.getElementById('close');
    closeButton.addEventListener('click', function (evt) {
        if (points.length > 1) {
            drawLine(context, copy(points[0]), copy(points[points.length - 1]));
        }
    });

    var fillButton = document.getElementById('fill');
    fillButton.addEventListener('click', function (evt) {
        drawPolygon(canvas, points);
    });
});
