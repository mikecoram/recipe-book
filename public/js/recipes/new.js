const startIngredientInputs = 3;
const startStepInputs = 3;

let ingredientNum = 1;
let stepNum = 1;

$(document).ready(e => {
    for(let i = 0; i < startIngredientInputs; i++) {
        addIngredient(ingredientNum++);
    }

    for(let i = 0; i < startStepInputs; i++) {
        addStep(stepNum++);
    }
});

$('#add-step').click(e => {
    addStep(stepNum++);
});

$('#add-ingredient').click(e => {
    addIngredient(ingredientNum++);
});

function addIngredient(num) {
    $('#ingredients').append(
        `<div class="col-md-4">
            <input name="ing-quantity-${num}" type="text" class="form-control" placeholder="Quantity">
        </div>
        <div class="col-md-8">
            <input name="ing-${num}" type="text" class="form-control" placeholder="Ingredient">
        </div>`
    );
}

function addStep(num) {
    $('#steps').append(
        `<input name="step-${num}" class="form-control step-row" 
            placeholder="Step ${num}">`
    );
}