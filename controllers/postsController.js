const posts = require("../data/posts_data.js");

const effectivePosts = posts.posts;

//index
function index(req, res) {
  // const counter = posts.length;
  // const output = {
  //   posts: posts,
  //   counter: counter,
  // };
  res.json(posts);
}

//show
function show(req, res) {
  const id = req.params.id;

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
    else res.json(targetedPost);
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
  const { titolo, contenuto, immagine, tags } = req.body;

  let lastId; //cerco l'id più grande e assegno l'id subito dopo
  effectivePosts.forEach((post) => {
    if (!lastId || lastId <= post.id) lastId = post.id + 1;
  });

  //controllo i parametri
  if (!titolo || !contenuto || !immagine || !tags) {
    //non controllo che tags sia un array perchè il post potrebbe anche averne solo 1
    const err = new Error("Inserted parameters are invalid ");
    err.code = 400;
    throw err;
  }

  //creo il post
  const newPost = { id: lastId, titolo, contenuto, immagine, tags };

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
      const { titolo, contenuto, immagine, tags } = req.body;
      //controllo i parametri siano validi
      if (!titolo || !contenuto || !immagine || !tags) {
        const err = new Error("Inserted parameters are invalid ");
        err.code = 400;
        throw err;
      }

      //sostituisco ai dati del post nell'id quelli inseriti dall'utente
      targetedPost.titolo = titolo;
      targetedPost.contenuto = contenuto;
      targetedPost.immagine = immagine;
      targetedPost.tags = tags;
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
  //l'id è valido
  if (id && !isNaN(id)) {
    //cerco se l'id corrisponde a qualcosa
    const targetedPost = effectivePosts.find((post, index) => post.id == id);
    //id non presente nei dati
    if (!targetedPost) {
      const err = new Error("ID hasnt been found");
      err.code = 404;
      throw err;
    }

    //id presente
    else {
      //cerco l'indice del post da eliminare perchè non posso soltanto avendolo appoggiato ad una variabile
      let postIndex;
      effectivePosts.forEach((post, index) => {
        if (post.id == id) postIndex = index;
      });
      //elimino il post richiesto
      effectivePosts.splice(postIndex, 1);
      //comunico la lista di elementi presenti e che l'operazione è andata a buon fine
      console.log(posts);
      res.json("Il post è stato eliminato");
    }
    //l'id non è valido
  } else {
    const err = new Error("Inserted ID is invalid ");
    err.code = 400;
    throw err;
  }
}

module.exports = { index, show, store, update, destroy };
