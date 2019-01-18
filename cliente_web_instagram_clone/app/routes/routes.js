module.exports = function(application){
	application.get('/', function(req, res){
		application.app.controllers.index.index(application, req, res);
	});

	application.get('/home', function(req, res){
		application.app.controllers.home.home(application, req, res);
	});
	application.get('/cadastro', function(req, res){
		application.app.controllers.cadastroController.cadastro(application,req,res);
	});

	application.post('/cadastrar', function(req, res){
		application.app.controllers.cadastroController.cadastrar(application,req,res);
	});

	application.post('/autenticar', function(req, res){
		application.app.controllers.index.autenticar(application,req,res);
		
	});
}