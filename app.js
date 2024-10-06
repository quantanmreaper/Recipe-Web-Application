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
    var interval = 2500;
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

    document.addEventListener("DOMContentLoaded", function() {
        var registrationForm = document.getElementById("registrationForm");
        var reciperegForm = document.getElementById("recipeform");
        
        //Validation of recipe form 
        if(recipeform){
            recipeform.addEventListener("submit", function(event){

                let isValid = true;
                document.querySelectorAll('.error').forEach(e => e.remove());

                const recipename = document.getElementById("recipename").value.trim();
                const ingredients = document.getElementById("ingredients").value.trim();
                const recipesteps = document.getElementById("recipesteps").value.trim();
                const recipecategory = document.getElementById("recipecategory").value;

                if(recipename === ""){
                    showError("Please enter the recipe name.", "recipename");
                    isValid = false;
                }
                if(ingredients === ""){
                    showError("Please enter the ingredients.", "ingredients");
                    isValid = false;
                }
                if(recipesteps === ""){
                    showError("Please enter the recipe steps.", "recipesteps");
                    isValid = false;
                }
                if(recipecategory === ""){
                    showError("Please select a category.", "recipecategory");
                    isValid = false;
                }
                if (!isValid) {
                    event.preventDefault();
                }

            });
        }


        // Validate registration form
        if (registrationForm) {
            registrationForm.addEventListener("submit", function(event) {
                let isValid = true;

                // Remove existing error messages
                document.querySelectorAll('.error').forEach(e => e.remove());

                // Get form elements
                const username = document.getElementById("username").value.trim();
                const email = document.getElementById("email").value.trim();
                const password = document.getElementById("password").value.trim();
                const usertype = document.getElementById("usertype").value;

                // Validate Username
                if (username === "") {
                    showError("Please enter your username.", "username");
                    isValid = false;
                }

                // Validate Email
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (email === "") {
                    showError("Please enter your email.", "email");
                    isValid = false;
                } else if (!emailPattern.test(email)) {
                    showError("Please enter a valid email address.", "email");
                    isValid = false;
                }

                // Validate Password
                if (password === "") {
                    showError("Please enter your password.", "password");
                    isValid = false;
                } else if (password.length < 8 || 
                        !/[A-Z]/.test(password) || 
                        !/[a-z]/.test(password) || 
                        !/[0-9]/.test(password) || 
                        !/[!@#\$%\^&\*]/.test(password)) {
                    showError("Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.", "password");
                    isValid = false;
                }
                
                // Validate UserType
                if (usertype === "") {
                    showError("Please select a user type.", "usertype");
                    isValid = false;
                }
                // If any field is invalid, prevent form submission
                if (!isValid) {
                    event.preventDefault();
                } else {
                    // Prevent double submission
                    document.querySelector('input[type="submit"]').disabled = true;
                }
            });
        } else {
            console.error("Registration form not found.");
        }
        function showError(message, fieldId) {
            const field = document.getElementById(fieldId);
            const errorElement = document.createElement('div');
            errorElement.className = 'error';
            errorElement.textContent = message;
            field.parentElement.appendChild(errorElement);
        }
    });
