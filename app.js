const app = Sammy('#rooter', function(){
    this.use('Handlebars', 'hbs');
    // let name = window.sessionStorage.setItem('name', '');
    let loggedIn = window.sessionStorage.getItem('user') != null;
    let user = window.sessionStorage.getItem('user');

    let names = window.sessionStorage.getItem('name') != null;
    let name = window.sessionStorage.getItem('name');

    let recipes = window.sessionStorage.getItem('recipe') != null;
    let recipe = window.sessionStorage.getItem('recipe');

    let ids = window.sessionStorage.getItem('id') != null;
    let id = window.sessionStorage.getItem('id');

    document.cookie = "promo_shown=1; Max-Age=2600000; SameSite=None; Secure";

    class RouteController {
        handleHomeRoute(context){
            context.loggedIn = loggedIn;
            context.user = user;
            console.log(user);

            context.name = name;
            console.log(name);

            context.load('/views/header.hbs')
            .then((headerPartial) => {
                context.load('/views/footer.hbs').then((footerPartial)=> {
                    context.partials = {
                        header: headerPartial,
                        footer: footerPartial
                    };
                    context.partial('./views/index.hbs');
                    // context.name = name;
                });
                
            });
        }
        handleRegisterRoute(context) {
            context.loggedIn = loggedIn;
            context.user = user;
            context.load('/views/header.hbs').then(setInterval(() => {
                $('#registrationImage').fadeIn(3500);
            }, 1000))
            .then((headerPartial) => {
                context.load('/views/footer.hbs').then((footerPartial) => {
                    context.partials = {
                        header: headerPartial,
                        footer: footerPartial
                    };
                    context.partial('/views/register.hbs');
                });
                
            });
        }
        handleLoginRoute(context){
            context.loggedIn = loggedIn;
            context.load('/views/header.hbs')
            .then((headerPartial) => {
                context.load('/views/footer.hbs').then((footerPartial) => {
                    context.partials = {
                        header: headerPartial,
                        footer: footerPartial
                    };

                    $('#loadingImage').hide();
                    context.partial('/views/login.hbs');
                });
            });
        }

        handleDetailsRoute(context){
            
            context.loggedIn = loggedIn;
            
            context.user = user;
            context.recipe = recipe; 

            const id = context.params.id;
            console.log(id);

            console.log(window.sessionStorage);
            let url = 'https://baas.kinvey.com/appdata/kid_B1fSQN7fw/recipes/'+id;
            let auth = window.sessionStorage.loggedIn;

            let jsonDataObj = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Kinvey ' + auth
                }
            };

            fetch(url, jsonDataObj).then(function (res) {
                
                if(res.ok){
                    res.json().then(function(resAgain) {
                        console.log(resAgain);
                        context.recipe = resAgain;
                    });
                }
                // console.log(res);
            }).then(function(){
                context.load('/views/header.hbs')
                    .then((headerPartial) => {
                        context.load('/views/footer.hbs').then((footerPartial) => {
                            context.partials = {
                                header: headerPartial,
                                footer: footerPartial
                            };
                            context.partial('/views/details.hbs');
                        });
                    });
            });
        }

        handleEditRoute(context){
            let loadingNotification = function loading() {
                $('#loadingBox').toggle();
                $('#loadingImage').toggle();
            };
            context.loggedIn = loggedIn;
            context.user = user;
            context.recipe = recipe;
            console.log(recipe);

            const id = context.params.id;
            console.log(id);

            let url = 'https://baas.kinvey.com/appdata/kid_B1fSQN7fw/recipes/' + id;
            let auth = window.sessionStorage.loggedIn;

            let jsonDataObj = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Kinvey ' + auth
                }
            };

            fetch(url, jsonDataObj, loadingNotification()).then(function (res) {
                if (res.ok) {
                    loadingNotification();
                    res.json().then(function (resAgain) {
                        console.log(resAgain);
                        context.recipe = resAgain;
                    });
                } else {
                    this.redirect('#/not-found');
                }
                // console.log(res);
            }).then(function() {
                context.load('/views/header.hbs')
                    .then((headerPartial) => {
                        context.load('/views/footer.hbs').then((footerPartial) => {
                            context.partials = {
                                header: headerPartial,
                                footer: footerPartial
                            };
                            context.partial('/views/edit.hbs');
                        });
                    });
            });
        }

        handleSharedRecipesRoute(context){
            context.loggedIn = loggedIn;
            context.user = user;
            
            context.recipe = recipe;
            context.id = id;

            let url = 'https://baas.kinvey.com/appdata/kid_B1fSQN7fw/recipes';
            let auth = window.sessionStorage.loggedIn;
            // let recipes = window.sessionStorage.recipes;

            let jsonDataObj = {
                method: 'GET',
                // mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Kinvey ' + auth
                }
            };

            fetch(url, jsonDataObj).then(function (res) {

                loggedIn = true;
                // console.log(res);
                res.json().then(function (response) {

                    let allRecipes = response;
                    context.hasRecipes = (allRecipes.length > 0 ? true : false);
                    context.recipe = allRecipes;
                    
                    
                    recipes = window.sessionStorage.setItem('recipe', response);
                    id = window.sessionStorage.setItem('id', response._id);
                    // src = window.sessionStorage.setItem('id', response._id);

                    console.log(allRecipes);
                });
            })
            .then(function(){
                context.load('/views/header.hbs')
                    .then((headerPartial) => {
                        context.load('/views/footer.hbs').then((footerPartial) => {
                            context.partials = {
                                header: headerPartial,
                                footer: footerPartial
                            };
                            context.partial('/views/shared_recipes.hbs');
                        });
                    });
            });
        }

        handleShareRecipesRoute(context){
            context.loggedIn = loggedIn;
            context.user = user;

            context.load('/views/header.hbs')
            .then((headerPartial) => {
                context.load('/views/footer.hbs').then((footerPartial) => {
                    context.partials = {
                        header: headerPartial,
                        footer: footerPartial
                    };
                    
                    context.partial('/views/share.hbs');
                });
            });
        }
        handleNotFoundRecipesRoute(context){
            context.loggedIn = loggedIn;
            context.user = user;
            context.load('/views/header.hbs')
            .then((headerPartial) => {
                context.load('/views/footer.hbs').then((footerPartial) => {
                    context.partials = {
                        header: headerPartial,
                        footer: footerPartial
                    };
                    context.partial('/views/not_found.hbs');
                });
            });
        }
    }

    class DataController {
        //******************* login data route *******************// 
        login({params}) {
            let loadingNotification = function loading() {
                $('#loadingBox').toggle();
                $('#loadingImage').toggle();
            };

            let success = function success() {
                $('#successBox').click(function () {
                    console.log('success clicked');
                    $('#successBox').addClass('close');
                    $('#successBox').attr('data-dismiss', 'alert');
                });
                $('#successBox').fadeTo(5000, 500).slideUp(500, function () {
                    $('#successBox').slideUp(5000);

                });
            };

            let fail = function fail() {
                $('#errorBox').click(function () {
                    console.log('success clicked');
                    $('#errorBox').addClass('close');
                    $('#errorBox').attr('data-dismiss', 'alert');
                });
                $('#errorBox').fadeTo(5000, 500).slideUp(500, function () {
                    $('#errorBox').slideUp(5000);
                });
            };

            const {username, password} = params;

            let url = 'https://baas.kinvey.com/user/kid_B1fSQN7fw/login';

            console.log(url);

            let authorization = btoa(`${username}:${password}`);
            console.log(authorization);

            let jsonDataObj = {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + authorization
                },
                body: JSON.stringify({
                    username: username,
                    password:password
                })
            };

            fetch(url, jsonDataObj, loadingNotification()).then(res => {
                console.log(res);
                if(res.ok){
                    loadingNotification();
                    success();
                    res.json().then(JSONresponse => {
                        console.log(JSONresponse);
                        window.sessionStorage.setItem('user', JSONresponse.username);
                        
                        window.sessionStorage.setItem('loggedIn', JSONresponse._kmd.authtoken);
                        window.sessionStorage.setItem('name', `${JSONresponse.firstName} ${JSONresponse.lastName}`);

                        loggedIn = true;
                        user = JSONresponse.username;

                        let name = `${JSONresponse.firstName} ${JSONresponse.lastName}`;
                        console.log(name);
                        
                        $('#defaultRegisterFormUsername').val('');
                        $('#defaultRegisterFormPassword').val('');
                        
                        // redirect and prevent ability to go back after logout 
                        setInterval(() => {
                            window.location.replace('#/');
                        }, 6000);
                    });
                } else {
                    fail();
                    loadingNotification();
                    // this.redirect('#/register');
                    setInterval(() => {
                        window.location.replace('#/register');
                    }, 15000);
                    console.log(res.status);
                }
                
                
            });
            
            console.log('logged in!');
        }

        logout(context){
            // helper 
            let success = function success() {
                $('#successBox').click(function () {
                    console.log('success clicked');
                    $('#successBox').addClass('close');
                    $('#successBox').attr('data-dismiss', 'alert');
                });
                $('#successBox').fadeTo(5000, 500).slideUp(500, function () {
                    $('#successBox').slideUp(5000);

                });
            };
            let url = 'https://baas.kinvey.com/user/kid_B1fSQN7fw/_logout';
            console.log(url);

            let authToken = window.sessionStorage.loggedIn;

            console.log(authToken);

            let jsonDataObj = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Kinvey ' + authToken
                },
            };
            fetch(url, jsonDataObj).then(res => {
                console.log(res);
                if(res.ok){
                    window.sessionStorage.clear();
                    success();
                    loggedIn = false;
                    this.redirect('/');
                } else {
                    console.log(res.status);
                    window.sessionStorage.clear();
                    this.redirect('#/not-found');
                }
                
            });
            
            console.log('logged the shibang out!');
        }

        addRecipe({params}){
            let {meal, ingredients, prepMethod, description, foodImageURL, category} = params;
            let passed = true;
            
            let mealPass = meal.length >= 4;
            let ingredientsPass = ingredients.length >= 2;

            let prepMethodPass = prepMethod.length >= 10;
            let descriptionPass = description.length >= 10;

            let foodImageURLPass = validURL(foodImageURL);
            // let categoryPass = category == 'Vegetables and legumes/beans' || 'Fruits' || 'Grain Food' || 'Milk, cheese, eggs and alternatives' || 'Lean meats and poultry, fish and alternatives';

            passed = mealPass && ingredientsPass && prepMethodPass && descriptionPass && foodImageURLPass;
            
            let categoryImageURLObj = {
                vegetables: 'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg',
                grainFood: 'https://cdn.pixabay.com/photo/2014/12/15/13/40/spaghetti-569067_960_720.jpg',
                fruits: 'https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg',
                milkCheese: 'https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg',
                meats: 'https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg',

            };

            let likesCounter = 0;
            let categoryImageURL;

            switch (category) {
                case 'Vegetables and legumes/beans': categoryImageURL = categoryImageURLObj.vegetables;
                    break;
                case 'Grain Food': categoryImageURL = categoryImageURLObj.grainFood;
                    break;
                case 'Fruits': categoryImageURL = categoryImageURLObj.fruits;
                    break;
                case 'Milk, cheese, eggs and alternatives': categoryImageURL = categoryImageURLObj.milkCheese;
                    break;
                case 'Lean meats and poultry, fish and alternatives': categoryImageURL = categoryImageURLObj.meats;
                    break;
                default:
                    break;
            }

            let url = 'https://baas.kinvey.com/appdata/kid_B1fSQN7fw/recipes';
            let auth = window.sessionStorage.loggedIn;
            ingredients = ingredients.split(', ');
            console.log(ingredients);

            let jsonDataObj = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Kinvey ' + auth
                }, 
                body: JSON.stringify({
                    meal: meal, 
                    ingredients: ingredients,
                    prepMethod: prepMethod, 
                    description: description, 
                    foodImageURL: foodImageURL, 
                    category: category, 
                    categoryImageURL: categoryImageURL, 
                    likesCounter: likesCounter
                })
            };

            let fail = function fail(message) {
                $('#errorBox').click(function () {
                    console.log('fail clicked');
                    $('#errorBox').addClass('close');
                    $('#errorBox').attr('data-dismiss', 'alert');
                });
                $('#errorBox').fadeTo(5000, 500).slideUp(500, function () {
                    $('#errorBox').slideUp(5000);
                    //TODO Trying to swap the text per error notification ********************* NOT WORKING *************************
                    // document.getElementById('#errorBox').innerHTML =`<p>${message}</p>`;
                    // document.getElementById('#errorBox').innerHTML = `<p>${message}</p>`;
                    // $('#errorBox').text(`${message}`);
                    // $('#errorBox').set().html(`${message}`);
                    
                });
            };

            if(passed){
                let success = function success() {
                    $('#successBox').click(function () {
                        console.log('success clicked');
                        $('#successBox').addClass('close');
                        $('#successBox').attr('data-dismiss', 'alert');
                    });
                    $('#successBox').fadeTo(5000, 500).slideUp(500, function () {
                        $('#successBox').slideUp(5000);

                    });
                    $('#defaultRecepieShareMeal').val('');
                    $('#defaultRecepieShareIngredients').val('');
                    $('#defaultRecepieShareMethodOfPreparation').val('');
                    $('#defaultRecepieShareDescription').val('');
                    $('#defaultRecepieShareFoodImageURL').val('');
                };
                
                fetch(url, jsonDataObj).then(res => {
                    success();
                    console.log(res);
                    this.redirect('#/shared');
                });
            } else {
                if (!mealPass){
                    $("#defaultRecepieShareMeal").css("border", "3px solid red");
                    $('#defaultRecepieShareMeal').attr("placeholder", "Must be 4 characters or longer");

                    fail('this is the error messeage i want displayed');
                    return false;

                } else {
                    $("#defaultRecepieShareMeal").css("border", "3px solid green");
                }

                if (!ingredientsPass) {
                    $("#defaultRecepieShareIngredients").change().css("border", "3px solid red");
                    $('#defaultRecepieShareIngredients').attr("placeholder", "Must be 4 characters or longer");

                    fail();
                    return false;

                } else {
                    $("#defaultRecepieShareMeal").css("border", "3px solid green");
                }

                if (!prepMethodPass) {
                    $("#defaultRecepieShareMethodOfPreparation").css("border", "3px solid red");
                    $('#defaultRecepieShareMethodOfPreparation').attr("placeholder", "Must be 10 characters or longer");

                    fail();
                    return false;

                } else {
                    $("#defaultRecepieShareMeal").css("border", "3px solid green");
                }

                if (!descriptionPass) {
                    $("#defaultRecepieShareDescription").css("border", "3px solid red");
                    $('#defaultRecepieShareDescription').attr("placeholder", "Must be 10 characters or longer");

                    fail();
                    return false;

                } else {
                    $("#defaultRecepieShareMeal").css("border", "3px solid green");
                }

                if (!foodImageURLPass) {
                    $("#defaultRecepieShareFoodImageURL").css("border", "3px solid red");
                    $('#defaultRecepieShareFoodImageURL').attr("placeholder", "Must be image link");

                    fail();
                    return false;

                } else {
                    $("#defaultRecepieShareMeal").css("border", "3px solid green");
                }

                throw 'error';
            }
            console.log('Added Recipe');
        }

        handleAddUser({ params }){
            const {firstName, lastName, username, password} = params;
            let passed = true;

            let firstNamePass = firstName.length >= 2;
            let lastNamePass = lastName.length >= 2;
            
            let usernamePass = username.length >= 3;
            let passwordPass = password.length >= 6;
            
            passed = firstNamePass & lastNamePass & usernamePass & passwordPass;

            setInterval(() => {
                $('#registrationImage').toggle();
            }, 1500);

            if(passed) {
                let newUser = {
                    firstName,
                    lastName,
                    username,
                    password
                };
                
                window.sessionStorage.setItem('user', newUser);

                console.log(newUser);
                loggedIn = true;

                let url = 'https://baas.kinvey.com/user/kid_B1fSQN7fw';

                let jsonDataObj = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic a2lkX0IxZlNRTjdmdzo3ODY3OTVjNWQxNzM0YTU4YjNiNjA4NzUwYTExMmNjMA=='
                    },
                    
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        password: password
                    })
                };

                fetch(url, jsonDataObj).then(res => {
                    console.log(res);
                });

                this.redirect('#/');
            } else {
                $('#errorBox').toggle();
                if (!firstNamePass) {
                        $("#defaultRegisterFormFirstName").css("border", "3px solid red");

                        $('#defaultRegisterFormFirstName').attr("placeholder", "Must be 2 characters or longer");
                        return false;
                }
                if (!lastNamePass) {
                        $("#defaultRegisterFormLastName").css("border", "3px solid red");

                        $('#defaultRegisterFormLastName').attr("placeholder", "Must be 2 characters or longer");
                        return false;
                }
                if (!usernamePass) {
                        $("#defaultRegisterFormUsername").css("border", "3px solid red");

                        $('#defaultRegisterFormUsername').attr("placeholder", "Must be 2 characters or longer");
                        return false;
                }
                if (!password) {
                        $("#defaultRegisterFormPassword").css("border", "3px solid red");

                        $('#defaultRegisterFormPassword').attr("placeholder", "Must be 2 characters or longer");
                        return false;
                }
                if (!password) {
                        $("#defaultRegisterRepeatPassword").css("border", "3px solid red");

                        $('#defaultRegisterRepeatPassword').attr("placeholder", "Passwords do not match");
                        return false;
                }
            }
            
            console.log('added user');
        }

        handleEdit({ params }) {
            let {
                meal,
                ingredients,
                prepMethod,
                description,
                foodImageURL,
                category, 
                id
            } = params;

            // context.loggedIn = loggedIn;
            // context.user = user;
            // context.recipe = recipe;
            params.id = this.id;
            // context.id = window.sessionStorage.getItem('_id');
            console.log(id);
            // console.log(recipe);
            // const id = context.id;
            // const id = params.context.id;

            let passed = true;

            let mealPass = meal.length >= 4;
            let ingredientsPass = ingredients.length >= 2;

            let prepMethodPass = prepMethod.length >= 10;
            let descriptionPass = description.length >= 10;
            console.log('put hit');
            let foodImageURLPass = validURL(foodImageURL);
            // let categoryPass = category == 'Vegetables and legumes/beans' || 'Fruits' || 'Grain Food' || 'Milk, cheese, eggs and alternatives' || 'Lean meats and poultry, fish and alternatives';

            passed = mealPass && ingredientsPass && prepMethodPass && descriptionPass && foodImageURLPass;

            let categoryImageURLObj = {
                vegetables: 'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg',
                grainFood: 'https://cdn.pixabay.com/photo/2014/12/15/13/40/spaghetti-569067_960_720.jpg',
                fruits: 'https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg',
                milkCheese: 'https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg',
                meats: 'https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg',

            };

            // let likesCounter = 0;
            let categoryImageURL;

            switch (category) {
                case 'Vegetables and legumes/beans':
                    categoryImageURL = categoryImageURLObj.vegetables;
                    break;
                case 'Grain Food':
                    categoryImageURL = categoryImageURLObj.grainFood;
                    break;
                case 'Fruits':
                    categoryImageURL = categoryImageURLObj.fruits;
                    break;
                case 'Milk, cheese, eggs and alternatives':
                    categoryImageURL = categoryImageURLObj.milkCheese;
                    break;
                case 'Lean meats and poultry, fish and alternatives':
                    categoryImageURL = categoryImageURLObj.meats;
                    break;
                default:
                    break;
            }

            let url = 'https://baas.kinvey.com/appdata/kid_B1fSQN7fw/recipes/'+id;
            let auth = window.sessionStorage.loggedIn;
            ingredients = ingredients.split(', ');


            let jsonDataObj = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Kinvey ' + auth
                },
                body: JSON.stringify({
                    meal: meal,
                    ingredients: ingredients,
                    prepMethod: prepMethod,
                    description: description,
                    foodImageURL: foodImageURL,
                    category: category,
                    categoryImageURL: categoryImageURL,
                    // likesCounter: likesCounter
                })
            };

            let fail = function fail(message) {
                $('#errorBox').click(function () {
                    console.log('fail clicked');
                    $('#errorBox').addClass('close');
                    $('#errorBox').attr('data-dismiss', 'alert');
                });
                $('#errorBox').fadeTo(5000, 500).slideUp(500, function () {
                    $('#errorBox').slideUp(5000);
                    //TODO Trying to swap the text per error notification ********************* NOT WORKING *************************
                    // document.getElementById('#errorBox').innerHTML =`<p>${message}</p>`;
                    // document.getElementById('#errorBox').innerHTML = `<p>${message}</p>`;
                    // $('#errorBox').text(`${message}`);
                    // $('#errorBox').set().html(`${message}`);

                });
            };

            if (passed) {
                let success = function success() {
                    $('#successBox').click(function () {
                        console.log('success clicked');
                        $('#successBox').addClass('close');
                        $('#successBox').attr('data-dismiss', 'alert');
                    });
                    $('#successBox').fadeTo(5000, 500).slideUp(500, function () {
                        $('#successBox').slideUp(5000);

                    });
                    $('#defaultRecepieEditMeal').val('');
                    $('#defaultRecepieEditIngredients').val('');
                    $('#defaultRecepieEditMethodOfPreparation').val('');
                    $('#defaultRecepieEditDescription').val('');
                    $('#defaultRecepieEditFoodImageURL').val('');
                };

                fetch(url, jsonDataObj).then(res => {
                    success();
                    console.log(res);
                    this.redirect('#/details/'+id);
                });
            } else {
                if (!mealPass) {
                    $("#defaultRecepieEditMeal").css("border", "3px solid red");
                    $('#defaultRecepieEditMeal').attr("placeholder", "Must be 4 characters or longer");

                    fail('this is the error messeage i want displayed');
                    return false;

                } else {
                    $("#defaultRecepieEditMeal").css("border", "3px solid green");
                }

                if (!ingredientsPass) {
                    $("#defaultRecepieEditIngredients").change().css("border", "3px solid red");
                    $('#defaultRecepieEditIngredients').attr("placeholder", "Must be 4 characters or longer");

                    fail();
                    return false;

                } else {
                    $("#defaultRecepieEditMeal").css("border", "3px solid green");
                }

                if (!prepMethodPass) {
                    $("#defaultRecepieEditMethodOfPreparation").css("border", "3px solid red");
                    $('#defaultRecepieEditMethodOfPreparation').attr("placeholder", "Must be 10 characters or longer");

                    fail();
                    return false;

                } else {
                    $("#defaultRecepieEditMeal").css("border", "3px solid green");
                }

                if (!descriptionPass) {
                    $("#defaultRecepieEditDescription").css("border", "3px solid red");
                    $('#defaultRecepieEditDescription').attr("placeholder", "Must be 10 characters or longer");

                    fail();
                    return false;

                } else {
                    $("#defaultRecepieEditMeal").css("border", "3px solid green");
                }

                if (!foodImageURLPass) {
                    $("#defaultRecepieEditFoodImageURL").css("border", "3px solid red");
                    $('#defaultRecepieEditFoodImageURL').attr("placeholder", "Must be image link");

                    fail();
                    return false;

                } else {
                    $("#defaultRecepieEditMeal").css("border", "3px solid green");
                }

                throw 'error';
            }
            console.log('Edited Recipe');
        }

        handleLike({params}){
            context.loggedIn = loggedIn;
            const id = params.context.id;

            let url = 'https://baas.kinvey.com/appdata/kid_B1fSQN7fw/recipes/' + id;
            let auth = window.sessionStorage.loggedIn;
            console.log(id);

            let jsonDataObj = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Kinvey ' + auth
                },
                body: JSON.stringify({
                    likesCounter: likesCounter
                })
            };
            likesCounter += 1;

            fetch(url, jsonDataObj).then(function(response){

                if(response.ok){
                    response.json().then(function(res) {
                        console.log(res);
                        
                    }).then(function(){
                        redirect('#/details/'+id);
                    });
                }
            });


        }
    }
