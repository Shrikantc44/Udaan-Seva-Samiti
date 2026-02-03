// Global Script for Udaan Seva Samiti
document.addEventListener("DOMContentLoaded", () => {
    console.log("Website Loaded Successfully");

    // Smooth Scroll for links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Marquee Pause on Hover
    const marquee = document.querySelector('marquee');
    if(marquee) {
        marquee.addEventListener('mouseover', () => marquee.stop());
        marquee.addEventListener('mouseout', () => marquee.start());
    }
});