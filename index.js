const express = require('express');
const app = express();
const port = 3000;

app.get('/',(req,res)=>{
  res.sendFile("Source/index.html");
});

app.listen(port,()=>{
  console.log("Server running on port 3000...");
});
