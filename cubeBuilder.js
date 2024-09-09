/* 
Nathan Glarbando

5/15/24
ok so we'll need a function for translating the cube, rotating the cube, and projecting the cube.
This can all be done via matrix multiplication of a 3d point (3d vector) and a transformation matrix.
different types of transformations (not projections)
  roll
  pitch
  yaw
  shifting
  shearing ?
OKAY so the different types of rotation (roll, pitch, yaw) can all be combined into ONE transformation matrix in order to reduce function calls and calculations/

also, I don't think we need an object for a 2D point, we can just take the x and y coords of a 3d point
ALSO also, a cube can be represented as a 2d array (matrix) that holds the vectors containing the coords of each vertex of the cube. (3x8 matrix)
This way, we can do (3x3) * (3x8) matrix multiplication in order to rotate the whole cube within one function, simplyfing code.

TESTING NOTES/UPDATE (5/15/24, 14:44)
- Rotation function implemented.
- Input for rotation degrees implemented for easier testing.
- There is unwanted shearing when rotating the cube in certain ways, trying to figure out cause of it
    - No shearing when rotating about x axis.
        - (90, 0, 0) and (45, 0, 0) used for testing.
    - No shearing when rotating about y axis.
        - (0, 90, 0) and (0, 45, 0) used for testing.
    - No shearing when rotating aout z axis.
        -(0, 0, 90) and (0, 0, 45) used for testing.
- Shearing must be a result of rotation about more than one axis. :(
    - Testing with various angles of different axes:
        - (90, 90, 90)
            - shearing error
        - (90, 90, 0)
            - no errors
        - (90, 0, 90)
            - error: no rotation happened at all
            - note: negative zeroes were present in the rotated matrix
        - (0, 90, 90)
            - Big error lol: produced a square
            - there were duplicates of vectors
            - output matrix looked like this:
            - [
                [0,0,0]
                [0,0,0]
                [-1,0,0]
                [-1,0,0]
                [0,0,-1]
                [0,0,-1]
                [-1,0,-1]
                [-1,0,-1]
            ]
    - soooooo this is probably an error to do with rotation along the z axis
    - FOUND IT: one of the sines in the rotation matrix should've been a cosine (it was such an itty bitty error >:((((()
    - rotation with (90, 90, 90) now works as expected, bug fixed :)
    - (0, 45, 45) provides some interesting results, different from what I expected.
            - However, I think this is a flaw on my end of thinking
            - no shearing detected, I believe the cube is rotated correctly.
    
    UPDATE (5/15/24, 18:50)
    - rotateCube() changed to rotateShape() and should now work for any 3d shape.
    UPDATE (5/15/24, 21:07)
    - actual despair
    - improved input and output code, now using innerHTML instead of document.write() (this is very nice actually hooray !!!!!!)
    - for some reason, rotating the shape just does not work at all anymore :'(
    UPDATE (5/15/24, 21:22)
    - fixed it, it has to do with delcaration of "newMatrix" in rotateShape().
    UPDATE (5/15/24, 22:01)
    - implemented centerShape() function that should work with any shape in any position.
    UPDATE (5/15/24, 22:20)
    - messed around with different inputs for a while, rotation logic seems to be working fine
        - "ran various tests" type shi
    - verified stuff on desmos 3d graphing calculator
    = I thiiiiiink back end is pretty much done, now I'll just have to start work on front end stuff :(
    - I think I first wanna start with just displaying something
    - and then maybe after that I'll try to draw lines between each vertex ? Or maybe that can come last idk.
    - cuz like if I can move the vertices around like I want to, then lines shouldn't be a problem.
        - lines will just be nicer to look at I guess lol
        - "completes" the cube I guess.
    
    MOUSE IMPLEMENTATION (5/17/24 7:59)
    using what we learned from mouseTester, let's apply mouse tracking to the cube rotation code.
    It won't really be possible to turn the cube like a knob just using a 2d screen, so mouse position will only be affecting angles gamma and beta.
    Once velocity/momentum is implemented, then I think alpha will be affected ? Not really sure but that's for the future.
    What I want to implement:
    - Cube rotation responding to mouse position
    - Edge table for shape edges (this will be pretty simple)

    cube rotation related to mouse position implemented (5/17/24 8:13 (wow that was pretty straightforward))
    now to create edge table but I think I'm gonna eat breakfast first.

    jk made the edge table (5/17/24 8:20)
    - got too lazy to make breakfast and made edge table instead.
    - I think actually after breakfast I can try to start plotting the points on some sort of grid.
    - WAIT what if each vertex is a button and the button's coords change accordingly.
    - ALSO I think I can maybe improve computing time by getting rid of the z rotation component of the rotational matrix.

    UPDATE (5/17/24 11:41)
    Implemented a scaling slider that changes the size of the shape.

    UPDATE (5.17.24 16:08) I DID IT
    cube is now on screen and rotates with respect to the mouse cursor in relation to the window
    - implemented weak perspective
    - implemented boogie button and boogie mode 
    - now I just gotta put the lines in

    5/24/24 IM BACK
    time to implement lines baby
    see notes in "linesCode.js"

    5/24/24 11:41 lines :(
    - ok so I got lines drawing, but they're in the wrong place and I just realized that they don't delete
    - so now I have 120 lines being drawn every second and they don't disappear.
        - this is kind of a problem kinda I htink this might be a problem maybe just maybe.

    5/24/24 11:47 idea
    - I looked online for solutions and may e I can mess around with z-index for thingys I make in the html file? not sure
    - I will have to experiment with this later, I must clean the bathroom today.

    5/24/24 12:16 I PROCRASTINATED BATHROOM CLEANING
    - it works !!! kinda
    - An accurate wireframe is drawn and rotates correctly along with the vertices
        - all the edges are connected !
    - issue: it doesn't erase the previous lines
        - luckily I found a stack overflow page that has this exact problem
    - other issue: I didn't really solve the overlay problem, I just got rid of some stuff.

    5/24/24 12:28 LETS GOOOOOO
    - got lines bby >:))))))))
    - now I just have to figure out how to overlay the canvas so that text doesn't interfere with it.

    5/24/24 18:50 
    - solved canvas overlay problem, just did style = position: absolute; z-index: -1

    5/25/24 20:19
    - reimplemented control for cube, smoother transition between boogie and control

    5/25/24 21:03
    - can now click to toggle boogie mode

    5/25/24 21:42
    - ok I think I'm done with this, I don't really have anything else big I want to add and other coding things seem interesting to me.
    - If I return to this then it'll be a while
*/

