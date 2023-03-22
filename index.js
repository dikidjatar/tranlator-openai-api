// coded by Diki Djatar

const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express(); // express
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const configuration = new Configuration({
  apiKey: process.env.API_KEY //engambil apikey dari file .env
});

const openai = new OpenAIApi(configuration);

app.use(express.static(path.join(__dirname+"/public")));
app.use(bodyParser.json());
app.use(cors());

io.on('connection', function(socket) {
  socket.on('prompt', function(data) {
    // console.log(data);
    const textTranslate = `Terjemahkan "${data.message}" kedalam bahasa ${data.selectTo}`; // text terjemahan
    const completion = openai.createCompletion({
      model: 'text-davinci-003', // model
      prompt: textTranslate,
      temperature: 0.1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 256
    });
    completion.then(incomingData => {
      const message = incomingData.data.choices[0].text;
      // console.log(message);
      socket.emit('translate', {
        text: message
      });
    }).catch(err => console.log(err));
  });
});

const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
