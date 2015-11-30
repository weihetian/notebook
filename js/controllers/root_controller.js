(function(){
    var app= angular.module('notebook');
    app.controller('rootController', ['$scope', function ($scope) {
		
		
		$scope.notes;
		$scope.update_left = function(id,title,content){
		
			for(var i=0;i<$scope.notes.length;i++){
				if($scope.notes[i].id==id){
					$scope.notes[i].title=title;
					$scope.notes[i].content=content;
					$scope.$digest();
				}
			}
		}
		
		$scope.add_left = function(note){
			
			$scope.notes.unshift(note);
		$scope.$digest();
			// for(var i=0;i<$scope.notes.length;i++){
	// 			if($scope.notes[i].id==id){
	// 				$scope.notes[i].title=title;
	// 				$scope.notes[i].content=content;
	// 				$scope.$digest();
	// 			}
	// 		}
		}
		
		
		$scope.messages_list=[];
		
		var messageid=0;
		
		$scope.notification = function(message){
			
			$scope.messages_list.push({id:messageid,content:message});
			
			messageover(messageid);
			messageid++;
			$scope.$digest();
		}
		
		function messageover(id){
			setTimeout(function(){
				for(var i=0;i<$scope.messages_list.length;i++){
					if($scope.messages_list[i].id==id){
						
						$scope.messages_list.splice($.inArray($scope.messages_list[i], $scope.messages_list),1);
						$scope.$digest();
					}
				}
			 }, 2000);
		}
		
		$scope.alert = function(message){
			
		}
		
		$scope.delete_left = function(id){
		
			for(var i=0;i<$scope.notes.length;i++){
				if($scope.notes[i].id==id){
					
					$scope.notes.splice($.inArray($scope.notes[i], $scope.notes),1);
					$scope.$digest();
				}
			}
		}
		
	}
])
}())