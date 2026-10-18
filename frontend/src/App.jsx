import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

async function addNote(e) {
  e.preventDefault();

  if (!title.trim()) {
    alert("Please enter a title");
    return;
  }

  const res = await fetch(`${API_URL}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) {
    alert("Could not add note");
    return;
  }

  const newNote = await res.json();
  setNotes([...notes, newNote]);
  setTitle("");
  setContent("");
}

  async function deleteNote(id) {
    await fetch(`${API_URL}/api/notes/${id}`, { method: "DELETE" });
    setNotes(notes.filter((n) => n.id !== id));
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>My Notes</h1>

      <form onSubmit={addNote}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button type="submit">Add note</button>
      </form>

      {notes.map((note) => (
        <div key={note.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;