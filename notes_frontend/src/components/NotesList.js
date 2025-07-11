import React from "react";

/**
 * Shows a scrollable list of notes
 * @param {object[]} notes Array of notes
 * @param {string} selectedId ID of the currently selected note
 * @param {function} onSelect Callback when a note is selected
 */
 // PUBLIC_INTERFACE
export default function NotesList({ notes, selectedId, onSelect }) {
  return (
    <aside className="notes-list-panel" aria-label="Notes list">
      <div className="notes-list-title">Notes</div>
      <ul className="notes-list">
        {notes && notes.length === 0 && (
          <li style={{
            padding: "1.4rem",
            color: "#bdbdbd",
            textAlign: "center",
            fontSize: "1.05em"
          }}>
            <span>No notes yet. Add one <span aria-label="plus" role="img">➕</span></span>
          </li>
        )}
        {notes && notes.map(note => (
          <li
            key={note.id}
            className={`note-list-item${note.id === selectedId ? " selected" : ""}`}
            tabIndex={0}
            aria-selected={note.id === selectedId}
            onClick={() => onSelect(note)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect(note);
            }}
          >
            <div>
              <div className="note-title">{note.title || "Untitled"}</div>
              <div className="note-date" style={{ fontSize: "0.82em" }}>
                {note.created_at ? (new Date(note.created_at)).toLocaleString() : ""}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
