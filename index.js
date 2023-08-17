import { config } from "dotenv"
config()

import express from "express"
import { Configuration, OpenAIApi } from "openai"

const app = express();

const corsOptions ={
  origin:'https://venerable-kringle-477bbd.netlify.app/', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(cors(corsOptions));

app.use(express.json());
// Add Access Control Allow Origin headers
/* app.use(function(req, res, next){
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
}); */

/* app.use(cors()); */

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_API_KEY,
});
const openai = new OpenAIApi(configuration);

const port = process.env.PORT || 5000;

app.post("/ask", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    const completion = response.data.choices[0].message.content;
    console.log(completion);
    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));
