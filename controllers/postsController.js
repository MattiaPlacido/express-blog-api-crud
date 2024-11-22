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
    if (!targetedPost) return res.status(404).json({ error: "Id not found" });
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
  console.log(req.body);
  //prendo i dati dal body inviato nella request
  const { titolo, contenuto, immagine, tags } = req.body;

  let lastId; //cerco l'id più grande e assegno l'id subito dopo
  posts.forEach((post) => {
    if (!lastId || lastId <= post.id) lastId = post.id + 1;
  });

  //controllo i parametri
  if (!titolo || !contenuto || !immagine || !tags) {
    //non controllo che tags sia un array perchè il post potrebbe anche averne solo 1
    return res.status(400).json("invalid parameters");
  }

  //creo il post
  const newPost = { id: lastId, titolo, contenuto, immagine, tags };

  //pusho il post dentro l'array dei post e lo mando all'utente
  posts.push(newPost);
  res.status(200).json(newPost);
}

//update
function update(req, res) {
  const id = req.params.id;
  console.log(req.body);

  //id valido
  if (id && !isNaN(id)) {
    const targetedPost = posts.find((post) => post.id == id);
    //id non trovato
    if (!targetedPost) return res.status(404).json({ error: "Id not found" });
    //id trovato
    else {
      //prendo i dati dal body
      const { titolo, contenuto, immagine, tags } = req.body;
      //controllo i parametri siano validi
      if (!titolo || !contenuto || !immagine || !tags)
        return res.status(400).json("invalid parameters");

      //sostituisco ai dati del post nell'id quelli inseriti dall'utente
      targetedPost.titolo = titolo;
      targetedPost.contenuto = contenuto;
      targetedPost.immagine = immagine;
      targetedPost.tags = tags;
      res.status(200).json(targetedPost);
    }
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
