const bins = [
  {
    "id": "angular1",
    "author": "admin",
    "tests": [{
      "name": "spec.js",
      "content": "describe('mainCtrl', function(){ var $rootScope, $scope, $controller, mainCtrl; beforeEach(module('myApp')); beforeEach(inject(function(_$rootScope_, _$controller_){ $rootScope = _$rootScope_; $scope = $rootScope.$new(); $controller = _$controller_; mainCtrl= $controller('mainCtrl', {'$rootScope' : $rootScope, '$scope': $scope}); })); it('should exist', function() { expect(mainCtrl).toBeDefined(); }); it('should say \'Hello World\'', function() { var $scope = {}; // $controller takes an object containing a reference to the $scope var controller = $controller('mainCtrl', { $scope: $scope }); // the assertion checks the expected result expect($scope.message).toEqual('Hello World'); }); })"
    }],
    "packages" : {
      "angular" : "1.5.0",
    },
    "loaders": {
      "babel": {
        "stage0" : true,
        "es2015" : true
      }
    },
    "isBoilerplate": true,
    "files" : [
      {
        "name": "index.html",
        "content": "<!DOCTYPEhtml>\n<html>\n<head>\n<title>HelloWorld</title>\n</head>\n<body>\n<div></div>\n</body>\n</html>"
      },
      {
        "name": "app.js",
        "content": "",
        "isEntry": true
      },
      {
        "name": "mainCtrl.js",
        "content": ""
      }
    ],
    "isLive": null,
    "readme": "## Angular Friends\r\n\r\n### Introduction\r\n\r\nWelcome to Day 1 of AngularJS. Angular is a powerful JavaScript framework created by Google, designed to optimize front-end web development.\r\n\r\n##### Objective\r\n\r\nStudents will learn and utilize Angular directives to create a simple SPA application. They will create an angular module, create a controller, and grab data from said controller to put on the view.\r\n\r\n#####(As a bonus, students can create and use a Service to pull in data from http://jsonplaceholder.typicode.com/)#####\r\n\r\n### !!!!!!!!!!Install Angular!!!!!!!!\r\nWithout an AngularJS script, you will not be able to access any of Angular's capabilities.\r\n\r\n<script src=\"https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js\"></script>\r\n####\r\n\r\n\r\n####\r\n\r\n* Declare your Angular app. Name it \"myApp\".\r\n\r\n* Create a controller for your app in a separate file. Make sure that the app and the controller are both attached. Name the controller \"mainCtrl\"\r\n\r\nInject $scope into \"mainCtrl\".\r\n\r\n* Add the necessary ng-directives to the index.html file to include your Angular files in the view.\r\n\r\n* Test your controller by adding a scope variable called 'message' with the value 'Hello World' as a string.\r\n\r\n* Bind the $scope variable you just created to the view (index.html) using double curly brackets around the variable name, {{message}}, to see if your controller is working.\r\n\r\n(Hint: Binding the $scope variable to the view will only work if the correct Angular directive put the controller on the view.)\r\n'",
    "subject": "Angular",
    "name": "Angular Friends"
  }
];

module.exports = bins;
