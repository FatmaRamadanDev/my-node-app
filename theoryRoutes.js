
import express from "express";
import initDB from "../database/dbConnection/config.js";
const router = express.Router();
// نعمل الاتصال مرة واحدة
let db;
initDB().then((pool) => {
  db = pool;
});



// ✅ get all بتاع
router.get("/", async (req, res) => {
     if (!db) {
    return res.status(500).json({ message: "Database not ready" });
  }
  try {
    const [results] = await db.query("SELECT * FROM articles");

    const data = results.map(item => ({
      ...item,
      keyPoints: JSON.parse(item.keyPoints || "[]")
    }));

    res.json({ theory: data });

  } catch (err) {
    console.log(err); 
    res.status(500).json({ error: err.message });
  }
});
// ✅ GET ONE THEORY
router.get("/:id", async (req, res) => {
    if (!db) {
  return res.status(500).json({ message: "Database not ready" });
}
  try {
    const { id } = req.params;

    const [results] = await db.query(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const item = {
      ...results[0],
      keyPoints: JSON.parse(results[0].keyPoints || "[]")
    };

    res.json(item);

  } catch (err) {
    console.log(err); 
    res.status(500).json({ error: err.message });
  }
});


// ✅ CREATE NEW THEORY
router.post("/", async (req, res) => {
  if (!db) {
    return res.status(500).json({ message: "Database not ready" });
  }
  try {
    const {
      id,
      title,
      overview,
      content,
      realWorldExample,
      imageUrl,
      keyPoints,
      createdAt
    } = req.body;

           if (!id || !title) {
  return res.status(400).json({ message: "Missing required fields" });
}

    const query = `
      INSERT INTO articles 
      (id, title, overview, content, realWorldExample, imageUrl, keyPoints, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      id,
      title,
      overview,
      content,
      realWorldExample,
      imageUrl,
      JSON.stringify(keyPoints || []),
      createdAt
    ]);

    res.json({ message: "Article created successfully" });

  } catch (err) {
    console.log(err);
res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE THEORY
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      overview,
      content,
      realWorldExample,
      imageUrl,
      keyPoints,
      createdAt
    } = req.body;

    const query = `
      UPDATE articles 
      SET title=?, overview=?, content=?, realWorldExample=?, imageUrl=?, keyPoints=?, createdAt=?
      WHERE id=?
    `;

    const [result] = await db.query(query, [
      title,
      overview,
      content,
      realWorldExample,
      imageUrl,
      JSON.stringify(keyPoints || []),
      createdAt,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({ message: "Article updated successfully" });

  } catch (err) {
    console.log(err);
res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE THEORY
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM articles WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({ message: "Article deleted successfully" });

  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;