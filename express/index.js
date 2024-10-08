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

        // Check if email already exists
        const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Check if username already exists
        const usernameCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (usernameCheck.rows.length > 0) {
            return res.status(400).json({ error: "Username already in use" });
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

app.get("/get-images", async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: "Please provide a username" });
        }

        const images = await pool.query(
            "SELECT * FROM images WHERE username = $1",
            [username]
        );

        if (images.rows.length > 0) {
            res.json(images.rows);
        } else {
            res.status(404).json({ error: "No images found for this user" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

app.delete("/delete-image", async (req, res) => {
    const { fileurl } = req.body;

    if (!fileurl) {
        return res.status(400).json({ error: "Provide the file URL to delete" });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const deleteImage = await client.query(
            "DELETE FROM images WHERE fileurl = $1 RETURNING *",
            [fileurl]
        );

        const deleteReport = await client.query(
            "DELETE FROM reports WHERE fileurl = $1 RETURNING *",
            [fileurl]
        );

        await client.query('COMMIT');

        if (deleteImage.rows.length === 0) {
            return res.status(404).json({ error: "Image not found" });
        }

        if (deleteReport.rows.length === 0) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.json({
            message: "Image and report deleted successfully",
            deletedImage: deleteImage.rows[0],
            deletedReport: deleteReport.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error executing delete:', error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
});

/* KNEE */


app.post("/save-knee-report", async (req, res) => {
    try {
        console.log("passed here 0");
        const { confidence_1, confidence_2, confidence_3, confidence_4, confidence_5, username, fileurl, modeltype } = req.body;
        console.log("passed here 2");
        
        console.log("passed here 3");
        const newReport = await pool.query(
            "INSERT INTO reports (confidence_1, confidence_2, confidence_3, confidence_4, confidence_5, username, fileurl, modeltype) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [confidence_1, confidence_2, confidence_3, confidence_4, confidence_5, username, fileurl, modeltype]
        );
        console.log("passed here 4");

        res.json(newReport.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});


app.get('/get-knee-largest-confidence', async (req, res) => {
    const { fileurl } = req.query;

    try {
        const result = await pool.query(
            `SELECT confidence_1, confidence_2, confidence_3, confidence_4, confidence_5, created_at FROM reports WHERE fileurl = $1`,
            [fileurl]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const confidences = result.rows[0];
        let maxConfidence = -1;
        let maxConfidenceKey = null;

        for (const [key, value] of Object.entries(confidences)) {
            if (key.startsWith('confidence') && value > maxConfidence) {
                maxConfidence = value;
                maxConfidenceKey = key;
            }
        }

        res.json({ maxConfidence, maxConfidenceKey, created_at: confidences.created_at });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }

    
});

app.get('/get-knee-confidence-intervals', async (req, res) => {
    const { fileurl } = req.query;

    try {
        const result = await pool.query(
            `SELECT confidence_1, confidence_2, confidence_3, created_at FROM reports WHERE fileurl = $1`,
            [fileurl]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const confidences = result.rows[0];
        const response = {
            confidence_1: confidences.confidence_1,
            confidence_2: confidences.confidence_2,
            confidence_3: confidences.confidence_3,
            created_at: confidences.created_at
        };

        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/* CHEST */


app.post("/save-chest-report", async (req, res) => {
    try {
        console.log("passed here 0");
        const { confidence_1, confidence_2, confidence_3, confidence_4, confidence_5,  confidence_6,  confidence_7,  confidence_8,  confidence_9,  confidence_10,  confidence_11,  confidence_12,  confidence_13, confidence_14, username, fileurl, modeltype } = req.body;
        console.log("passed here 2");
        
        console.log("passed here 3");
        const newReport = await pool.query(
            "INSERT INTO reports (confidence_1, confidence_2, confidence_3, confidence_4, confidence_5, confidence_6, confidence_7, confidence_8, confidence_9, confidence_10, confidence_11, confidence_12, confidence_13, confidence_14, username, fileurl, modeltype) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
            [confidence_1, confidence_2, confidence_3, confidence_4, confidence_5, confidence_6, confidence_7, confidence_8, confidence_9, confidence_10, confidence_11, confidence_12, confidence_13, confidence_14, username, fileurl, modeltype]
        );
        
        console.log("passed here 4");

        res.json(newReport.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "DID NOT UPDATE CHEST LOL" });
    }
});


app.get('/get-chest-largest-confidence', async (req, res) => {
    const { fileurl } = req.query;

    try {
        const result = await pool.query(
            `SELECT confidence_1, confidence_2, confidence_3, confidence_4, confidence_5,  confidence_6,  confidence_7,  confidence_8,  confidence_9,  confidence_10,  confidence_11,  confidence_12,  confidence_13, confidence_14, created_at FROM reports WHERE fileurl = $1`,
            [fileurl]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const confidences = result.rows[0];
        let maxConfidence = -1;
        let maxConfidenceKey = null;

        for (const [key, value] of Object.entries(confidences)) {
            if (key.startsWith('confidence') && value > maxConfidence) {
                maxConfidence = value;
                maxConfidenceKey = key;
            }
        }

        res.json({ maxConfidence, maxConfidenceKey, created_at: confidences.created_at });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }

    
});

app.get('/get-chest-confidence-intervals', async (req, res) => {
    const { fileurl } = req.query;

    try {
        const result = await pool.query(
            `SELECT confidence_1, confidence_2, confidence_3, confidence_4, confidence_5, 
                    confidence_6, confidence_7, confidence_8, confidence_9, confidence_10, 
                    confidence_11, confidence_12, confidence_13, confidence_14, created_at 
             FROM reports 
             WHERE fileurl = $1`,
            [fileurl]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const confidences = result.rows[0];
        // Constructing response object with all 13 confidence intervals
        const response = {
            confidence_1: confidences.confidence_1,
            confidence_2: confidences.confidence_2,
            confidence_3: confidences.confidence_3,
            confidence_4: confidences.confidence_4,
            confidence_5: confidences.confidence_5,
            confidence_6: confidences.confidence_6,
            confidence_7: confidences.confidence_7,
            confidence_8: confidences.confidence_8,
            confidence_9: confidences.confidence_9,
            confidence_10: confidences.confidence_10,
            confidence_11: confidences.confidence_11,
            confidence_12: confidences.confidence_12,
            confidence_13: confidences.confidence_13,
            confidence_14: confidences.confidence_14,
            created_at: confidences.created_at
        };

        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/* CHEST P */


app.post("/save-chest-p-report", async (req, res) => {
    try {
        console.log("passed here 0");
        const { confidence_1, confidence_2, username, fileurl, modeltype } = req.body;
        console.log("passed here 2");
        
        console.log("passed here 3");
        const newReport = await pool.query(
            "INSERT INTO reports (confidence_1, confidence_2,username, fileurl, modeltype) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [confidence_1, confidence_2,username, fileurl, modeltype]
        );
        
        console.log("passed here 4");

        res.json(newReport.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "DID NOT UPDATE CHEST LOL" });
    }
});


app.get('/get-chest-p-largest-confidence', async (req, res) => {
    const { fileurl } = req.query;

    try {
        const result = await pool.query(
            `SELECT confidence_1, confidence_2, created_at FROM reports WHERE fileurl = $1`,
            [fileurl]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const confidences = result.rows[0];
        let maxConfidence = -1;
        let maxConfidenceKey = null;

        for (const [key, value] of Object.entries(confidences)) {
            if (key.startsWith('confidence') && value > maxConfidence) {
                maxConfidence = value;
                maxConfidenceKey = key;
            }
        }

        res.json({ maxConfidence, maxConfidenceKey, created_at: confidences.created_at });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }

    
});

app.get('/get-chest-p-confidence-intervals', async (req, res) => {
    const { fileurl } = req.query;

    try {
        const result = await pool.query(
            `SELECT confidence_1, confidence_2,  created_at 
             FROM reports 
             WHERE fileurl = $1`,
            [fileurl]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const confidences = result.rows[0];
   
        const response = {
            confidence_1: confidences.confidence_1,
            confidence_2: confidences.confidence_2,
            
            created_at: confidences.created_at
        };

        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/get-scan-info', async (req, res) => {
    const { fileurl } = req.query;

    try {
        const result = await pool.query(
            `SELECT modeltype, created_at FROM reports WHERE fileurl = $1`,
            [fileurl]
        );

        

        const scanInfo = result.rows[0];
        res.json(scanInfo);
    } catch (err) {
           
           
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});




app.listen(8000, () => {
    console.log("Server has started on port 8000");
});
