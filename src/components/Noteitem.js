import React from "react";
import noteContext from "../context/notes/noteContext";
import { useContext } from "react";

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { note, updateNote } = props;
  const { deleteNote } = context;
  return (
    <div className="col-md-4 my-3">
      {/* {note.title}
      {note.description} */}
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title mx-3">{note.title}</h5>
            <i
              className="fa-solid fa-trash mx-2"
              onClick={() => {
                deleteNote(note._id);
                props.showAlert("Deleted successfully", "success");
              }}
            ></i>
            <i
              className="fa-solid fa-pen-to-square mx-2"
              onClick={() => {
                updateNote(note);
                
              }}
            ></i>
          </div>
          <p className="card-text mx-3">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