/* 
https: //baas.kinvey.com/appdata/kid_B1fSQN7fw/recipes
*/
    let route = new RouteController();
    let data = new DataController();

    //*********************** Routes ***********************// 
    // home route 
    this.get("/", route.handleHomeRoute);

    // register route 
    this.get("#/register", route.handleRegisterRoute);

    // login routes 
    this.get("#/login", route.handleLoginRoute);
    this.post("#/login", data.login);

    //logout routes
    this.get('#/logout', data.logout);

    // add user
    this.get('#/user', route.handleRegisterRoute); // ????????????????***********
    this.post('#/user', data.handleAddUser);

    // details route 
    this.get("#/details/:id", route.handleDetailsRoute);

    // edit routes 
    this.get("#/edit/:id", route.handleEditRoute);
    this.put("#/edit/:id", data.handleEdit);

    // shared routes 
    this.get("#/shared", route.handleSharedRecipesRoute);
    // this.get("#/shared", data.handleGetRecipes);
    

    // share route 
    this.get("#/share", route.handleShareRecipesRoute);
    this.post("#/share", data.addRecipe);
    // details route 
    // this.get("#/details", route.handleDetailsRoute);
    
    // like route
    this.put('#/like/:id', data.handleLike);

    // not found route 
    this.get("#/not-found", route.handleNotFoundRecipesRoute);

});

