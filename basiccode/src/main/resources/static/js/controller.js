var TAKE_A_LOT_APP = angular.module("TakealotWebApp.controllers", []).controller("TakealotWebAppCtrl", function ($scope, $rootScope, $location, PostToServerService, UserGetService, ProductGetService) {



    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    //                                              data that is loaded every time the controller is loaded
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    $rootScope.inUser = angular.fromJson(sessionStorage.getItem("userIn"));

    var pData = sessionStorage.getItem("productsData");
    $scope.cart = localStorage.getItem("cartData");
    $scope.selectedList = [];
    $rootScope.loginStatus = sessionStorage.getItem("loginStatus");


    $scope.check = function (sss) {
        alert(JSON.stringify(sss));
        alert($scope.image);
    };
    if ($scope.cart === null) {

        $scope.cart = [];
        localStorage.setItem("cartData", JSON.stringify($scope.cart));

    } else {
        $scope.cart = convertCartDataToArray($scope.cart);
    }

    if (pData === null) {

        $scope.shopProducts = [];
        if (sessionStorage) {
            // LocalStorage is supported!
            ProductGetService.getProductsFromServer("/TAKEALOT/displayAllProducts").then(function (response) {

                var products = response.data.products;
                alert(response.data.products[0].category);
                var pData = JSON.stringify(products);
                //populate session storage with products'data from the backend database
                sessionStorage.setItem("productsData", pData);
                parseIntoArray(pData);
               
            });
        }

    } else {
        parseIntoArray(pData);
    }

//display product on the main page

    function mainPage(){
        
    $rootScope.firstLine = [];
    $rootScope.secondLine = [];
    $rootScope.thirdLine = [];
    
    $rootScope.link1 = "";
    $rootScope.link2 = "";
    $rootScope.link3  = "";

        

        for (var i = 0, max = $scope.shopProducts.length; i < max; i++) {
            
            if ($scope.shopProducts[i].CATEGORY.toUpperCase() === "computers".toUpperCase()) {

                if ($rootScope.firstLine.length < 7)
                {
                    $rootScope.link1 = "Lookin for the hottest deals on computers? click here";
                    $rootScope.firstLine.push($scope.shopProducts[i]);
                }

            } else if ($scope.shopProducts[i].CATEGORY.toUpperCase() === "books".toUpperCase()) {

                if ($rootScope.secondLine.length < 7)
                {
                    $rootScope.link2 = "All the interesting books are here";
                    $rootScope.secondLine.push($scope.shopProducts[i]);
                }
                    

            } else if ($scope.shopProducts[i].CATEGORY.toUpperCase() === "cellphones".toUpperCase()) {
                
                if ($rootScope.thirdLine.length < 7)
                {
                    $rootScope.link3  = "Cell phones under 3000 - high performance , low prices";
                    $rootScope.thirdLine.push($scope.shopProducts[i]);
                }
                   
            }
            
        }

    };



//Converting server response data into JavaScript array of objects
    function parseIntoArray(productsData) {
        $scope.shopProducts = [];
        var jsonObj = JSON.parse(productsData);
        
        for (var i = 0, max = jsonObj.length; i < max; i++) {

            var prod = {
                ID: jsonObj[i].id,
                DESC: jsonObj[i].productDesc,
                PRICE: jsonObj[i].price,
                CATEGORY: jsonObj[i].category,
                IMAGEURL: jsonObj[i].imageURL
            };
            $scope.shopProducts.push(prod);
            
            alert(JSON.stringify($scope.shopProducts));
            alert($scope.shopProducts[0].ID);
        }
        
        mainPage();
    }

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                  Function for manipulating customer details
//---------------------- ----------------------------------------------------------------------------------------------------------------------------------
    $scope.updateUser = function () {

        var user = $rootScope.inUser;

        var isValid = validateUpdateDetailsForm(user);

        if (isValid) {



            user.dateOfBirth = $scope.inUser.day + " " + $scope.inUser.month + " " + $scope.inUser.year;

            var requestData = {
                newData: user,
                sessionID: sessionStorage.getItem("sessionID")
            };

            if (sessionStorage.getItem("sessionID") !== null && sessionStorage.getItem("userIn") !== null) {

                PostToServerService.sendToSever(user, "/TAKEALOT/updateProfile").then(function (response) {

                    alert(response.data.message);

                    var requestStatus = response.data.HttpStatus;

                    if (requestStatus === "FOUND") {

                        var user = response.data.userIn;
//                        var sessionID = response.data.sessionID;
                        sessionStorage.setItem("userIn", JSON.stringify(user));
//                        sessionStorage.setItem("sessionID", sessionID);
                        if (user !== null)
                        {
                            var title;
                            if (user.gender === "Male") {

                                title = "Hi Mr. ";
                            } else {
                                title = "Hi Ms. ";
                            }

                            $rootScope.loginStatus = title + " " + user.lastname;
                            sessionStorage.setItem("loginStatus", $rootScope.loginStatus);
                        }
                    }

                });

                $rootScope.inUser = {};

                $scope.goto("/myAccount");
            }
        }
    };

    $scope.changePassword = function () {

        var user = $rootScope.inUser;

        var isValid = validateChangePasswordForm(user);

        if (isValid) {

            if ($scope.inUser.oldPassword === $rootScope.inUser.password) {

                if (sessionStorage.getItem("sessionID") !== null && sessionStorage.getItem("userIn") !== null) {

                    $rootScope.inUser.password = $scope.inUser.newPassword;
                    var user = $rootScope.inUser;

                    alert(user);

//                    var requestData = {
//                        newData: JSON.stringify(user),
//                        sessionID: sessionStorage.getItem("sessionID")
//                    };

                    PostToServerService.sendToSever(user, "/TAKEALOT/updateProfile").then(function (response) {
                        alert(response.data.message);
                        var requestStatus = response.data.HttpStatus;

                        if (requestStatus === "FOUND") {

                            $rootScope.inUser = response.data.userIn;
//                        var sessionID = response.data.sessionID;               
                            sessionStorage.setItem("userIn", JSON.stringify(user));
                        }

                        $scope.goto(response.data.url);
                    });

                }

            }
        }

        $rootScope.inUser = {};

        $scope.goto("/myAccount");

    };

    $scope.register = function () {

        var user = $scope.user;

        var isValid = validateRegistrationForm(user);

        if (isValid) {

            var reqUrl = "/TAKEALOT/register";
            //
            user.dateOfBirth = $scope.day + " " + $scope.month + " " + $scope.year;

            PostToServerService.sendToSever(user, reqUrl)
                    .then(function (response) {

                        alert(response.data.message);

                        var requestStatus = response.data.HttpStatus;
                        if (requestStatus === "CREATED") {
                            $scope.login("/login");
                        } else {

                        }

                        $scope.goto(response.data.url);
                    });

        } else {

            $scope.goto("/register");
        }


    };

    $scope.login = function () {

        var reqUrl = "/TAKEALOT/login";
        var user = $scope.user;
        PostToServerService.sendToSever(user, reqUrl)
                .then(function (response) {

                    alert(response.data.message);
                    var requestStatus = response.data.HttpStatus;

                    if (requestStatus === "FOUND") {

                        user = response.data.userIn;
                        var sessionID = response.data.sessionID;
                        sessionStorage.setItem("userIn", JSON.stringify(user));
                        sessionStorage.setItem("sessionID", sessionID);

                        if (user !== null)
                        {
                            var title;
                            if (user.gender === "Male") {

                                title = "Hi Mr. ";
                            } else {
                                title = "Hi Ms. ";
                            }

                            $rootScope.loginStatus = title + " " + user.lastname;
                            sessionStorage.setItem("loginStatus", $rootScope.loginStatus);
                        }
                    }

                    if (sessionStorage.getItem("currentUrl") !== null && sessionStorage.getItem("sessionID") !== null) {

                        var url = sessionStorage.getItem("currentUrl");
                        sessionStorage.removeItem("currentUrl");
                        $scope.goto(url);

                    } else {

                        if (user.userRole.toString().toUpperCase() === "admin".toUpperCase()) {

                            $scope.goto("/admin");
                        } else {
                            $scope.goto(response.data.url);
                        }

                    }


                });
    };



    $scope.goto = function (url) {
        $location.path(url);
    };
    $scope.logout = function (url) {


        UserGetService.sendGetRequest("/TAKEALOT" + url + "/" + sessionStorage.getItem("sessionID")+"/"+$rootScope.inUser.id).then(function (response) {
            var status = response.data.status;
            if (status === "OK") {

                sessionStorage.removeItem("loginStatus");
                $rootScope.loginStatus = null;
                sessionStorage.removeItem("userIn");
                sessionStorage.removeItem("sessionID");

            }
        });

        $scope.goto("/");
    };

//------------------------------------------------------------------------------------------------------------------------------------------
//                                                  Validation
//------------------------------------------------------------------------------------------------------------------------------------------

    $scope.emailStyle = {"border": "red #c0c0c0 solid 1px"};
    $scope.passStyle = {"border": "red #c0c0c0 solid 1px"};
    $scope.cellStyle = {"border": "red #c0c0c0 solid 1px"};

    function validateRegistrationForm(user) {

        if (!angular.equals(user.email, user.reEmail)) {

            alert("Emails does not match");

            $scope.emailStyle = {"border": "red solid 1px"};

            return false;
        }
        if (!angular.equals(user.password, user.rePassword)) {

            alert("Passwords does not match");
            $scope.passStyle = {"border": "red solid 1px"};

            return false;
        }

        if (user.cellphonNumber.length !== 10) {

            alert("Cell phone number must be ten digits");
            $scope.cellStyle = {"border": "red solid 1px"};

            return false;
        }


        return true;
    }

    function validateUpdateDetailsForm(user) {

        if (user.cellphonNumber.length !== 10) {

            alert("Cell phone number must be ten digits");
            $scope.cellStyle = {"border": "red solid 1px"};

            return false;
        }

        return true;
    }

    function validateChangePasswordForm(user) {

        if (!angular.equals(user.newPassword, user.reNewPassword)) {

            alert("Passwords does not match");
            $scope.passStyle = {"border": "red solid 1px"};

            return false;
        }

        return true;

    }


    $scope.changePassStyle = function () {

        $scope.passStyle = {"border": "red #c0c0c0 solid 1px"};
    };

    $scope.changeEmailStyle = function () {

        $scope.emailStyle = {"border": "red #c0c0c0 solid 1px"};
    };
    $scope.changeCellStyle = function () {

        $scope.cellStyle = {"border": "red #c0c0c0 solid 1px"};
    };


    /*-----------------------------------------------------------------------------------------------------------------------------------------------
     * Helper Functions
     * ----------------------------------------------------------------------------------------------------------------------------------------------*/

    $scope.changeView = function () {
        $scope.isUpdate = false;
        $scope.isChange = true;
    };
    $scope.updateView = function () {
        $rootScope.inUser = angular.fromJson(sessionStorage.getItem("userIn"));
        $scope.isUpdate = true;
        $scope.isChange = false;
    };

    $scope.manageAccount = function () {

        if (sessionStorage.getItem("sessionID") !== null && sessionStorage.getItem("userIn") !== null)
        {

            $rootScope.inUser = angular.fromJson(sessionStorage.getItem("userIn"));
            $scope.goto("/myAccount");
            //alert($rootScope.inUser.lastname);          
        } else {

            sessionStorage.setItem("currentUrl", "/myAccount");
            $scope.goto("/login");
        }

    };

    $scope.loadCategory = function (category) {

        $rootScope.categoryProducts = [];
        $rootScope.category = category;

        for (var i = 0, max = $scope.shopProducts.length; i < max; i++) {

            if ($scope.shopProducts[i].CATEGORY.toUpperCase() === category.toUpperCase()) {
                $rootScope.categoryProducts.push($scope.shopProducts[i]);
            }
        }

        $scope.goto("/category");
    };
    //---------------------------------------------------------------------------------------------------------------------------------------
    //                                                              Cart Methods
    //---------------------------------------------------------------------------------------------------------------------------------------
    $scope.addQuantity = function (ID) {



        for (var i = 0, max = $scope.cart.length; i < max; i++) {

            if ($scope.cart[i].ID === ID) {

                $scope.cart[i].QUANTITY = $scope.cart[i].QUANTITY + 1;

            }
        }


        localStorage.setItem("cartData", JSON.stringify($scope.cart));

        var cData = localStorage.getItem("cartData");
        $scope.cart = convertCartDataToArray(cData);

        $scope.calcTotal($scope.cart);

        $scope.goto("/cart");
    };

    $scope.subtractQuantity = function (ID) {

        for (var i = 0, max = $scope.cart.length; i < max; i++) {

            if ($scope.cart[i].ID === ID) {

                if ($scope.cart[i].QUANTITY > 1) {
                    $scope.cart[i].QUANTITY = $scope.cart[i].QUANTITY - 1;
                }

            }
        }

        localStorage.setItem("cartData", JSON.stringify($scope.cart));
        var cData = localStorage.getItem("cartData");
        $scope.cart = convertCartDataToArray(cData);

        $scope.calcTotal($scope.cart);

        $scope.goto("/cart");
    };

    $scope.addAndRemove = function (selected, prod) {
        var index = selected.indexOf(prod);

        if (index > -1) {

            selected.splice(index, 1);
        } else {

            selected.push(prod);
        }
    };

    $scope.calcTotal = function (cartProducts) {

        $scope.total = 0;

        for (var i = 0; i < cartProducts.length; i++) {

            $scope.total = $scope.total + cartProducts[i].QUANTITY * cartProducts[i].PRICE;

        }

    };

    $scope.changeState = function (selected, prod) {
        var state = selected.indexOf(prod) > -1;
        return state;
    };

    $scope.removeSelected = function (selected) {

        var cData = localStorage.getItem("cartData");
        $scope.cart = convertCartDataToArray(cData);
        var cartListSize = $scope.cart.length;

        for (var c = 0; c < cartListSize; c++) {

            var isFound = false;
            var indexS = -1;
            var indexC = -1;
            var selectedListSize = selected.length;

            for (var i = 0; i < selectedListSize; i++) {

                if ($scope.cart[c].ID === selected[i].ID) {
                    isFound = true;
                    indexS = i;
                    indexC = c;
                    i = selectedListSize + 100;
                }
            }

            if (isFound) {

                $scope.cart.splice(indexC, 1);
                selected.splice(indexS, 1);
                cartListSize = $scope.cart.length;
                selectedListSize = selected.length;
                c = c - 1;
            }

        }

        localStorage.setItem("cartData", JSON.stringify($scope.cart));
        $scope.calcTotal($scope.cart);

        $scope.goto("/cart");

    };
    $scope.checkout = function () {

        var cData = localStorage.getItem("cartData");
        $scope.cart = convertCartDataToArray(cData);

        var orderData = {
            orderItems: $scope.cart,
            destinationInfo: $scope.destination,
            addressInfo: $scope.address,
            user: sessionStorage.getItem("userIn"),
            sessionID: sessionStorage.getItem("sessionID")

        };


        if (sessionStorage.getItem("sessionID") !== null) {

            PostToServerService.sendToSever(orderData, "/TAKEALOT/checkout").then(function (response) {

                alert(response.data.message);

                if (response.data.status === "CREATED") {

                    localStorage.clear();

                }

            });

            $scope.cart = [];
            $scope.goto("/");

        } else {

            sessionStorage.setItem("currentUrl", "/cart");
            $scope.goto("/login");
        }

    };

    $scope.addToCart = function (id) {

        var cData = localStorage.getItem("cartData");
        var isUnique = true;

        for (var i = 0, max = $scope.shopProducts.length; i < max; i++) {

            if ($scope.shopProducts[i].ID === id) {

                var LineProduct = {
                    ID: $scope.shopProducts[i].ID,
                    DESC: $scope.shopProducts[i].DESC,
                    PRICE: $scope.shopProducts[i].PRICE,
                    CATEGORY: $scope.shopProducts[i].CATEGORY,
                    IMAGEURL: $scope.shopProducts[i].IMAGEURL,
                    QUANTITY: 1
                };

                $scope.cart = convertCartDataToArray(cData);

                for (var i = 0, max = $scope.cart.length; i < max; i++) {

                    if ($scope.cart[i].ID === id) {
                        isUnique = false;
                        $scope.cart[i].QUANTITY = $scope.cart[i].QUANTITY + 1;
                        break;
                    }
                }
                if (isUnique) {
                    $scope.cart.push(LineProduct);
                }

                break;
            }
        }

        localStorage.setItem("cartData", JSON.stringify($scope.cart));
        $scope.goto("/category");
    };

    function convertCartDataToArray(cartData) {
        $scope.cart = [];
        if (cartData !== "" && cartData !== null) {

            var jsonObj = JSON.parse(cartData);
            for (var i = 0, max = jsonObj.length; i < max; i++) {


                var LineProduct = {
                    ID: jsonObj[i].ID,
                    QUANTITY: jsonObj[i].QUANTITY
                };
                var LineProduct = {
                    ID: jsonObj[i].ID,
                    DESC: jsonObj[i].DESC,
                    PRICE: jsonObj[i].PRICE,
                    CATEGORY: jsonObj[i].CATEGORY,
                    IMAGEURL: jsonObj[i].IMAGEURL,
                    QUANTITY: jsonObj[i].QUANTITY
                };
                $scope.cart.push(LineProduct);
            }

        }

        return $scope.cart;
    }

    $scope.forgetPassword = function () {
        $rootScope.message = "Enter your email";
        $scope.goto("/forgotPasswordPage");
    };

    $scope.load = function () {
        ProductGetService.getProductsFromServer("/TAKEALOT/load").then(function (response) {
            alert(response.data.s);
        });
    };

    $scope.submitForm = function (userData) {

        var status = {};

        if ($rootScope.message === "Enter your email") {

            PostToServerService.sendToSever(userData, "/TAKEALOT/forgot").then(function (response) {

                status = response.data.status;

                if (status === "OK") {

                    var customer = response.data.customer;
                    sessionStorage.setItem("customer", JSON.stringify(customer));
                    $rootScope.message = "Provide answer for your security question : " + customer.securityQuestuion + "?";

                    $rootScope.input = " ";
                    $rootScope.submitAnswer = true;
                    $scope.goto("/forgotPasswordPage");

                } else {
                    userData = " ";
                    alert(response.data.message);
                }
            });


        }
        if ($rootScope.submitAnswer === true) {

            var customer = angular.fromJson(sessionStorage.getItem("customer"));

            var data = {
                answer: userData,
                email: customer.email
            };

            PostToServerService.sendToSever(data, "/TAKEALOT/passAnswer").then(function (response) {

                status = response.data.status;
                alert(response.data.message);
                if (status === "OK") {
                    //Reset pop up to the start
                    sessionStorage.removeItem("customer");
                    $scope.userForm = "Enter your email";
                    $scope.goto("/");
                } else {
                    $rootScope.input = "";
                    $scope.forgetPassword();
                }

            });
        }

    };

});

