require('dotenv').config();
const mongoose = require('mongoose');
const {Schema} = mongoose;
const {randomUUID} = require('crypto');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to MongoDB');

  const ocorrenciaSchema = new Schema({
    _id: {
      type: 'UUID',
      default: () => randomUUID()
    },
    titulo: String,
    descricao: String,
    tipo: {
      type: String,
      enum: ['Assalto', 'Squestro', 'Homicidio', 'Outros']
    },
    data: {
      type: Date,
      default: new Date()
    },
    localizacao: {
      type: {
        type: String, 
        enum: ['Point'], 
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  });

  ocorrenciaSchema.index(
    {titulo: 'text', descricao: 'text'},
    {default_language: 'pt', weight:{titulo:2, descricao:1}}
  );

  const Ocorrencia = mongoose.model('ocorrencias', ocorrenciaSchema);
  
  // const ocorrencia = {
  //   titulo: 'Assalto na esquina do IFPB',
  //   descricao: "Duas motos e um cara",
  //   tipo: 'Assalto',
  //   localizacao: {
  //     type: 'Point',
  //     coordinates: [ -38.55270748649413 ,-6.888354292353622]
  //   }
  // }
  
  // Ocorrencia.create(ocorrencia).then(retorno => {
  //   console.log(retorno);
  // }).catch(err => {
  //   console.error(err);
  // });

  Ocorrencia.find({}, {titulo:1,localizacao:1, _id:0}).then(ocorrencias => {
    console.log(ocorrencias);;
  }).catch(err => { 
    console.error(err);
  });
}


