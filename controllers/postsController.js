const connection = require("../data/db_connection.js");

//index

function index(req, res) {
  const sql = "SELECT * FROM posts";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
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
function store(req, res) {
  console.log(req.body);
  //prendo i dati dal body inviato nella request
  const { id, title, content, image, category, published } = req.body;

  let lastId; //cerco l'id più grande e assegno l'id subito dopo
  effectivePosts.forEach((post) => {
    if (!lastId || lastId <= post.id) lastId = post.id + 1;
  });

  //controllo i parametri
  if (!title || !content || !category) {
    //non controllo che tags sia un array perchè il post potrebbe anche averne solo 1
    const err = new Error("Inserted parameters are invalid ");
    err.code = 400;
    throw err;
  }

  //creo il post
  const newPost = { id, title, content, image, category, published };
  newPost.id = lastId;

  //pusho il post dentro l'array dei post e lo mando all'utente
  effectivePosts.push(newPost);
  res.status(200).json(newPost);
}

//update
function update(req, res) {
  const id = req.params.id;
  console.log(req.body);

  //id valido
  if (id && !isNaN(id)) {
    const targetedPost = effectivePosts.find((post) => post.id == id);
    //id non trovato
    if (!targetedPost) {
      const err = new Error("ID hasnt been found");
      err.code = 404;
      throw err;
    }
    //id trovato
    else {
      //prendo i dati dal body
      const { title, content, image, category, published } = req.body;
      //controllo i parametri siano validi
      if (!title || !content) {
        const err = new Error("Inserted parameters are invalid ");
        err.code = 400;
        throw err;
      }

      //sostituisco ai dati del post nell'id quelli inseriti dall'utente

      res.status(200).json(targetedPost);
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
      res.json(`Il post di ID ${id}  stato eliminato`);
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
