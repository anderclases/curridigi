let synth = window.speechSynthesis;
let currentUtterance = null;
let elementsToRead = [];
let currentIndex = 0;

// Inicializar la lista de elementos y eventos de clic al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    if (!card) return;

    elementsToRead = Array.from(card.querySelectorAll('h2, h3, h4, p, figcaption, li'));

    // Añadir evento de clic interactivo a cada bloque de lectura
    elementsToRead.forEach((el, index) => {
        el.style.cursor = 'pointer';
        el.title = 'Haz clic para leer desde aquí';
        el.addEventListener('click', () => {
            jumpToElement(index);
        });
    });
});

function toggleSpeech() {
    if (!synth) {
        alert("Tu navegador no soporta la función de lectura de texto.");
        return;
    }

    if (synth.speaking) {
        if (synth.paused) {
            synth.resume();
            document.getElementById('audioBtn').innerHTML = '⏸️ Pausar Lectura';
        } else {
            synth.pause();
            document.getElementById('audioBtn').innerHTML = '▶️ Reanudar Lectura';
        }
        return;
    }

    currentIndex = 0;
    if (elementsToRead.length > 0) {
        playNextElement();
        document.getElementById('stopBtn').style.display = 'inline-flex';
    }
}

function playNextElement() {
    if (currentIndex >= elementsToRead.length) {
        stopSpeech();
        return;
    }

    clearHighlights();

    const el = elementsToRead[currentIndex];
    el.classList.add('highlight-reading');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    currentUtterance = new SpeechSynthesisUtterance(el.innerText);
    currentUtterance.lang = 'es-ES';
    currentUtterance.rate = 1.0;

    currentUtterance.onend = function() {
        currentIndex++;
        playNextElement();
    };

    currentUtterance.onerror = function() {
        stopSpeech();
    };

    synth.speak(currentUtterance);
    document.getElementById('audioBtn').innerHTML = '⏸️ Pausar Lectura';
    document.getElementById('stopBtn').style.display = 'inline-flex';
}

// Función para saltar al párrafo seleccionado al hacer clic
function jumpToElement(index) {
    if (!synth) return;

    synth.cancel();
    currentIndex = index;
    playNextElement();
}

function stopSpeech() {
    if (synth) {
        synth.cancel();
    }
    clearHighlights();
    resetAudioButtons();
}

function clearHighlights() {
    document.querySelectorAll('.highlight-reading').forEach(el => {
        el.classList.remove('highlight-reading');
    });
}

function resetAudioButtons() {
    const audioBtn = document.getElementById('audioBtn');
    const stopBtn = document.getElementById('stopBtn');
    if (audioBtn) audioBtn.innerHTML = '🔊 Escuchar Contenido';
    if (stopBtn) stopBtn.style.display = 'none';
    currentIndex = 0;
}

window.addEventListener('beforeunload', () => {
    if (synth) synth.cancel();
});