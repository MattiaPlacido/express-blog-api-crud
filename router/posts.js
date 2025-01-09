//impostazione router
const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());
//importo il controller
const postsController = require("../controllers/postsController.js");

//ROTTE CRUD

//gestisco la route "/bacheca"
//da sistemare come bonus per il filtraggio dell'index, in maniera tale che anzichè filtrare per il titolo filtri per i tag
router.get("/bacheca", (request, response) => {
  //salvo la richiesta in una variabile
  const nameFilter = request.query.term;
  let counter;

  //se è presente la richiesta
  if (nameFilter) {
    //creo un array con solo gli elementi filtrati
    const filteredPosts = posts.filter((post) => {
      return post.titolo.toLowerCase().includes(nameFilter.toLowerCase());
    });

    //rispondo con il json contenente i post
    counter = filteredPosts.length;
    const output = {
      posts: filteredPosts,
      counter: counter,
    };
    response.json(output);
  } else {
    counter = posts.length; //avrei sicuramente potuto scrivere meglio per risparmiare righe e non dichiarare output in entrambe le condizioni sono sinceramente fuso
    const output = {
      posts: posts,
      counter: counter,
    };
    response.json(output);
  }
});

//index
router.get("/", postsController.index);
router.get("/posts-id", postsController.idIndex);

//show
router.get("/:id", postsController.show);

//store
router.post("/", postsController.store);

//update
router.put("/:id", postsController.update);

//destroy
router.delete("/:id", postsController.destroy);

//esporto il modulo
module.exports = router;
