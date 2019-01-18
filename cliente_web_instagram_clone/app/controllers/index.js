module.exports.index = function(application, req, res){
	res.render('index/padrao');
}


module.exports.autenticar = function(application, req, res){
    
    var dadosForm = req.body;

    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazia').notEmpty();

    var erros = req.validationErrors();
    console.log(dadosForm);
    if(erros){
        res.render('index', { validacao: erros });
        return;
    }

   
    var UsuariosDAO = new application.app.models.UsuariosDAO();

    UsuariosDAO.autenticar(dadosForm, req, res);


}