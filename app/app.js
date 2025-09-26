
// --- Configuración de la melodía de "Estrellita, ¿dónde estás?" ---
// Notas en notación inglesa (C, D, E, F, G, A, B)
// Ejemplo: C4 = Do, D4 = Re, E4 = Mi, etc.
const melody = [
	'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4',
	'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4',
	'G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4',
	'G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4',
	'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4',
	'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'
];

const noteDuration = 0.4; // segundos por nota

let points = []; // Puntos dibujados por el usuario
let isDrawing = false;

function setup() {
	const canvas = createCanvas(500, 320);
	canvas.parent('canvas-container');
	background(24, 28, 43);
	stroke(255, 180, 71);
	strokeWeight(4);
	noFill();
}

function draw() {
	background(24, 28, 43);
	if (points.length > 1) {
		beginShape();
		for (let pt of points) {
			vertex(pt.x, pt.y);
		}
		endShape();
	} else if (points.length === 1) {
		point(points[0].x, points[0].y);
	}
}

function mousePressed() {
	if (mouseInsideCanvas()) {
		isDrawing = true;
		points = [];
		points.push({ x: mouseX, y: mouseY });
	}
}

function mouseDragged() {
	if (isDrawing && mouseInsideCanvas()) {
		points.push({ x: mouseX, y: mouseY });
		// Reproducir nota correspondiente en tiempo real
		playNoteForCurrentPoint();
	}
}

function mouseReleased() {
	isDrawing = false;
}

function mouseInsideCanvas() {
	return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

// --- Reproducir la melodía según el dibujo ---
// El botón ya no es necesario para reproducir, pero puede usarse para limpiar el canvas o reiniciar
document.getElementById('play-btn').addEventListener('click', () => {
	points = [];
});


// Mapea el índice del punto actual a la nota de la melodía
let synth;
async function playNoteForCurrentPoint() {
	if (!synth) {
		await Tone.start();
		synth = new Tone.Synth({ oscillator: { type: 'triangle' } }).toDestination();
	}
	// Determinar qué nota corresponde al punto actual
	const idx = points.length - 1;
	const noteIdx = Math.floor(idx * melody.length / 500); // 500 = ancho canvas, ajusta si cambias tamaño
	if (noteIdx >= 0 && noteIdx < melody.length) {
		synth.triggerAttackRelease(melody[noteIdx], noteDuration * 0.7);
	}
}
