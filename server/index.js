
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const parts = file.originalname.split(".");
        const extension = parts.pop();
        const filename = parts.join(".");
        const id = Date.now();
        
        const newFilename = `${filename}-${id}.${extension}`;
        cb(null, newFilename);
    }
  })
  
const upload = multer({ storage: storage })



app.use(cors());
app.use(express.json());

app.post("/upload", upload.single("file"),  async (req, res) => {
    res.json(req.file)
});


app.post("/sign-up", async(req, res) => {
    try {
        const {email, username, password} = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: "Please provide email, username, and password"})
        }

        const newUser = await pool.query("INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *", 
        [email, username, password]);
        

        res.json(newUser.rows[0]);
       
    }
    catch (error) {

    }
});

app.post("/sign-in", async (req, res) => {
    try {
    const { email, password } = req.body;

    
    const user = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
    
    if (user.rows.length === 1) {
        const username = user.rows[0].username;
       
        res.json({ username });
        
    } else {
       
        res.status(401).json({ error: "Invalid username or password" });
    }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});



app.listen(8000, () => {
    console.log("Server has started on port 8000");
});
