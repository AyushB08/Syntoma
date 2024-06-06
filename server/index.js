const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

app.post("/sign-up", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: "Please provide email, username, and password" });
        }

        const newUser = await pool.query(
            "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *", 
            [email, username, password]
        );

        res.json(newUser.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

app.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND password = $2", 
            [email, password]
        );

        if (user.rows.length === 1) {
            const username = user.rows[0].username;
            res.json({ username });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

app.post("/save-image", async (req, res) => {
    try {
        const { username, fileurl } = req.body;

        if (!username || !fileurl) {
            return res.status(400).json({ error: "Please provide username and file URL" });
        }

        const newImage = await pool.query(
            "INSERT INTO images (username, fileurl) VALUES ($1, $2) RETURNING *",
            [username, fileurl]
        );

        res.json(newImage.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(8000, () => {
    console.log("Server has started on port 8000");
});
