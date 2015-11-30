(function(){
    var app= angular.module('notebook');
    app.controller('navController', ['$scope','Current', function ($scope,Current) {
		
		
		
	
		
		
	function load(){
			
			var dataString = '';
			$.ajax({
				type: "POST",
				url: "data_access/pull_allnotes.php",
				datatype: "html",
				data: dataString,
				success: function(data) {
					$scope.$parent.notes=$.parseJSON(data);
					$scope.$digest();
				}
			})
		}
		
		load();
		
		$scope.select_note = function(id){
			Current.setId(id);
			
		}
	
	}
])
}())