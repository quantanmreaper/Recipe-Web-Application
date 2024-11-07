document.addEventListener("DOMContentLoaded", function() {
    // Import and initialize Supabase client inside DOMContentLoaded
/*     const { createClient } = supabase;
    
    const supabaseUrl = 'https://mamxpvoasqxnpzleqxrp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hbXhwdm9hc3F4bnB6bGVxeHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4MzkxODIsImV4cCI6MjA0NTQxNTE4Mn0.TJze_x-3Vzl5v4MUpQ1bDtOC9I1BlOGSqaUNR5ypPAs';

    const supabase = createClient(supabaseUrl, supabaseKey); */

    const registrationForm = document.getElementById("registrationForm");

    if (registrationForm) {
        registrationForm.addEventListener("submit", function(event) {
            event.preventDefault();

            let isValid = true;
            document.querySelectorAll('.error').forEach(e => e.remove());

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const usertype = document.getElementById("usertype").value;

            if (username === "") {
                showError("Please enter your username.", "username");
                isValid = false;
            }
            if (email === "") {
                showError("Please enter your email.", "email");
                isValid = false;
            }
            if (password === "") {
                showError("Please enter your password.", "password");
                isValid = false;
            }
            if (usertype === "") {
                showError("Please select a user type.", "usertype");
            }

        });
    }
});


function showError(message, fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
}


/*
    document.addEventListener("DOMContentLoaded", function() {
    //var registrationForm = document.getElementById("registrationForm");
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
});



*/



