const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Criar um jogador
router.post('/', async (req, res) => {
    const player = new Player(req.body);
    try {
        await player.save();
        res.status(201).send({ message: 'Jogador adicionado com sucesso!', player });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Listar jogadores
router.get('/', async (req, res) => {
    const players = await Player.find();
    res.send(players);
});

// Editar um jogador
router.put('/:id', async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!player) {
            return res.status(404).send({ message: 'Jogador não encontrado!' });
        }
        res.send({ message: 'Jogador atualizado com sucesso!', player });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Remover um jogador
router.delete('/:id', async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            return res.status(404).send({ message: 'Jogador não encontrado!' });
        }
        res.send({ message: 'Jogador removido com sucesso!' });
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;
