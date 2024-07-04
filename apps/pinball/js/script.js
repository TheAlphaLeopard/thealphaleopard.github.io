// Create the Matter.js engine and world
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const engine = Engine.create();
const { world } = engine;

// Create the renderer
const canvas = document.getElementById('pinballCanvas');
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#000'
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Create walls
const walls = [
    Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 20, { isStatic: true }),
    Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true }),
    Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }),
    Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true })
];
World.add(world, walls);

// Create pinball
const ball = Bodies.circle(window.innerWidth / 2, window.innerHeight - 50, 20, {
    restitution: 0.9,
    render: {
        fillStyle: '#f00'
    }
});
World.add(world, ball);

// Create flippers
const flipperLeft = Bodies.rectangle(window.innerWidth / 2 - 100, window.innerHeight - 100, 80, 20, {
    isStatic: true,
    angle: -0.2,
    render: { fillStyle: '#fff' }
});
const flipperRight = Bodies.rectangle(window.innerWidth / 2 + 100, window.innerHeight - 100, 80, 20, {
    isStatic: true,
    angle: 0.2,
    render: { fillStyle: '#fff' }
});
World.add(world, [flipperLeft, flipperRight]);

// Rotate flippers
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        Body.setAngle(flipperLeft, -Math.PI / 4);
    } else if (event.key === 'ArrowRight') {
        Body.setAngle(flipperRight, Math.PI / 4);
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        Body.setAngle(flipperLeft, -0.2);
    } else if (event.key === 'ArrowRight') {
        Body.setAngle(flipperRight, 0.2);
    }
});

// Create bumpers
const bumper1 = Bodies.circle(window.innerWidth / 2 - 150, window.innerHeight / 2, 30, {
    isStatic: true,
    restitution: 1.5,
    render: { fillStyle: '#0f0' }
});
const bumper2 = Bodies.circle(window.innerWidth / 2, window.innerHeight / 2 - 100, 30, {
    isStatic: true,
    restitution: 1.5,
    render: { fillStyle: '#0f0' }
});
const bumper3 = Bodies.circle(window.innerWidth / 2 + 150, window.innerHeight / 2, 30, {
    isStatic: true,
    restitution: 1.5,
    render: { fillStyle: '#0f0' }
});
World.add(world, [bumper1, bumper2, bumper3]);

// Scoring
let score = 0;
const scoreElement = document.getElementById('score');

Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((pair) => {
        if (pair.bodyA === ball || pair.bodyB === ball) {
            if (pair.bodyA === bumper1 || pair.bodyB === bumper1 ||
                pair.bodyA === bumper2 || pair.bodyB === bumper2 ||
                pair.bodyA === bumper3 || pair.bodyB === bumper3) {
                score += 10;
                scoreElement.innerText = `Score: ${score}`;
            }
        }
    });
});

// Keep the canvas size in sync with the window size
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });
});
