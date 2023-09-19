
//
// start here
//

var triangleCanvas = "#glcanvas";
var rectangleCanvas = "#glCanvasRect";
var rectangleRotCanvas = "#glCanvasRot";
var figureMovCanvas = "#glCanvasMov";


window.onload = function () {

    drawTriangle(triangleCanvas);
    drawRectangle(rectangleCanvas);
    drawAndRotateRect(rectangleRotCanvas);
    moveFigure(figureMovCanvas);

};


function setupWebGL(canvasLoc) {
    const canvas = GetCanvas(canvasLoc);
    var gl = GetGL(canvasLoc);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);

};

function GetGL(canvasLocation) {

    const canvas = document.querySelector(canvasLocation);
    return canvas.getContext('webgl2');

};

function GetCanvas(canvasLocation) { return document.querySelector(canvasLocation) };

var vertexShader =
    'precision mediump float;' +
    'attribute vec2 coordinates;' +
    'attribute vec3 vertColor;' +
    'varying vec3 fragColor;' +
    'void main(void) {' +
    'fragColor = vertColor;' +
    ' gl_Position = vec4(coordinates, 0.0, 1.0);' +
    '}';

var fragmentShader =
    'precision mediump float;' +
    'varying vec3 fragColor;' +
    'void main(void) {' +
    'gl_FragColor = vec4(fragColor, 1.0);' +
    '}';

var vertCodeRot = 'attribute vec3 position;' +
    'uniform mat4 Pmatrix;' +
    'uniform mat4 Vmatrix;' +
    'uniform mat4 Mmatrix;' +
    'uniform mat4 Gmatrix;' +
    'attribute vec3 color;' +
    'varying vec3 vColor;' +

    'void main(void) { ' +
    'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);' +
    'vColor = color;' +
    '}';

var fragCodeRot = 'precision mediump float;' +
    'varying vec3 vColor;' +
    'void main(void) {' +
    'gl_FragColor = vec4(vColor, 1.0);' +
    '}';

var vertCodeMov = 
    'attribute vec4 coordinates;' + 
    'uniform vec4 moving;' + 
    'attribute vec3 color;' + 
    'varying vec3 fragColor;' + 
    'void main(void) {' + 
    'gl_Position = coordinates + moving;' + 
    'fragColor = color;' +
    '}';


var shaders = [vertexShader, fragmentShader, vertCodeRot, fragCodeRot ,vertCodeMov];


function draw(canvasStr, vertices, length, elems) {

    setupWebGL(canvasStr);

    const canvas = GetCanvas(canvasStr);
    var gl = GetGL(canvasStr);

    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);


    gl.shaderSource(vertShader, shaders[0]);
    gl.shaderSource(fragShader, shaders[1]);

    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertShader));
        return;
    }

    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(fragShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'coordinates');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
        positionAttribLocation,
        elems,
        gl.FLOAT,
        false,
        length * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colorAttribLocation,
        length - elems,
        gl.FLOAT,
        false,
        length * Float32Array.BYTES_PER_ELEMENT,
        elems * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);


}

function drawTriangle(canvasLoc) {

    var gl = GetGL(canvasLoc);

    var vertices =
        [
            -0.5, 0.5, 1.0, 1.0, 0.0,
            -0.5, -0.5, 0.0, 1.0, 1.0,
            0.0, -0.5, 1.0, 0.0, 1.0
        ];

    draw(canvasLoc, vertices, 5, 2);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

}

function drawRectangle(canvasLoc) {

    var gl = GetGL(canvasLoc);

    var vertices =
        [
            -0.5, 0.5, 1.0, 1.0, 0.0,
            -0.5, -0.5, 0.0, 1.0, 1.0,
            0.5, -0.5, 0.0, 1.0, 1.0,
            0.5, 0.5, 0.0, 1.0, 0.0
        ];

    var indices = [3, 2, 1, 3, 1, 0];

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    draw(canvasLoc, vertices, 5, 2);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}


