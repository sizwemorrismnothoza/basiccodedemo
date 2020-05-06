var TakealotWebApp = angular.module("TakealotWebApp", ["TakealotWebApp.controllers","ngRoute","ui.bootstrap"]);
   
            TakealotWebApp.config(['$routeProvider', function ($routeProvider){
                    $routeProvider.when("/",{
                        templateUrl: "index.html",
                        controller :"TakealotWebAppCtrl"
                    }).when("/login",{
                        templateUrl: "login.html",
                        controller :"TakealotWebAppCtrl"
                        
                    }).when("/register",{
                        templateUrl: "register.html",
                        controller :"TakealotWebAppCtrl"
                        
                    }).when("/category",{
                        templateUrl: "category.html",
                        controller :"TakealotWebAppCtrl"
                        
                    }).when("/cart",{
                        templateUrl: "cart.html",
                        controller :"TakealotWebAppCtrl"
                        
                    }).when("/myAccount",{
                        templateUrl: "myAccount.html",
                        controller :"TakealotWebAppCtrl"
                        
                    }).when("/admin",{
                        templateUrl: "AdminPage.html",
                        controller :"AdminCtrl"
                        
                    }).when("/forgotPasswordPage",{
                        templateUrl: "forgotPasswordPage.html",
                        controller :"TakealotWebAppCtrl"
                        
                    }).otherwise({
                        redirectTo:"/"
                    });
                    
}]);

