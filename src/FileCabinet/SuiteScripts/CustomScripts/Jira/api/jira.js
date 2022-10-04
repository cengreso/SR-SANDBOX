define(['./lib/project'],

function(project) {
   
	createProject = function (option){
		
		return project.create(option);
	};
	
	updateProject = function (option){
		
		return project.update(option);
	};
	
    return {
    	createProject: createProject,
    	updateProject: updateProject
    };
    
});
