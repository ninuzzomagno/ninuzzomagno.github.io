const getIdx = (url) => {
    if (url.includes("index")) return 0;
    if (url.includes("projects")) return 1;
    if (url.includes("articles")) return 2;
    return 0;
};

// 1. PRIMA DI CAMBIARE PAGINA: Calcola la direzione e salvala
window.addEventListener("pageswap", (event) => {
    if (event.viewTransition) {
        const from = window.location.pathname;
        const to = new URL(event.activation.entry.url).pathname;
        
        const direction = getIdx(to) > getIdx(from) ? "avanti" : "indietro";
        sessionStorage.setItem("page-direction", direction);
    
        document.documentElement.classList.add(direction);
    }
});

window.addEventListener("pagereveal", async (event) => {
    if (event.viewTransition) {
        await event.viewTransition.finished;
        document.documentElement.classList.remove("avanti", "indietro");
        sessionStorage.removeItem("page-direction");
    }
});