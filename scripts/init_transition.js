const direction = sessionStorage.getItem("page-direction");
if (direction) {
    document.documentElement.classList.add(direction);
}