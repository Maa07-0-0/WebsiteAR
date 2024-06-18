// main.js

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let scrollAmount = 0;
    const scrollPerClick = 300; // Adjust the scroll amount per click based on your preference

    prevBtn.addEventListener('click', () => {
        slider.scrollBy({
            top: 0,
            left: -scrollPerClick,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        slider.scrollBy({
            top: 0,
            left: scrollPerClick,
            behavior: 'smooth'
        });
    });
});
