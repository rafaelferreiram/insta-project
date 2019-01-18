module.exports.cadastro = function(application, req, res){
    res.render('cadastro/padrao');
}

module.exports.cadastrar = function(application, req, res){
    
    var dadosForm = req.body;

    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazia').notEmpty();
    req.assert('senhaConfirm', 'Senha não pode ser vazia').notEmpty();
    
    if(dadosForm.senha != dadosForm.senhaConfirm){
        res.send('senhas devem ser iguais');
    }

    var erros = req.validationErrors();

    if(erros){
        res.render('cadastro', { validacao: erros, dadosForm: dadosForm });
        return;
    }

    var connection = application.config.dbConnection;
    var UsuariosDAO = new application.app.models.UsuariosDAO(connection);

    UsuariosDAO.inserirUsuario(dadosForm);

    res.send('podemos cadastrar');

}