//-------------------------------------------------------------------------------------------------------------------------------------------
//                                                  Admin operations controller
//-------------------------------------------------------------------------------------------------------------------------------------------

TAKE_A_LOT_APP.controller("AdminCtrl", function ($scope, $rootScope, $location, PostToServerService, UserGetService, ProductGetService) {

    $scope.operationStatus = null;
    $rootScope.success = false;
    $rootScope.failure = false;
    displayOrders = false;

    $scope.addNewProduct = function (product) {


        $rootScope.displayOrders = false;
        var newProductData = {
            product: product,
            sessionID: sessionStorage.getItem("sessionID"),
            adminID:$rootScope.inUser.id
        };

        PostToServerService.sendToSever(newProductData, "/TAKEALOT/loadNewProduct").then(function (response) {

            //alert(response.data.message);

            $rootScope.message = response.data.message;
            var status = response.data.status;

            if (status === "CREATED") {

                $scope.product = {};
                $rootScope.success = true;

            } else {

                $rootScope.failure = true;

            }

        });



    };

    $scope.logout = function (url) {


        UserGetService.sendGetRequest("/TAKEALOT" + url + "/" + sessionStorage.getItem("sessionID")+"/"+$rootScope.inUser.id).then(function (response) {
            var status = response.data.status;
            if (status === "OK") {

                sessionStorage.removeItem("loginStatus");
                $rootScope.loginStatus = null;
                sessionStorage.removeItem("userIn");
                sessionStorage.removeItem("sessionID");

            }
        });

        $location.path("/");
    };

    $scope.viewOlders = function () {

        var url = "/TAKEALOT/displayAllOrders/" + sessionStorage.getItem("sessionID")+"/"+$rootScope.inUser.id;

        UserGetService.sendGetRequest(url).then(function (response) {

            //alert(response.data.message);

            $rootScope.message = response.data.message;
            $rootScope.orders = response.data.allOrders;

            var status = response.data.status;

            if (status === "OK") {

                $rootScope.displayOrders = true;
                $rootScope.success = true;
                $rootScope.failure = false;

            } else {

                $rootScope.failure = true;
                $rootScope.displayOrders = false;
                $rootScope.success = false;

            }

        });

    };

    $scope.printInvoice = function () {

        var url = "/TAKEALOT/printInvoice/" + sessionStorage.getItem("sessionID")+"/"+$rootScope.inUser.id;

        UserGetService.sendGetRequest(url).then(function (response) {

            //alert(response.data.message);

            $rootScope.message = response.data.message;
            var status = response.data.status;

            if (status === "OK") {

                $rootScope.displayOrders = false;
                $rootScope.success = true;
                $rootScope.failure = false;
            } else {
                $rootScope.success = false;
                $rootScope.failure = true;

            }

        });

    };

});
//---------------------------------------------------------------------------------------------------------------------------------------------------
//                                                     Modal Controller
//---------------------------------------------------------------------------------------------------------------------------------------------------

