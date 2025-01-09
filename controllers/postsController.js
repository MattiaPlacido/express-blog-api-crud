const connection = require("../data/db_connection.js");

//index

function index(req, res) {
  //query
  const sql = "SELECT * FROM posts";
  //invio della query
  connection.query(sql, (err, results) => {ù
    //gestione errore query
    if (err) return res.status(500).json({ error: "Database query failed" });
    //invio risultati
    res.json(results);
    console.log("Index eseguito con successo!");
  });
}

//show
function show(req, res) {
  const id = req.params.id;
  const sql = "SELECT * FROM posts WHERE id = ?";

  //id valido
  if (id && !isNaN(id)) {
    connection.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: "Database query failed" });

      if (results.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      //salvo i dati del post
      const post = results[0];

      const tagsQuerySql =
        "SELECT tags.label FROM posts JOIN post_tag ON posts.id = post_tag.post_id JOIN tags ON post_tag.tag_id = tags.id WHERE posts.id = ?";

      connection.query(tagsQuerySql, [id], (err, tagsResults) => {
        //aggiungo le tags corrispondenti al post
        post.tags = tagsResults.map((tag) => tag.label);

        //restituisco il post sia come risposta che come console log per assicurarmi
        res.json(post);
        console.log("Show eseguito con successo: ", post);
      });
    });
  } //id non valido
  else {
    const err = new Error("Inserted ID is not valid ");
    err.code = 400;
    throw err;
  }
}

//store
//BONUS : senza tags
//json di esempio :
// {
//       "image": "prova.jpg",
//       "title":  "Titolo prova",
//       "content": "Contenuto prova"
// }

function store(req, res) {
  //prendo i dati dal body
  const { image, content, title } = req.body;

  //controllo i dati del body
  if (!title || !content || !image) {
    const err = new Error("Inserted parameters are invalid ");
    err.code = 400;
    throw err;
  } else {
    //parametri validi
    const sql = "INSERT INTO posts (title,content,image) VALUES (?,?,?)";
    connection.query(sql, [title, content, image], (err, results) => {
      if (err) return res.status(500).json({ error: "Database query failed" });
      res.status(204);
      console.log("Store eseguito con successo");
    });
  }
}

//update
//BONUS : senza cambio di tags
// l'id è un parametro i dati sono nel body
//json di esempio :
// {
//       "image": "prova.jpg",
//       "title":  "Titolo prova",
//       "content": "Contenuto prova"
// }
function update(req, res) {
  const id = req.params.id;

  //id valido
  if (id && !isNaN(id)) {
    const { title, content, image } = req.body;

    //controllo i dati del body
    if (!title || !content || !image) {
      const err = new Error("Inserted parameters are invalid ");
      err.code = 400;
      throw err;
    } else {
      const sql =
        "UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?";
      connection.query(sql, [title, content, image, id], (err, results) => {
        if (err)
          return res.status(500).json({ error: "Database query failed" });
        res.status(204);
        console.log("Update eseguito con successo");
      });
    }
  } //id non valido
  else {
    const err = new Error("Inserted id is invalid ");
    err.code = 400;
    throw err;
  }
}

//destroy
function destroy(req, res) {
  const id = req.params.id;

  const sql = "DELETE FROM posts WHERE id = ?";

  //l'id è valido
  if (id && !isNaN(id)) {
    connection.query(sql, [id], (err, results) => {
      //Query fallita
      if (err) return res.status(500).json({ error: "Database query failed" });
      //post non esistente
      if (results.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.status(204).json(`Il post di ID ${id}  stato eliminato`);
      console.log("Destroy eseguito con successo!");
    });
    //l'id non è valido
  } else {
    const err = new Error("Inserted ID is invalid ");
    err.code = 400;
    throw err;
  }
}

module.exports = { index, show, store, update, destroy };
