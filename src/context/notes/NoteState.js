import React from "react";
import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const Host = "http://localhost:4000";
  const noteInitial = [];
  const [notes, setnotes] = useState(noteInitial);

  //To fetch all note
  const getNotes = async () => {
    //api call
    
    const response = await fetch(`${Host}/api/notes/fetchallnotes`, {
      
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('authtoken'),
      },
     
    });
    const json = await response.json();
    console.log(json);
    setnotes(json);
  };

  //To add note
  const addNote = async (title, description, tag) => {

    
    const response = await fetch(`${Host}/api/notes/addnotes`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('authtoken'),
      },
      
      body: JSON.stringify({title, description, tag }), // body data type must match "Content-Type" header
    });
    const note = await response.json();
    console.log("Adding a new note");
    setnotes([...notes,note.savedNote]);
  };
  //To delete note
  const deleteNote = async (id) => {
    ///api call to delete note///
    const response = await fetch(`${Host}/api/notes/deletenote/${id}`, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('authtoken'),
      },
      // body data type must match "Content-Type" header
    });
    const json = response.json();
    console.log(json);

    console.log("Deleting the note" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setnotes(newNotes);
  };

  //To edit note
  const editNote = async (id, title, description, tag) => {
    /////////Api call///////////
    const response = await fetch(`${Host}/api/notes/updatenote/${id}`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token":
        localStorage.getItem('authToken'),
      },

      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });
    console.log(response);
    const newNotes = JSON.parse(JSON.stringify(notes));
    
    //logic to edit in client//
    for (let index = 0; index < newNotes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    console.log(newNotes);
    setnotes(newNotes);
  };

  return (
    
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
