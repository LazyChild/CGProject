# 计算机图形学 课程项目

## 简介
本次课程项目由两部分组成，第一部分是多边形区域填充，第二部分是3D立方体展示。

## 人员
- 刘仁宇 (11300240061)
- 李一帆 (11300240084)
- 周光朕 (11300240019)

## 环境
考虑到跨平台部署的方便性，本次课程项目使用纯`HTML5`进行开发。这样可以免去编译等琐碎的细节。

开发过程中测试过的浏览器有：

- Chrome 39
- Safari 8.0

主要使用了其中`Canvas`画布的功能。

只调用了其中像素级别的`API`，其余全部功能均为手工实现。

## 项目结构
- `common.js` 一些复用的工具方法。
- `style.css` 程序界面样式定义。
- `pj1.html` 多边形区域填充的程序入口。
- `pj1.js` 多边形区域填充的程序控制。
- `polygon.js` 画线、多边形区域填充算法实现。
- `pj2.html` 3D立方体旋转的程序入口。
- `pj2.js` 3D立方体旋转的程序控制。
- `cube.js` 3D立方体、旋转缩放等算法实现。


## 运行
### 多边形区域填充
打开`pj1.html`以运行多边形区域填充的程序。

在画布上点击以添加新的顶点，添加完毕所有顶点之后点击`Close`按钮，将多边形区域封闭。然后点击`Fill`按钮填充整个区域。`Clear`按钮可以清空整个画布。

### 3D立方体旋转
打开`pj2.html`以运行3D立方体旋转的程序。

拖动屏幕右边的滑动条以缩放立方体。分别按`x`,`y`,`z`键可以沿着相应的轴进行转动。

## 算法
### 多边形区域填充
#### 画线
采用了`Bresenham`算法。

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

#### 区域填充
采用了扫描线算法。

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

### 3D立方体旋转

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

#### 画立方体
立方体在屏幕上显示`xy`平面的投影。投影后确定显示的面（后面提到），然后用之前的多边形区域填充算法画出相应的四边形。

#### 确定显示的面
因为显示的是`xy`平面的投影，所以如果一个平面的法向量和`z`轴的夹角小于`90°`则这个平面是被遮挡住的，不会显示在屏幕上。由于平面是四边形，法向量可以直接相加四个点所得，如果`z`方向上的值大于`0`则对该平面进行绘制。

#### 旋转
确定旋转的坐标轴之后可以把问题降到两维，于是用旋转矩阵计算出一个点转过一个角度`theta`之后的新坐标即可。

`(x',y')=(x * cos(theta) - y * sin(theta), x * sin(theta) + y * cos(theta))`
