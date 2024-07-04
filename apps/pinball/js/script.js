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
const flipperLeft = Bodies.rectangle(window.innerWidth / 2 - 100, window.innerHeight - 100, 80, 20, { isStatic: true });
const flipperRight = Bodies.rectangle(window.innerWidth / 2 + 100, window.innerHeight - 100, 80, 20, { isStatic: true });
World.add(world, [flipperLeft, flipperRight]);

// Rotate flippers
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        Body.rotate(flipperLeft, -0.2);
    } else if (event.key === 'ArrowRight') {
        Body.rotate(flipperRight, 0.2);
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        Body.rotate(flipperLeft, 0.2);
    } else if (event.key === 'ArrowRight') {
        Body.rotate(flipperRight, -0.2);
    }
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
