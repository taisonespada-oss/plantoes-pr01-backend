const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, 'dados.json');

app.use(cors());
app.use(express.json());

// GET - devolve todos os dados
app.get('/api/plantoes-pr01', (req, res) => {
  fs.readFile(FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo:', err);
      return res.status(500).json({ error: 'Erro ao ler dados' });
    }
    try {
      const json = JSON.parse(data || '{}');
      res.json(json);
    } catch (e) {
      console.error('Erro ao parsear JSON:', e);
      res.status(500).json({ error: 'Erro ao interpretar dados' });
    }
  });
});

// POST - salva todos os dados
app.post('/api/plantoes-pr01', (req, res) => {
  const { senha, periodos, extras } = req.body;

  const data = {
    senha: senha || 'segurança2026',
    periodos: Array.isArray(periodos) ? periodos : [],
    extras: typeof extras === 'object' && extras !== null ? extras : {}
  };

  fs.writeFile(FILE, JSON.stringify(data, null, 2), err => {
    if (err) {
      console.error('Erro ao salvar arquivo:', err);
      return res.status(500).json({ error: 'Erro ao salvar dados' });
    }
    res.json({ ok: true });
  });
});

// só pra testar rápido
app.get('/', (req, res) => {
  res.send('API de Plantões PR01 está rodando');
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta', PORT);
});