module.exports.cadastro = function(application, req, res){
    res.render('cadastro/padrao');
}

module.exports.cadastrar = function(application, req, res){
    
    var dadosForm = req.body;

    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazia').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('cadastro', { validacao: erros, dadosForm: dadosForm });
        return;
    }
    res.render('home/padrao');
}