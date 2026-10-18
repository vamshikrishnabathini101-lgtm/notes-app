const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

// Open (or create) the database file
const db = new Database(path.join(__dirname, "notes.db"));

// Create the notes table if it doesn't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT DEFAULT ''
  )
`);

const app = express();
app.use(cors());
app.use(express.json());

// READ all notes
app.get("/api/notes", (req, res) => {
  const notes = db.prepare("SELECT * FROM notes").all();
  res.json(notes);
});

// CREATE a note
app.post("/api/notes", (req, res) => {
  const { title, content } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const result = db
    .prepare("INSERT INTO notes (title, content) VALUES (?, ?)")
    .run(title, content || "");
  const note = { id: result.lastInsertRowid, title, content: content || "" };
  res.status(201).json(note);
});

// DELETE a note
app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  db.prepare("DELETE FROM notes WHERE id = ?").run(id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));