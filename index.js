const speech = require('@google-cloud/speech');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'speectotext.json';

async function transcribeAudio(audiofile){
    try{
        const speechClient = new speech.speechClient();

        const file = fs.readFileSync(audiofile);
        const audioBytes = file.toString('base64');

        const audio = {
            content: audioBytes
        };

        const config ={
            encoding:'LINEAR16',
            sampleRateHertz:4410,
            languageCode:'en-US'
        }
        return new Promise((resolve, reject)=>{
            speechClient.recognize({audio, config})
            .then(data=>{
                resolve(data);
            })
            .catch(error=>{
                reject(error);
            })
        })


    }
    catch(error){
        console.error('ERROR', error);


    }
}

(async()=>{
    const data = await transcribeAudio('');//enter audio file in quotes
    console.log(data[0].results.map(r=>r.alternatives[0].transcript).join('\n'));
})
    
