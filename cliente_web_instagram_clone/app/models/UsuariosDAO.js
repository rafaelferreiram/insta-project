const crypt = require('crypto');

function UsuariosDAO(){
   
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
                
               // if(usuario.usuario =='admin' && usuario.senha =='admin'){

                    req.session.autorizado = true;
                    console.log(req.session.autorizado);
               // }

                if(req.session.autorizado){
                    res.redirect("home");
                }else{
                    res.render("index", { validacao: {} });
                }


}

module.exports = function(){
    return UsuariosDAO;
}