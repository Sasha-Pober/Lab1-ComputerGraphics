
//
// start here
//
function main() {

    const canvas = document.querySelector("#glcanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    var vertices = 
        [
            -0.5, 0.5,  1.0, 1.0, 0.0,
            -0.5, -0.5, 0.0, 1.0, 1.0,
            0.0, -0.5,  1.0, 0.0, 1.0
        ];

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }

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


    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertShader, vertexShader);
    gl.shaderSource(fragShader, fragmentShader);

    gl.compileShader(vertShader);
    if( !gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertShader));
        return;
    }

    gl.compileShader(fragShader);
    if( !gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)){
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
        2,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);

}






