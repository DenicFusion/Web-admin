const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 10000;
const DB_FILE = path.join(__dirname, "db.json");
const ADMIN_PASSWORD = "Denic123*";

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/group", (req, res) => {
  fs.readFile(DB_FILE, "utf8", (err, data) => {
    if (err || !data) {
      return res.json({
        groupName: "Default Group",
        groupLink: "#",
        status: "closed",
        membersCount: 0,
        maxMembers: 0
      });
    }
    try {
      const db = JSON.parse(data);
      res.json(db);
    } catch (e) {
      res.status(500).json({ error: "DB corrupted" });
    }
  });
});

app.post("/update-link", (req, res) => {
  const { password, groupLink, groupName, status, membersCount, maxMembers } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Invalid password" });
  }
  const db = { groupName, groupLink, status, membersCount, maxMembers };
  fs.writeFile(DB_FILE, JSON.stringify(db), (err) => {
    if (err) return res.status(500).json({ error: "Failed to save link" });
    res.json({ success: true, db });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));