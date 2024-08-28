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
    tite: String,
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
  
  const ocorrencia = {
    titulo: 'Assalto na esquina do IFPB',
    descricao: "Duas motos em um cara",
    tipo: 'Assalto',
    localizacao: {
      type: 'Point',
      coordinates: [-38.54564, -6.89057]
    }
  }
  
  Ocorrencia.create(ocorrencia).then(retorno => {
    console.log(retorno);
  }).catch(err => {
    console.error(err);
  });
}