/**
 * Function to rotate a cube on the x,y,z axis by a given amount of degrees(x = roll => gamma, y = pitch => beta, z = yaw => alpha).
 * Note: there's no need to create a 2d array representing the transformation matrix, we can just do the raw calculations here.
 *      EDIT: sike nah boy I'm gonna make a 2d array anyways cuz it simplifies code.
 * Note: these transformations will rotate it around the origin. We will have to do something so that it rotates around its center.
 *       That's for later though lol. I'm thinking about shifting it back to where it originally was by using a shifting funciton.
 *       I think find the central point of the cube, and then after it's rotated, find it's new central point and move it back to its original central point.
 *       This movement can be applied to all points, thus shifting the cube back to its original place, thus undoing the displacement without undoing the rotation (hopefully).
 * Note: I will have to convert input degrees into radians for Math.sin/Math.cos functions. Formula for this is: angle * (pi/180).
 * @param {*} gamma the  amount of degrees the cube should be rotated about the x axis.
 * @param {*} beta the amount of degrees the cube should be rotated about the y axis.
 * @param {*} alpha the amount of degrees should be rotated about the z axis.
 * @param {*} shapeMatrix the matrix containing all the coords of the vertices of the current cube.
 */
function rotateShape(gamma, beta, alpha, shapeMatrix) {
    //hard coded for shapes with 8 points
    let newMatrix = [[],[],[],[],[],[],[],[]]; //output
    let tempStr = "";

    tempStr += "Rotation Matrix for " + gamma.toFixed(2) + ", " + beta.toFixed(2) + ", " + alpha.toFixed(2) + ":<br>";

    //converting degrees to radians
    gamma *= (Math.PI / 180);
    beta *= (Math.PI / 180);
    alpha *= (Math.PI / 180);

    //unfortunately rotMatrix can't be a global variable, since a cube is rotated by a different amount each time this function is called.
    let rotMatrix = [
        [Math.cos(alpha) * Math.cos(beta), (Math.cos(alpha) * Math.sin(beta) * Math.sin(gamma)) - (Math.sin(alpha) * Math.cos(gamma)), (Math.cos(alpha) * Math.sin(beta) * Math.cos(gamma)) + (Math.sin(alpha) * Math.sin(gamma))],
        [Math.sin(alpha) * Math.cos(beta), (Math.sin(alpha) * Math.sin(beta) * Math.sin(gamma)) + (Math.cos(alpha) * Math.cos(gamma)), (Math.sin(alpha) * Math.sin(beta) * Math.cos(gamma)) - (Math.cos(alpha) * Math.sin(gamma))],
        [-Math.sin(beta), Math.cos(beta) * Math.sin(gamma), Math.cos(beta) * Math.cos(gamma)]
    ]

    //construct new shapeMatrix (coords of each vertex after cube is rotated).
    for (let i = 0; i < shapeMatrix.length; i++) {
        for (let j = 0; j < 3; j++) {
            newMatrix[i][j] = (shapeMatrix[i][0] * rotMatrix[j][0]) + (shapeMatrix[i][1] * rotMatrix[j][1]) + (shapeMatrix[i][2] * rotMatrix[j][2]);
        }
    }

    display(tempStr + matrixToString(rotMatrix) + "<br>Rotated Matrix:<br>" + matrixDesmosToString(newMatrix), "output");

    return newMatrix;
}

