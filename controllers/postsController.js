const posts = require("../data/posts_data.js");

//index
function index(req, res) {
  const counter = posts.length;
  const output = {
    posts: posts,
    counter: counter,
  };
  res.json(output);
}

//show
function show(req, res) {
  const id = req.params.id;

  //id valido
  if (id && !isNaN(id)) {
    const targetedPost = posts.find((post) => post.id == id);
    //id non trovato
    if (!targetedPost) res.status(404).json({ error: "Id not found" });
    //id trovato
    else res.json(targetedPost);
  } //id non valido
  else {
    res.status(422).json({
      error: "Id not valid",
    });
  }
}

//store
function store(req, res) {
  res.send("Il tuo nuovo post è stato creato");
}

//update
function update(req, res) {
  const id = req.params.id;

  //id valido
  if (id && !isNaN(id)) {
    const targetedPost = posts.find((post) => post.id == id);
    //id non trovato
    if (!targetedPost) res.status(404).json({ error: "Id not found" });
    //id trovato
    else res.send("Il post " + req.params.id + " è stato aggiornato"); // non mi vanno i backtick
  } //id non valido
  else {
    res.status(422).json({
      error: "Id not valid",
    });
  }
}

//destroy
function destroy(req, res) {
  const id = req.params.id;
  //l'id è valido
  if (id && !isNaN(id)) {
    //cerco se l'id corrisponde a qualcosa
    const targetedPost = posts.find((post, index) => post.id == id);
    //id non presente nei dati
    if (!targetedPost) {
      res.status(404).json({
        error: "Id not found",
      });
      //id presente
    } else {
      //cerco l'indice del post da eliminare perchè non posso soltanto avendolo appoggiato ad una variabile
      let postIndex;
      posts.forEach((post, index) => {
        if (post.id == id) postIndex = index;
      });
      //elimino il post richiesto
      posts.splice(postIndex, 1);
      //comunico la lista di elementi presenti e che l'operazione è andata a buon fine
      console.log(posts);
      res.sendStatus(204);
    }
    //l'id non è valido
  } else {
    res.status(400).json({
      error: "Inserted content is not valid as an ID",
    });
  }
}

module.exports = { index, show, store, update, destroy };
