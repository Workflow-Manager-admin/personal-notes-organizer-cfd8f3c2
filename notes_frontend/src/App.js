import React, { useState, useEffect } from "react";
import "./App.css";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import {
  fetchNotes,
  addNote,
  updateNote,
  deleteNote,
} from "./api/notes";

// PUBLIC_INTERFACE
function App() {
  // Theme
  const [theme, setTheme] = useState("light");

  // Notes state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editorMode, setEditorMode] = useState(null); // "add" | "edit" | null
  const [fetchErr, setFetchErr] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch notes on mount
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setFetchErr("");
    fetchNotes()
      .then((data) => {
        if (!ignore) setNotes(data || []);
      })
      .catch((e) => {
        setFetchErr("Failed to load notes. Please try again.");
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  // Toggle theme method
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Select note from list
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setEditorMode("edit");
  };

  // "Add" fab handler
  const handleAddClick = () => {
    setSelectedNote(null);
    setEditorMode("add");
  };

  // Add new note
  const handleAddNote = async (formVal) => {
    setLoading(true);
    try {
      const newNote = await addNote(formVal.title, formVal.content);
      setNotes((prev) => [newNote, ...prev]);
      setEditorMode(null);
      setSelectedNote(newNote);
    } catch (err) {
      alert("Add failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update existing note
  const handleUpdateNote = async (formVal) => {
    if (!selectedNote) return;
    setLoading(true);
    try {
      const updNote = await updateNote(selectedNote.id, formVal);
      setNotes((prev) =>
        prev.map((n) => (n.id === updNote.id ? updNote : n))
      );
      setEditorMode(null);
      setSelectedNote(updNote);
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete note
  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    if (!window.confirm("Delete this note?")) return;
    setLoading(true);
    try {
      await deleteNote(selectedNote.id);
      setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id));
      setEditorMode(null);
      setSelectedNote(null);
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit/add
  const handleCancelEditor = () => {
    setEditorMode(null);
    // Focus last selected note in list if present
  };

  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <header className="header">
        <span role="img" aria-label="notes" style={{ marginRight: "0.72em", fontSize: "1.1em" }}>🗒️</span>
        Personal Notes Organizer
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{
            position: "absolute",
            right: 24,
            top: 18,
            fontSize: "14px"
          }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <main className="main-content">
        <NotesList
          notes={notes}
          selectedId={selectedNote ? selectedNote.id : ""}
          onSelect={handleSelectNote}
        />
        {(editorMode === "edit" || editorMode === "add") ? (
          <NoteEditor
            note={editorMode === "edit" ? selectedNote : null}
            onSave={editorMode === "edit" ? handleUpdateNote : handleAddNote}
            loading={loading}
            onDelete={editorMode === "edit" ? handleDeleteNote : undefined}
            onCancel={handleCancelEditor}
          />
        ) : (
          <section className="note-editor-panel" style={{ opacity: 0.84, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#bdbdbd" }}>
            <span style={{ fontSize: "2.5em", marginBottom: 16 }}>📝</span>
            <div style={{ fontSize: "1.1em", marginBottom: 8 }}>
              {notes.length === 0 ? "No notes yet! Click ➕ to add." : "Select a note or add a new one."}
            </div>
            {fetchErr && (
              <div style={{ color: "#c00", marginTop: 8, fontSize: "0.97em", maxWidth: 280 }}>{fetchErr}</div>
            )}
          </section>
        )}
      </main>

      {/* Floating Add Button */}
      {editorMode ? null : (
        <button
          title="Add note"
          className="fab"
          aria-label="Add note"
          onClick={handleAddClick}
          style={{
            background: "var(--fab-bg)",
            color: "var(--fab-text)"
          }}
        >＋</button>
      )}
    </div>
  );
}

export default App;