(function(){
    app.run();
})();

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    //console.log(pattern.test(str));
    return !!pattern.test(str);
}
/*
<form class="text-center p-5 form-layout" action="#" method="POST" id="share-receipt-form">
            <p class="h4 mb-4">Share Recipe</p>

            <input type="text" id="defaultRecepieShareMeal" name="meal" class="form-control mb-4" placeholder="Meal">

            <input type="text" id="defaultRecepieShareIngredients" name="ingredients" class="form-control mb-4"
                placeholder="Ingredients">

            <textarea type="text" id="defaultRecepieShareMethodOfPreparation" name="prepMethod"
                class="form-control mb-4" placeholder="Method of preparation"></textarea>

            <textarea type="text" id="defaultRecepieShareDescription" name="description" class="form-control mb-4"
                placeholder="Description"></textarea>

            <input type="text" id="defaultRecepieShareFoodImageURL" name="foodImageURL" class="form-control mb-4"
                placeholder="Food Image URL...">

            <select name="category">
                <option selected>Select category...</option>
                <option selected>Vegetables and legumes/beans</option>
                <option selected>Fruits</option>
                <option selected>Grain Food</option>
                <option selected>Milk, cheese, eggs and alternatives</option>
                <option selected>Lean meats and poultry, fish and alternatives</option>
            </select>

            <button class="btn btn-danger w-25 m-auto my-4 btn-block" type="submit">Share it</button>
        </form>
*/