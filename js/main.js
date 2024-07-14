let rowOfElements = document.getElementById('rowOfElements')
let rowOfSearch = document.getElementById('rowOfSearch')


//opening and closing sidenav
$('#openClose').on('click', function () {
    closeOpen()
})
function closeOpen() {
    let width = $('.blackBox').width()
    let left = $('.side-nav').css('left')

    if (left == "0px") {
        $('.side-nav').animate({ left: -width }, 1000)
        $('#openClose').addClass('fa-bars').removeClass('fa-xmark')

    } else {
        $('.side-nav').animate({ left: '0px' }, 1000)
        $('#openClose').addClass('fa-xmark').removeClass('fa-bars')
    }
}
//fetch meals api
async function getMeals() {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
    let result = await data.json()
    console.log(result.meals)
    displayMealsFirstRun(result.meals)
}
getMeals()

// displaying meals (first run)
function displayMealsFirstRun(arr) {
    let dev = ``
    for (let i = 0; i < arr.length; i++) {
        dev += ` <div class="col-md-3">
                <div class="content my-2 rounded-2 mealMain" dataId="${arr[i].idMeal}">
                    <img src="${arr[i].strMealThumb}" alt=".." class="w-100 rounded-2">
                    <div class="overlay w-100 h-100 rounded-2 d-grid mealmain">
                        <h2 class="text-black text-capitalize text-start m-auto">${arr[i].strMeal}</h2>
                    </div>
                </div>
            </div>`
    }
    rowOfElements.innerHTML = dev
}
// getting meal deatails by fetching meal id when clicking on meal
$(document).on('click', '.mealMain', function () {
    rowOfElements.innerHTML = ``
    let mealId = $(this).attr('dataId')
    console.log(mealId)
    async function getMealDetails() {
        let data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        let result = await data.json()

        displayMealDetails(result.meals[0])
    }
    getMealDetails()
})

//display meal details 
function displayMealDetails(arr) {
    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (arr[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info mx-2 p-1">${arr[`strMeasure${i}`]} ${arr[`strIngredient${i}`]}</li>`
        }
    }
    let tags = arr.strTags?.split(",")

    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger mx-2 p-1">${tags[i]}</li>`
    }
    let dev = `   <div class="col-md-4"> 
                <div class="content rounded-2 mt-3 mealdetails">
                    <img src="${arr['strMealThumb']}" class="rounded-2 w-100" alt="">
                    <h2 class ="text-white">${arr['strMeal']}</h2>
                </div>
            </div>
            <div class="col-md-8">
                <div class="content mt-3 mealdetails text-white">
                    <h2>Instructions</h2>
                    <P>${arr['strInstructions']}
                    </P>
                    <h2><span class="fw-bolder">Area :</span>${arr['strArea']}
                    </h2>
                    <h2><span class="fw-bolder">Category :</span> ${arr['strCategory']}
                    </h2>
                    <h2><span class="fw-bolder">recepies :</span></h2>
                    <ul class="d-flex list-unstyled flex-wrap">
                        ${ingredients}
                    </ul>
                    <h2><span class="fw-bolder">tags :</span></h2>
                    <ul class="d-flex list-unstyled">
                          ${tagsStr}
                    </ul>
                    <div class="btns d-flex"> <a class="btn btn-danger" href='${arr['strYoutube']}'>youtube</a>
                        <a class="btn btn-success mx-2" href='${arr['strSource']}'>source</a>
                    </div>

                </div>
            </div> 
    `
    rowOfElements.innerHTML = dev
}

// fetch categories api and get data 
async function getCategories() {
    let data = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    let result = await data.json()
    console.log(result.categories)
    displayCategories(result.categories)
}
//display categories
function displayCategories(arr) {
    rowOfElements.innerHTML = ``
    let dev = ``
    for (let i = 0; i < arr.length; i++) {
        dev += ` <div class="col-md-3">
                <div class="content my-2 rounded-2 mealcat " dataCat="${arr[i].strCategory}">
                    <img src="${arr[i].strCategoryThumb}" alt="${arr[i].strCategory}" class="w-100 rounded-2">
                    <div class="overlay w-100 h-100 rounded-2   p-2">
                        <h2 class="text-black text-capitalize text-center m-auto">${arr[i].strCategory}</h2>
                        <p class="text-center mt-2">${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
            </div>`

    }
    rowOfElements.innerHTML = dev
}
//add on click event to categoris
$('#categories').on('click', function () {
    rowOfSearch.innerHTML = ``
    getCategories()
    closeOpen()
})

// getting meals from categories and diplay it
async function getMealsFromCategories(catId) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catId}`)
    let result = await data.json()

    displayMealsFirstRun(result.meals)
}
// add on click event to each category
$(document).on('click', '.mealcat', function () {
    let catmeal = $(this).attr('dataCat')
    getMealsFromCategories(catmeal)
})

// add search boxes on clicking on search
$('#search').on('click', function () {
    rowOfElements.innerHTML = ``
    rowOfSearch.innerHTML = `<div class="col-md-6 mt-3">
                <div class="content"><input type="search" class='form-control searchByName' placeholder="search by meal name"'></div>