/**
 * Function for testing purposes, prints out a given matrix in "linear algebra" format.
 * @param {*} matrix the matrix to be printed.
 */
function matrixToString(matrix) {
    var str = "";
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < matrix.length; i++) {
            str += ((matrix[i][j]).toFixed(2));
            str += " ";
        }
        str += ("<br>"); //NOTE, don't use "\n" for a newline, use "<br>".
        //"\n" gets collapsed into a single whitespace (idk why ??? its just a js thing I guess ¯\_(ツ)_/¯).
    }
    return str;
}

/**
 * Function for testing purposes, prints out a given matrix in a way that is easy to copy and paste into desmos3d graphing calculator.
 * @param {*} matrix the matrix to be printed.
 */
function matrixDesmosToString(matrix) {
    var str = "";
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < 3; j++) {
            str += matrix[i][j].toFixed(2);
            if (j != 2) {
                str += ",";
            }
        }
        str += "<br>";
    }
    return str;
}

/**
 * Gets input from user and applies it to the cube.
 */
function applyRotation() {
    xDeg = document.getElementById("xInput").value;
    yDeg = document.getElementById("yInput").value;
    zDeg = document.getElementById("zInput").value;

    //display(matrixToString(rotateShape(xDeg, yDeg, zDeg, unitCubeMatrix)));
    rotatedMatrix = rotateShape(xDeg, yDeg, zDeg, rotatedMatrix);
    updateShapeDisplay();
}

/**
 * Repositions the shape so that it's centered at the origin.
 * This should only need to be called once at initialization, since all rotations are done about the origin.
 * @param {*} shapeMatrix the shape to be centered.
 */
function centerShape(shapeMatrix) {
    //hard coding for cubes right now
    let vectorToOrigin = [0,0,0]; //this is also the coords of the center point of the shape
    /*
    for (let i = 0; i < vectorToOrigin.length; i++) {
        //note: this equation only works with a unit cube. Extremely hard coded.
        vectorToOrigin[i] = (shapeMatrix[shapeMatrix.length - 1][i] - shapeMatrix[0][i]) / 2;
    }
    */

    //two double for loops :( They're only O(n) though so........... I think I'm okay
    //anything with more than like 100 vertices is basically a sphere, 
    //it only makes sense that more edges means longer processing time.

    //okay now this should work
    //it does yay !!!!!
    for (let i = 0; i < shapeMatrix.length; i++) {
        for (let j = 0; j < 3; j++) {
            vectorToOrigin[j] += shapeMatrix[i][j];
        }
    }

    for (let i = 0; i < 3; i++) {
        vectorToOrigin[i] /= shapeMatrix.length;
    }

    for (let i = 0; i < shapeMatrix.length; i++) {
        for (let j = 0; j < 3; j++) {
            shapeMatrix[i][j] -= vectorToOrigin[j];
        }
    }
    return shapeMatrix;
}

/**
 * debugging function, puts text in a specified text box from the html file
 * @param {*} str 
 * @param {*} textBoxId 
 */
function display(str, textBoxId) {
    document.getElementById(textBoxId).innerHTML = str;
}

/**
 * a function used for scaling a shape by a certain amount.
 * @param {*} shapeMatrix the matrix of vertices of the shape to be scaled.
 * @param {*} scalFactor the amount the shape should be scaled.
 * @returns 
 */
function scaleShape(shapeMatrix, scalFactor) {
    for (let i = 0; i < shapeMatrix.length; i++) {
        for (let j = 0; j < 3; j++) {
            shapeMatrix[i][j] *= scalFactor;
        }
    }
    document.getElementById("scalWhy").innerHTML = "Scaling factor: " + scalFactor / 100;
    //return shapeMatrix;
}

/**
 * function that scales according the the slider value in the html file.
 */
