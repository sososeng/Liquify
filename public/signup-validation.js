$(function() {

  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  $("#signupform").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side


      email: {
        required: true,
        // Specify that email should be validated
        // by the built-in "email" rule
        email: true
      },
      password: {
        required: true,
        minlength: 5,
        maxlength: 15
      },
      confirmpassword: {
        equalTo: "#password",
        required: true,
        minlength: 5,
        maxlength: 15
      },

    },
    // Specify validation error messages
    messages: {
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long",
        maxlength: "Your password must be less then 16 characters long"
      },
      email: "Please enter a valid email address"
      ,
      confirmpassword: {
        required: "Please provide a password",
        equalTo: "Must be the same as password"
      },
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });
});
