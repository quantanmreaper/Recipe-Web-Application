
window.onload = function() {
    // Get all slider images and dots
    var imgs = document.querySelectorAll(".slider img");
    var dots = document.querySelectorAll(".dot");

    // Ensure the number of images and dots are the same
    if (imgs.length !== dots.length) {
        console.error("Number of images and dots do not match.");
        return;
    }

    if (imgs.length === 0) {
        console.error("No images found in the slider.");
        return;
    }

    if (dots.length === 0) {
        console.error("No dots found.");
        return;
    }

    // Set the first image to be visible
    imgs[0].style.opacity = 1;

    // Start the auto-slide timer
    var currentImg = 0;
    var interval = 1500;
    var timer = setInterval(autoSlide, interval);

    function autoSlide() {
        currentImg = (currentImg + 1) % imgs.length;
        changeSlide(currentImg);
    }

    function changeSlide(n) {
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].style.opacity = 0;  // Hide all images
            dots[i].classList.remove('active');  // Remove active class from all dots
        }
        imgs[n].style.opacity = 1;  // Show the current image
        dots[n].classList.add('active');  // Highlight the current dot
    }

    // Add event listeners to dots
    dots.forEach(function(dot, index) {
        dot.addEventListener("click", function() {
            clearInterval(timer);
            changeSlide(index);
            currentImg = index;
            timer = setInterval(autoSlide, interval);
        });
    });
};
