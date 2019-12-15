const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1')
const { IamAuthenticator } = require('ibm-watson/auth')
const fs = require('fs')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({ apikey: 'bStOwh1HB6nAEeNhOE7zhXemiNmrinEUpjgfrL2fDEMf' }),
    url: 'https://api.us-east.text-to-speech.watson.cloud.ibm.com/instances/030c7e00-f723-456c-b512-7ac7ba3e389e'
});


app.get('/', (req, res) => {
    res.setHeader('content-type', 'audio/mp3')
    res.sendFile('audio.mp3', { root: __dirname })
    res.on('close', () => {
        fs.unlinkSync('audio.mp3')
    })

})
app.get('/speak', (req, res) => {
    res.setHeader('Content-Type', 'audio/mp3')
    textToSpeech.synthesize({
        text: req.query.t,
        accept: 'audio/mp3',
        voice: 'pt-BR_IsabelaVoice'
    })
        .then(audio => {
            audio.result
            audio.result.pipe(res)
        })
        .catch(err => {
            console.log('error:', err);
        });

})

app.listen(process.env.PORT || 8080, () => console.log('okok'))