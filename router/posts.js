//impostazione router
const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());
//importo il controller
const postsController = require("../controllers/postsController.js");

//ROTTE CRUD

//index
router.get("/", postsController.index);

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
