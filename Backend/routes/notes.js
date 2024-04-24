const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the notes: GET "/api/notes". No login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 2: Add notes: POST "/api/addnotes". No login required

router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
    body("tag").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //If there are errors return a bad request//

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json({ Sucess: "Notes saved", savedNote });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
//Route 3: Update an existing note using: PUT "/api/updatenote". No login required (put request is used to update)

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //Create new note object//

    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be updated and update it//

    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send("Not found");
    }
    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    notes = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 4: Delete an existing note using: DELETE "/api/deletenote". No login required (put request is used to update)

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  //Find the note to be deleted and delete it//
  try {
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send("Not found");
    }

    //Allow deletion only if the note belong to the user//
    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    notes = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted ", notes: notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
