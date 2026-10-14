document.addEventListener("DOMContentLoaded", function () {
    console.log("1. El DOM se ha cargado correctamente");

    // Analizamos la ruta actual
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const isSubfolder = pathSegments.length > 1 && !window.location.pathname.endsWith('index.html');
    
    const footerPath = isSubfolder ? '../footer.html' : './footer.html';
    console.log("2. Ruta calculada para el footer:", footerPath);

    fetch(footerPath)
        .then(response => {
            console.log("3. Respuesta del servidor recibida:", response.status);
            if (!response.ok) {
                throw new Error(`No se pudo cargar el footer. Estado HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("4. Contenido de footer.html descargado con éxito");
            const container = document.getElementById("footer-container");
            
            if (container) {
                container.innerHTML = data;
                console.log("5. Footer inyectado en el contenedor con éxito");
                
                // Ajustar la ruta de la imagen
                const img = container.querySelector('img');
                if (img) {
                    img.src = isSubfolder ? '../img/Cc-by-nc-sa_icon.webp' : './img/Cc-by-nc-sa_icon.webp';
                    console.log("6. Ruta de la imagen ajustada a:", img.src);
                }
            } else {
                console.error("¡ERROR CRÍTICO! No se encuentra el elemento con id 'footer-container' en este HTML.");
            }
        })
        .catch(error => {
            console.error("¡ERROR EN EL FETCH!:", error);
        });
});