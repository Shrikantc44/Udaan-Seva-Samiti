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

    
});


