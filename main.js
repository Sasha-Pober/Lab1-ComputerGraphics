
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
            -0.5, -0.5, 0.7, 0.0, 1.0,
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
  //Attach vertex shader source code
//   gl.shaderSource(vertShader, vertexShader);
//   //Compile the vertex shader
//   gl.compileShader(vertShader);


//   // Create fragment shader object
//   var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
//   // Attach fragment shader source code
//   gl.shaderSource(fragShader, fragmentShader);
//   // Compile the fragment shader
//   gl.compileShader(fragShader);


//   // Create a shader program object to store combined shader program
//   var shaderProgram = gl.createProgram();
//   // Attach a vertex shader
//   gl.attachShader(shaderProgram, vertShader);
//   // Attach a fragment shader
//   gl.attachShader(shaderProgram, fragShader);
//   // Link both programs
//   gl.linkProgram(shaderProgram);
//   // Use the combined shader program object
//   gl.useProgram(shaderProgram);


//   /* Step 4: Associate the shader programs to buffer objects */
//   //Bind vertex buffer object
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   //Get the attribute location
//   var coord = gl.getAttribLocation(shaderProgram, "coordinates");
//   //point an attribute to the currently bound VBO
//   gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
//   //Enable the attribute
//   gl.enableVertexAttribArray(coord);


//   /* Step5: Drawing the required object (triangle) */
//   // Clear the canvas
//   gl.clearColor(0.5, 0.5, 0.5, 0.9);
//   // Enable the depth test
//   gl.enable(gl.DEPTH_TEST);
//   // Clear the color buffer bit
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   // Set the view port
//   gl.viewport(0,0,canvas.width,canvas.height);
//   // Draw the triangle
//   gl.drawArrays(gl.TRIANGLES, 0, 3);






