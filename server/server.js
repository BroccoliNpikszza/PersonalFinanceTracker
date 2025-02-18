const express = require("express");
const cors = require("cors");
const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions))

app.get("/api",(req, res)=>{
  res.json({
    "fruits":["apple","orange"]
  });
});

app.listen(3000,()=>{
  console.log("Server running on port 3000...");
});