function slidyScale() {
    //let scalInput = document.getElementById("scalFactor").value;
    display("Scaling Factor: " + document.getElementById("scalFactor").value, "scalWhy")
    scaleShape(rotatedMatrix, 1 / scale); //normalizes shape
    scale = INITIALSCALE * document.getElementById("scalFactor").value; //make new scale
    scaleShape(rotatedMatrix, scale); //scale shape
    display("original matrix:<br>" + matrixToString(unitCubeMatrix), "original"); 
}

/**
 * Produces a deep copy of a matrix, used for testing, unused now.
 * @param {*} matrix 
 * @returns 
 */
function copyMatrix(matrix) {
    newMatrix = [[],[],[],[],[],[],[],[]];
    display("here", "original");
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            newMatrix[i][j] = matrix[i][j];
        }
    }
    return newMatrix;
}

/**
 * function that updates the projected vertices' positions
 */
function updateShapeDisplay() {
    //getting vertices and projecting them onto screen
    let x = 0;
    let y = 0;

    //this clears the canvas each "frame", so lines drawn from previous rotations are deleted and don't overlap with the new lines.
    lineDrawer.clearRect(0, 0, displayArea.width, displayArea.height);
    
    
    for (let i = 0; i < vertices.length; i++) {
        //updating vertices
        vertices[i] = document.getElementById("v" + (i + 1)); //I think this is here cuz there's a new vertex location every time so I'm basically updating the position data I think ?????
        x = ((window.innerWidth / 2) + (rotatedMatrix[i][1] * FOCALLENGTH)/(FOCALLENGTH + rotatedMatrix[i][2])) - 7.5;
        y = ((window.innerHeight / 2) + (rotatedMatrix[i][0] * FOCALLENGTH)/(FOCALLENGTH + rotatedMatrix[i][2])) - 7.5;
        //setting x coordinate of shape
        vertices[i].style.left = x + "px";
        //setting y coordinate of shape
        vertices[i].style.top =  y + "px";        
    }


    lineDrawer.beginPath();    
    //updating edges
    for (let i = 0; i < edgeTable.length; i++) {
        //let i = 0;
        x = ((window.innerWidth / 2) + (rotatedMatrix[edgeTable[i][0]][1] * FOCALLENGTH)/(FOCALLENGTH + rotatedMatrix[edgeTable[i][0]][2]));
        y = ((window.innerHeight / 2) + (rotatedMatrix[edgeTable[i][0]][0] * FOCALLENGTH)/(FOCALLENGTH + rotatedMatrix[edgeTable[i][0]][2]));
        lineDrawer.moveTo(x, y);
        x = ((window.innerWidth / 2) + (rotatedMatrix[edgeTable[i][1]][1] * FOCALLENGTH)/(FOCALLENGTH + rotatedMatrix[edgeTable[i][1]][2]));
        y = ((window.innerHeight / 2) + (rotatedMatrix[edgeTable[i][1]][0] * FOCALLENGTH)/(FOCALLENGTH + rotatedMatrix[edgeTable[i][1]][2]));
        lineDrawer.lineTo(x, y)
        lineDrawer.stroke();
    }
    
}

/**
 * toggles the boogie
 */
function toggleBoogie() {
    if (initFunk < 0.5) {
        initFunk = 0.5;
        document.getElementById("boogieBtn").value = "Press to control";
    }
    else {
        initFunk = -1;
        document.getElementById("boogieBtn").value = "Press to boogie";
    }
}

/**
 * Returns the length of a given vector.
 * Primarily used for normalizing vectors.
 * @param {*} x the x component of a vector.
 * @param {*} y the y component of a vector.
 * @param {*} z the z component of a vector.
 */
function getVectorLength(x, y, z) {
    return Math.abs(Math.sqrt((x * x) + (y * y) + (z * z)));
}

/**
 * Most basic cube of "size 1". Using for testing purposes, but ideally code should work with a cube of any size in any position.
 * Let's call this the "unit cube" for now.
 * We also have to think of this matrix as "sideways" kinda, in order to fit the way we imagine matrices in linear algebra.
 * Each entry is a vector, so the visual code is the matrix but transposed sorta. (This is gonna get confusing I think).
 * We should keep this in mind for when we apply the rotation matrix.
 */
let unitCubeMatrix = [
    [0,0,0], //[0] = bottom left back
    [0,0,1], //[1] = bottom left front
    [0,1,0], //[2] = top left back
    [0,1,1], //[3] = top left front
    [1,0,0], //[4] = bottom right back
    [1,0,1], //[5] = bottom right front
    [1,1,0], //[6] = top right back
    [1,1,1]  //[7] = top right front
    //5/17/24 8:17 just noticed that the coords are also their index in the matrix in binary (neat !)
];

