import { getRecipes, toggleIngredient, removeIngredient, removeStep } from './recipes'
import { getFilters } from './filters'


const renderRecipes = () => {
    const recipesList = document.querySelector('#recipes-list'),
    noRecipes = document.createElement('span')

    noRecipes.textContent = 'There are not recipes to show, create a new one!'
    noRecipes.classList.add('no-recipes')

    const {searchTitle} = getFilters()
    const recipes = getRecipes()
    const filteredRecipes = recipes.filter(recipe => recipe.title.toLowerCase().includes(searchTitle.toLowerCase()))

    recipesList.innerHTML = ''
    if (filteredRecipes.length > 0) {
        filteredRecipes.forEach(recipe => recipesList.appendChild(generateRecipeToDOM(recipe)))
    } else {
        recipesList.appendChild(noRecipes)
    }

}

const renderSteps = (recipe) => {
    const orderedList = document.querySelector('#recipe-steps'),
    editStepsButton = document.querySelector('#edit-steps-button'),
    noSteps = document.createElement('span')

    noSteps.textContent = 'Add the recipe\'s steps'
    noSteps.classList.add('no-steps')

    orderedList.innerHTML = ''

    if (recipe.steps.length > 0) {
        recipe.steps.forEach((step) => {
            orderedList.appendChild(generateStepToDOM(step))
        })
        editStepsButton.style.display = ''
    } else {
        orderedList.appendChild(noSteps)
        editStepsButton.style.display = 'none'
    }
}

const renderIngredients = (recipe) => {
    const recipeIngredients = document.querySelector('#ingredients-list'),
    noIngredients = document.createElement('span')

    noIngredients.textContent = 'Add the ingredients to your recipe!'
    noIngredients.classList.add('no-ingredients')

    recipeIngredients.innerHTML = ''

    if (recipe.ingredients.length > 0) {
        recipe.ingredients.forEach(ingredient => recipeIngredients.appendChild(generateIngredientsToDOM(ingredient)))
    } else {
        recipeIngredients.appendChild(noIngredients)
    }
}

const generateRecipeToDOM = (recipe) => {
    const recipeWrap = document.createElement('a')
    const recipeCard = document.createElement('div')
    const recipeTitle = document.createElement('span')
    const recipeDescription = document.createElement('p')
    const recipeIngredients = document.createElement('div')
    const recipeSteps = document.createElement('span')

    const ingredientsWeHave = recipe.ingredients.filter(ingredient => ingredient.itHas === true)
    const ingredientsCounter = ingredientsWeHave.length !== recipe.ingredients.length ? `You have ${ingredientsWeHave.length} of ${recipe.ingredients.length} ingredients` : 'You have all the ingredients'

    recipeCard.classList.add('recipe-card')

    if (recipe.title.length > 0) {
        recipeTitle.textContent = recipe.title
    } else {
        recipeTitle.textContent = 'Unnamed recipe'
    }

    recipeTitle.classList.add('recipe-info-title')
    recipeCard.appendChild(recipeTitle)

    const maxChAllowed = 105 //It depends on design

    if (recipe.description.length > maxChAllowed) {
        let result = ''
        for (let i = 0; i < maxChAllowed; i++) {
            result += recipe.description[i]
        }
        recipeDescription.textContent = `${result}...`
    } else if (recipe.description.length === 0) {
        recipeDescription.textContent = 'No description yet'
    } else {
        recipeDescription.textContent = recipe.description
    }
    recipeDescription.classList.add('recipe-info-description')
    recipeCard.appendChild(recipeDescription)

    recipeSteps.textContent = `Steps: ${recipe.steps.length}`
    recipeSteps.classList.add('recipe-info-steps')
    recipeCard.appendChild(recipeSteps)


    if (ingredientsWeHave.length > 0) {
        recipeIngredients.textContent = ingredientsCounter
    } else {
        recipeIngredients.textContent = 'You don\'t have any ingredient yet'
    }
    recipeIngredients.classList.add('recipe-info-ingredients')
    recipeCard.appendChild(recipeIngredients)

    recipeWrap.appendChild(recipeCard)
    recipeWrap.setAttribute('href', `/edit.html#${recipe.id}`)

    return recipeWrap
}

const generateStepToDOM = (step) => {
    const stepElement = document.createElement('li'),
    stepText = document.createElement('span'),
    remove = document.createElement('i')
    
    stepText.textContent = step
    stepText.classList.add('step-text')
    stepElement.appendChild(stepText)

    remove.classList.add('remove-step', 'far', 'fa-trash-alt')
    stepElement.appendChild(remove)

    stepElement.classList.add('step-item')

    remove.addEventListener('click', () => {
        removeStep(step)
    })

    return stepElement
}

const generateIngredientsToDOM = (ingredient) => {
    const containerEl = document.createElement('div')
    const label = document.createElement('label')
    const checkEl = document.createElement('input')
    const customCheck = document.createElement('span')
    const textEl = document.createElement('p')
    const removeEl = document.createElement('i')

    label.classList.add('checkbox-label')

    checkEl.setAttribute('type', 'checkbox')
    checkEl.checked = ingredient.itHas
    label.appendChild(checkEl)
    checkEl.addEventListener('change', () => {
        toggleIngredient(ingredient.name)
    })

    customCheck.classList.add('checkbox-custom')
    label.appendChild(customCheck)
    containerEl.appendChild(label)

    textEl.textContent = ingredient.name
    textEl.classList.add('ingredient-text')
    containerEl.appendChild(textEl)

    //removeEl.textContent = 'x'
    removeEl.classList.add('remove-ingredient', 'far', 'fa-trash-alt')
    containerEl.appendChild(removeEl)
    removeEl.addEventListener('click', () => {
        removeIngredient(ingredient.name)
    })

    containerEl.classList.add('ingredient-item')

    return containerEl
}

const loadEditPage = (recipeId) => {
    const recipeTitle = document.querySelector('#recipe-title')
    const recipeDescription = document.querySelector('#recipe-description')

    const recipes = getRecipes()
    const recipe = recipes.find((recipe) => recipe.id === recipeId)

    if (!recipe) {
        location.assign('/index.html')
    }

    recipeTitle.value = recipe.title
    recipeDescription.value = recipe.description

    renderSteps(recipe)
    renderIngredients(recipe)

    return recipe
}


export { renderRecipes, loadEditPage, renderIngredients, renderSteps }