//TAKE_A_LOT_APP.controller("modalController", ['$scope', '$modal', '$http',
//
//    function ($scope, $modal, $http) {
//
//        $scope.userForm = "Enter your email";
//
//        $scope.forgetPassword = function () {
//
//            var modalInstance = $modal.open({
//                templateUrl: 'modal-form.html',
//                controller: modalObject,
//
//                resolve: {
//
//                    userForm: function () {
//                        return $scope.userForm;
//                    }
//                }
//            });
//            var status = {};
//
//            modalInstance.result.then(function (userData) {
//
//
//                if ($scope.userForm === "Enter your email") {
//
//                    $http.post("/TAKEALOT/forgot", userData).then(function (response) {
//
//                        status = response.data.status;
//
//                        var customer = response.data.customer;
//                        sessionStorage.setItem("customer", JSON.stringify(customer));
//
//                        $scope.userForm = "Provide answer for your security question : " + customer.securityQuestuion + "?";
//
//                        if (status === "OK") {
//
//                            //pop up again for user to enter their answer
//                            $scope.input = "";
//                            $scope.forgetPassword();
//
//                        }
//                    });
//
//
//                } else {
//
//                    var customer = angular.fromJson(sessionStorage.getItem("customer"));
//
//                    var data = {
//
//                        answer: userData,
//                        email: customer.email
//                    };
//
//                    $http.post("/TAKEALOT/passAnswer", data).then(function (response) {
//
//                        status = response.data.status;
//                        alert(response.data.message);
//                        if (status === "OK") {
//                            //Reset pop up to the start
//                            sessionStorage.removeItem("customer");
//                            $scope.userForm = "Enter your email";
//                        } else {
//                            $scope.input = "";
//                            $scope.forgetPassword();
//                        }
//
//                    });
//                }
//            });
//        };
//    }]);
//
//var modalObject = function ($scope, $modalInstance, userForm) {
//
//    $scope.modalMessage = userForm;
//    $scope.submitForm = function (newData) {
//
//        $modalInstance.close(newData);
//    };
//
//    $scope.cancel = function () {
//        $modalInstance.dismiss('cancel');
//    };
//};
//

