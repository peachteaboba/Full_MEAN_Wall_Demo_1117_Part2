/**
 * Created by andyf on 1/22/17.
 */

app.controller('loginController', function($scope, loginFactory, $location){
  $scope.test = "hello world";

  $scope.regUser = function(){
    console.log($scope.reg);
    $scope.error = "";
    $scope.user = {};

    if($scope.reg.password == $scope.reg.password_confirm && $scope.reg.name && $scope.reg.email && $scope.reg.password){
      // call factory method to register user
      loginFactory.register($scope.reg, function(output){
        console.log(output);
        console.log("back from the factory ----> finished");
        $scope.user = output.data;

        if(output.data.error){
          $scope.error = output.data.error;
        } else {
          loginFactory.setUser(output.data, function(){
            $location.url('/wall');
          });
        }

      });
    } else {
      $scope.error = "passwords do no match!";
    }


    // clear input
    $scope.reg = {};
  }

  $scope.loginUser = function(){
    console.log($scope.login);

    // call factory method to log in user
    loginFactory.login($scope.login, function(output){
      console.log(output);
      console.log("back from the factory ----> finished login");

      if(output.data.error){
        $scope.error = output.data.error;
      } else {
        loginFactory.setUser(output.data, function(){
          $location.url('/wall');
        });
      }


    });

    // clear input
    $scope.login = {};
  }


});


app.controller('wallController', function($scope, loginFactory, wallFactory, $location){
  console.log("in the wall controller");

  $scope.user = {};
  $scope.messages = [];

  loginFactory.getUser(function(data){
    $scope.user = data;
    console.log(data);
    if(!data._id){
      // kick the user back to the login page
      $location.url('/');
    }


  });

  wallFactory.getAllMessages(function(output){
    $scope.messages = output;
    console.log(output);
  })



  $scope.submitNewMessage = function(){
    $scope.newMessage._user = $scope.user._id;
    console.log($scope.newMessage);


    // run the factory method to save the new message
    wallFactory.submitNewMessage($scope.newMessage, function(output){
      console.log(output);
      $scope.messages = output;
    })

    $scope.newMessage = {};
  }


  $scope.submitNewComment = function(id, content){

    var newComment = {};
    newComment._user = $scope.user._id;
    newComment.content = content;
    newComment._message = id;

    console.log(newComment);

    // run the factory method to save the new comment
    wallFactory.submitNewComment(newComment, function(output){
      console.log(output);
      $scope.messages = output;
    })




  }






});