/**
 * edge table, in this case the edge table for the unitCubeMatrix (my naming conventions are a little unorganized oh well :)
 */
var edgeTable = [
    [0,1], [1,3], [3,2], [2,0], //"left" side of cube
    [4,5], [5,7], [7,6], [6,4], //"right" side of cube
    [0,4], [1,5], [3,7], [2,6]  //edges connecting "left" and "right" sides
]

//testing area
//document.write("<br>Original Matrix:<br>")
//printMatrix(unitCubeMatrix);
//centerShape(unitCubeMatrix);

//initialization of everything
var displayArea = document.getElementById("shapeDisplay");
displayArea.height = window.innerHeight;
displayArea.width = window.innerWidth; //ok doesn't seem that bad rn
var lineDrawer = displayArea.getContext('2d');
lineDrawer.beginPath();

var rotatedMatrix = unitCubeMatrix;
var initFunk = 0.5;
const DAMPENER = 2; //"spinning sensitivity"

const INITIALSCALE = 100;
var scale = INITIALSCALE;
const FOCALLENGTH = 150;

var vectorLength = 0;
var staticX = 0;
var staticY = 0;
var frictionKinda = 1;


scaleShape(unitCubeMatrix, INITIALSCALE); //scales the shape to an initial size.
unitCubeMatrix = centerShape(unitCubeMatrix); //centers shape around origin.
rotatedMatrix = rotateShape(0, 45, 35, rotatedMatrix); //initially rotates shape.

display("original matrix:<br>" + matrixToString(unitCubeMatrix), "original");

//initializing visual representation of vertices
//hard coding like crazy but I just want to figure out how this works for right now.
var v1 = document.getElementById("v1");
var v2 = document.getElementById("v2");
var v3 = document.getElementById("v3");
var v4 = document.getElementById("v4");
var v5 = document.getElementById("v5");
var v6 = document.getElementById("v6");
var v7 = document.getElementById("v7");
var v8 = document.getElementById("v8");
var vertices = [v1, v2, v3, v4, v5, v6, v7, v8];


//implementing mouse position input
document.addEventListener("mousemove", logKey);
document.addEventListener("mousedown", function(e) {
    vectorLength = getVectorLength(e.clientX - window.innerWidth / 2, (window.innerHeight / 2) - e.clientY, 0);
    if (vectorLength == 0) {vectorLength = 1};
    staticX = (e.clientX - (window.innerWidth / 2)) / vectorLength;
    staticY = ((window.innerHeight / 2) - e.clientY) / vectorLength;
    toggleBoogie();
});

//dance



window.onload = function() {
    display(initFunk.toFixed(2), "scalWhy");
    setInterval(function(){
        //scaleShape(unitCubeMatrix, initFunk / 100)
        //rotatedMatrix = rotateShape(initFunk % 360, initFunk * -1.5 % 360, initFunk / 2 % 360, rotatedMatrix);
        if (initFunk >= 0) {
            rotatedMatrix = rotateShape(Math.sin(initFunk), Math.cos(initFunk), Math.sin(initFunk), rotatedMatrix);
            updateShapeDisplay();
            
            
            if (initFunk == 1) {
                initFunk == 0;
            }
            else {
                initFunk += 0.01;
            }
        }
        else {
            if (vectorLength != 0) {
                rotatedMatrix = rotateShape(staticX * 1.5, staticY * 1.5, 0, rotatedMatrix);
            }
            else {

            }
            
            updateShapeDisplay();
        }
        
    }, 10);
}


//this function is called whenever the mouse moves.
//this is hard coded, will not allow for like momentum and velocity and stuff (since cube should still be able to move when mouse is still)
function logKey(e) {
    if (initFunk < 0) {
        vectorLength = getVectorLength(e.clientX - window.innerWidth / 2, (window.innerHeight / 2) - e.clientY, 0);
        if (vectorLength == 0) {vectorLength = 1};
        staticX = (e.clientX - (window.innerWidth / 2)) / vectorLength;
        staticY = ((window.innerHeight / 2) - e.clientY) / vectorLength;
        
        //rotatedMatrix = rotateShape(staticX, staticY, 0, rotatedMatrix);
        //updateShapeDisplay();
        //display(e.clientX - window.innerWidth / 2 + ", " + ((window.innerHeight / 2) - e.clientY) + " length: " + vectorLength, "scalWhy");
    }
}