//------------------------------------------------------------------------------------------------------------------------------------------------
//                                                   App Services
//------------------------------------------------------------------------------------------------------------------------------------------------
TAKE_A_LOT_APP.factory("PostToServerService", ["$http", function ($http) {

        var serviceInstance = {};
        serviceInstance.sendToSever = function (data, reqUrl) {

            return $http.post(reqUrl, data);
        };
        return serviceInstance;
    }]);
TAKE_A_LOT_APP.factory("UserGetService", ["$http", function ($http) {

        var serviceInstance = {};
        serviceInstance.sendGetRequest = function (requestUrl) {

            return $http({
                url: requestUrl,
                method: "GET"

            });
        };
        return serviceInstance;
    }]);
TAKE_A_LOT_APP.factory("OrderPostService", ["$http", function ($http) {

        var serviceInstance = {};
        serviceInstance.completeOrder = function (productsData, requestUrl) {

            return $http.post(requestUrl, productsData);
        };
        return serviceInstance;
    }]);
TAKE_A_LOT_APP.factory("ProductGetService", ["$http", function ($http) {

        var serviceInstance = {};
        serviceInstance.getProductsFromServer = function (requestUrl) {

            return $http({
                url: requestUrl,
                method: "GET"

            });
        };
        return serviceInstance;
    }]);

TAKE_A_LOT_APP.directive('fileread', [function () {
        alert("UUUUUUUUUUUUUUUUU");
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element) {

                element.bind('change', function (changeEvent) {
                    var file = changeEvent.target.files[0];
                    alert(file);

                    //var file = new File(file);
                    var reader = new FileReader(file);


                    alert(reader.toString());

                    scope.fileread = changeEvent.target.value;
                });
            }
        };
    }]);