</div>
<div class="col-md-6 mt-3">
    <div class="content"><input type="search"class=' form-control searchByFletter'  maxlength="1" placeholder="search by first letter"'></div>
            </div>`

    closeOpen()
})

//searching by meal name
async function searchByName(word) {
    rowOfElements.innerHTML = ""
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${word}`)
    let result = await data.json()
    result.meals ? displayMealsFirstRun(result.meals) : displayMealsFirstRun([])
}
//add event to search boxes
$(document).on('keyup', '.searchByName', function () {
    let x = $(this).val()
    searchByName(x)
})
//search by first letter
async function searchByFLetter(term) {
    rowOfElements.innerHTML = ""
    term == "" ? term = "a" : "";
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    let result = await data.json()
    result.meals ? displayMealsFirstRun(result.meals) : displayMealsFirstRun([])
}
//add event to search boxes
$(document).on('keyup', '.searchByFletter', function () {
    let x = $(this).val()
    searchByFLetter(x)
})

$('#ingrediants').on('click', function () {
    rowOfElements.innerHTML = ``
    rowOfSearch.innerHTML = ``
    closeOpen()
    getIng()
})

async function getIng() {
    let data = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
    let result = await data.json()
    console.log(result)
    displayIng(result.meals.slice(0, 20))
}
function displayIng(arr) {
    let dev = ``
    for (let i = 0; i < arr.length; i++) {
        dev += `<div class="col-md-3">
                <div class="content text-center text-white ingcustom" dataID="${arr[i].strIngredient}">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h2>${arr[i].strIngredient}</h2>
                    <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>`

    }
    rowOfElements.innerHTML = dev
}
$(document).on('click', '.ingcustom', function () {
    let x = $(this).attr('dataID')
    console.log(x)
    getMealsFromIng(x)
})

async function getMealsFromIng(ingredients) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    let result = await data.json()
    displayMealsFirstRun(result.meals)
}

$('#area').on('click', function () {
    rowOfSearch.innerHTML = ``
    rowOfElements.innerHTML = ``
    closeOpen()
    getArea()
})
async function getArea() {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let result = await data.json()
    displayArea(result.meals)
}
function displayArea(array) {
    let dev = ``
    for (let i = 0; i < array.length; i++) {
        dev += `   <div class="col-md-3">
                <div class=" text-center text-white areacust my-2" area='${array[i].strArea}'>
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${array[i].strArea}</h3>
                </div>
            </div>`

    }
    rowOfElements.innerHTML = dev
}

$(document).on('click', '.areacust', function () {
    let x = $(this).attr('area')
    getMealsFromArea(x)
})

async function getMealsFromArea(area) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let result = await data.json()
    displayMealsFirstRun(result.meals)
}
$('#contact').on('click', function () {
    rowOfSearch.innerHTML = ``
    rowOfElements.innerHTML = ``
    closeOpen()
    contact()
})
function contact() {
    let dev = `   <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
                <div class="container w-75 text-center">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                            <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Special characters and numbers not allowed
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
                            <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Email not valid *exemple@yyy.zzz
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
                            <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Enter valid Phone Number
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
                            <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Enter valid age
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="passwordInput" type="password" class="form-control "
                                placeholder="Enter Your Password">
                            <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Enter valid password *Minimum eight characters, at least one letter and one number:*
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                            <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Enter valid repassword
                            </div>
                        </div>
                    </div>
                    <button id="submitBtn" disabled="true" class="btn btn-outline-danger px-2 mt-3">Submit</button>
                </div>
            </div>`
    rowOfElements.innerHTML = dev
}





function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}
function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}
function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}
function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}
function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}
function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}
let nameInput = false
let emailInput = false
let phoneInput = false
let ageInput = false
let passwordInput = false
let repasswordInput = false


$(document).on('focus', '.form-control', function () {
    if (this.id == "nameInput") nameInput = true;
    if (this.id == "emailInput") emailInput = true;
    if (this.id == "phoneInput") phoneInput = true;
    if (this.id == "ageInput") ageInput = true;
    if (this.id == "passwordInput") passwordInput = true;
    if (this.id == "repasswordInput") repasswordInput = true;
})

function inputsValidation() {
    if (nameInput == true) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")
            console.log('done')
        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")
        }
    }
    if (emailInput == true) {
        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")
        }
    }
    if (phoneInput == true) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")
        }
    }
    if (ageInput == true) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")
        }
    }
    if (passwordInput == true) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")
        }
    }
    if (repasswordInput == true) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")
        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

$(document).on('keyup', '.form-control', function () {
    inputsValidation()
})
