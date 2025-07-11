import React, { useState, useEffect } from "react";

/**
 * Editor panel for creating or editing a note.
 * @param {object|null} note Note object to edit, or null for creating new
 * @param {function} onSave Called with (note: {title, content})
 * @param {function} onDelete Called for delete (only if editing)
 * @param {function} onCancel Called on cancel/close
 * @param {boolean} loading If true, show a loading indicator
 */
 // PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onDelete, onCancel, loading }) {
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [err, setErr] = useState("");

  // Reset if note changes
  useEffect(() => {
    setTitle(note ? note.title : "");
    setContent(note ? note.content : "");
    setErr("");
  }, [note]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setErr("Please provide at least a title or some content.");
      return;
    }
    onSave({ title: title.trim(), content: content.trim() });
  };

  return (
    <section className="note-editor-panel" aria-label={note ? "Edit note" : "Add note"}>
      <form onSubmit={handleSave} autoComplete="off">
        <input
          className="text-input"
          type="text"
          maxLength={75}
          placeholder="Note Title (required)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
          aria-label="Note Title"
        />
        <textarea
          className="textarea-input"
          maxLength={2048}
          placeholder="Details (type your note here...)"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
          aria-label="Note Content"
        />
        {err && (
          <div style={{ color: "#ff6f00", marginBottom: "0.7em" }}>{err}</div>
        )}
        <div style={{ textAlign: "right" }}>
          {onDelete &&
            <button type="button" className="button delete" onClick={onDelete} disabled={loading} style={{float:"left"}}>Delete</button>
          }
          <button type="button" className="button" onClick={onCancel} disabled={loading}>Cancel</button>
          <button type="submit" className="button" style={{marginLeft: "0.8em"}} disabled={loading}>
            {note ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </section>
  );
}
