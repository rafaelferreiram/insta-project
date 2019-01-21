var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    objectId = require('mongodb').ObjectID,
    multiparty = require('connect-multiparty')
    fs = require('fs'),
    crypto = require('crypto'),
    expressSession = require('express-session');

var app = express();

// body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(multiparty());
app.use(function(req,res,next){
    
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers","content-type");
    res.setHeader("Access-Control-Allow-Credentials",true);

    next();
});
app.use(expressSession({
	secret:'lkasdhkl',
	resave: false,
	saveUninitialized: false
}));

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost',27017,{}),
    {}
);

console.log('Servidor HTTP esta escutando na porta ' + port);

app.get('/', function(req, res){
    res.send({msg:'Olá'});
});

// POST(create)
app.post('/api', function(req, res){
    
    var date = new Date();
    var timestamp = date.getMilliseconds();
    var image_name = timestamp+'_'+req.files.arquivo.originalFilename;
    var path_origin = req.files.arquivo.path;
    var path_destiny = './uploads/'+image_name;
    var dados = {
        url_imagem : image_name,
        titulo: req.body.titulo 
    };
    fs.rename(path_origin,path_destiny,function(err){
        if(err){
            res.status(500).json({error:err});
            return;
        }

    });  
    db.open(function(err, mongoclient){
            mongoclient.collection('postagens', function(err, collection){
                collection.insert(dados, function(err, records){
                    if(err){
                        console.log('status erro');
                    }else{
                       console.log('status inclusao realizada com sucesso');
                       
                    }
                    mongoclient.close();
                });
            });
        });
    });

//POST User
app.post('/api/cad', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('usuarios', function(err, collection){
            var dados = req.body;
            var senhaCrypto = crypto.createHash("md5").update(dados.senha).digest("hex");
            dados.senha = senhaCrypto;
            collection.insert(dados, function(err, records){
                if(err){
                    console.log('status erro');
                }else{
                   console.log('status inclusao realizada com sucesso');
                   
                }
                mongoclient.close();
            });
        });
    });  
});

//GET User
app.get('/api/get/:usuario',function(req,res){
    db.open(function(err,mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            var usuario = req.params.usuario;
            var obj = JSON.parse(usuario);
            var senhaCrypto = crypto.createHash("md5").update(obj.senha).digest("hex");
            obj.senha = senhaCrypto;
            
            console.log(obj);

            collection.find(obj).toArray(function(err, result){
                
                if(result[0] != undefined){

                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                    console.log('autorizado');
                    
                }
                else{
                    req.session.autorizado = false;
                }
                return req.session.autorizado;

            });
            mongoclient.close();
        });
    });
});

// GET(ready)
app.get('/api', function(req, res){
   
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function(err, collection){
            collection.find().toArray(function(err, results){
                if(err){
                    res.json(err);
                }else{
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });
});

app.get('/imagens/:imagem', function(req,res){
    var img = req.params.imagem;
    console.log(img);
    fs.readFile('./uploads/'+img,function(err,result){
        if(err){
            res.status(400).json(err);
            return; 
        }
        res.writeHead(200,{'content-type':'image/jpg'}); //dessa forma o navegador reconhece que o conteudo é uma imagem
        res.end(result); 
        //end() é uma funcao que pega a info e escreve dentro do response
    })
});

// GET by ID(ready)
app.get('/api/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function(err, collection){
            collection.find(objectId(req.params.id)).toArray(function(err, results){
                if(err){
                    res.json(err);
                }else{
                    res.status(200).json(results);
                }
                mongoclient.close();
            });
        });
    });
});

// PUT by ID(update)
app.put('/api/:id', function(req, res){
   
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function(err, collection){
            collection.update(
                { _id : objectId(req.params.id) },
                { $push : {comentarios : {
                                        id_comentario : new objectId(),
                                        comentario :  req.body.comentario
                                         } 
                          }
                },
                {},
                function(err, records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                    mongoclient.close();
                }
            );
        });
    });
});

// DELETE by ID(delete)
app.delete('/api/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function(err, collection){
            collection.update(
                {},
                { $pull : {
                            comentarios: {id_comentario : objectId(req.params.id)}
                          }
                },
                {multi: true},
                function(err, records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                    mongoclient.close();
                }  
            );
        });
    });
});

//DELETE img
app.delete('/api/foto/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('postagens', function(err, collection){
            collection.remove(
                { _id : objectId(req.params.id) },
                function(err, records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                    mongoclient.close();
                }  
            );
        });
    });
});