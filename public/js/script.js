let addIngredientsBtn = document.getElementById("addIngredientsBtn");
let ingredientList = document.querySelector(".ingredientList");
let ingredeintDiv = document.querySelectorAll(".ingredeintDiv")[0];

addIngredientsBtn.addEventListener("click", () => {
  let newIngredients = ingredeintDiv.cloneNode(true);
  let input = newIngredients.getElementsByTagName("input")[0];
  input.value = "";
  ingredientList.appendChild(newIngredients);
});

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");
  console.log(forms);
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