function drawAndRotateRect(canvasLoc) {

    var vertices =
        [
            -0.5, 0.5,
            -0.5, -0.5,
            0.5, -0.5,
            0.5, 0.5
        ];

    var indices = [3, 2, 1, 3, 1, 0];

    var colors = [1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0]

    const canvas = GetCanvas(canvasLoc);
    var gl = GetGL(canvasLoc);
    //Create and store data into vertex buffer
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //Create and store data into color buffer
    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    //Create and store data into index buffer
    var index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, shaders[2]);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, shaders[3]);
    gl.compileShader(fragShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");
    var Gmatrix = gl.getUniformLocation(shaderProgram, "Gmatrix");
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    var position = gl.getAttribLocation(shaderProgram, "position");
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);

    var color = gl.getAttribLocation(shaderProgram, "color");
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(color);
    gl.useProgram(shaderProgram);


    function get_projection(angle, a, zMin, zMax) {
        var ang = Math.tan((angle * .2) * Math.PI / 180);
        return [
            0.5 / ang, 0, 0, 0,
            0, 0.5 * a / ang, 0, 0,
            0, 0, -(zMax + zMin) / (zMax - zMin), -1,
            0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
        ];
    }

    var proj_matrix = get_projection(40, canvas.width / canvas.height, 1, 100);
    var mov_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    view_matrix[14] = view_matrix[14] - 6; 

    function rotateZ(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];

        m[0] = c * m[0] - s * m[1];
        m[4] = c * m[4] - s * m[5];
        m[8] = c * m[8] - s * m[9];
        m[1] = c * m[1] + s * mv0;
        m[5] = c * m[5] + s * mv4;
        m[9] = c * m[9] + s * mv8;
    }

    var time_old = 0;
    var animate = function (time) {
        var dt = time - time_old;
        rotateZ(mov_matrix, -dt * 0.0009);
        time_old = time;

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearDepth(1.0);
        setupWebGL(canvasLoc);


        gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
        gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
        gl.uniformMatrix4fv(Gmatrix, false, mov_matrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        window.requestAnimationFrame(animate);
    }
    animate(0);
}

function moveFigure(canvasLoc) {

    setupWebGL(canvasLoc);

    var gl = GetGL(canvasLoc);

    const vertices = 
    [
        0.0, 0.5, 0.5, 0.0, 0.0, -0.5, -0.5, 0.0
    ];
    const colours = 
    [
        1.0, 0.0, 0.0, 
        0.0, 1.0, 0.0, 
        0.0, 0.0, 1.0, 
        1.0, 1.0, 1.0
    ];

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var colourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaders[4]);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaders[1]);
    gl.compileShader(fragmentShader);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    var coordinatesLocation = gl.getAttribLocation(
        program,
        "coordinates"
    );

    gl.vertexAttribPointer(
        coordinatesLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
        );

    gl.enableVertexAttribArray(coordinatesLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);

    var coloursAttributeLocation = gl.getAttribLocation(program, "color");
    
    gl.vertexAttribPointer(coloursAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.enableVertexAttribArray(coloursAttributeLocation);
    

    let initialPositionOfTriangle = 0.0;
    const step = 0.01;
    let directionOfMovementOfTriangle = "down";
    const animate = function () {
        for (let i = 0; i < vertices.length / 2; i++) {
            if (vertices[i * 2 + 1] + initialPositionOfTriangle >= 1) {
                initialPositionOfTriangle = 1.0 - vertices[i * 2 + 1];
            }
            if (vertices[i * 2 + 1] + initialPositionOfTriangle <= -1) {
                initialPositionOfTriangle = -1.0 - vertices[i * 2 + 1];
            }
        }
        const moving = gl.getUniformLocation(program, "moving");
        gl.uniform4f(moving, 0.0, initialPositionOfTriangle, 0.0, 0.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
        
        for (let i = 0; i < vertices.length / 2; i++) {
            if (vertices[i * 2 + 1] + initialPositionOfTriangle === -1) {
                directionOfMovementOfTriangle = "up";
            } else if (vertices[i * 2 + 1] + initialPositionOfTriangle === 1) {
                directionOfMovementOfTriangle = "down";
            }
        }
        initialPositionOfTriangle =
            directionOfMovementOfTriangle === "up"
                ? initialPositionOfTriangle + step
                : initialPositionOfTriangle - step;
        window.requestAnimationFrame(animate);
    };
    animate(0);
}



