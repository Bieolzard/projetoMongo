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

// Listar jogadores com filtro e ordenação
router.get('/', async (req, res) => {
    const { position, sortBy } = req.query;
    const filter = position ? { position } : {};
    const sortOptions = sortBy === 'name' ? { name: 1 } : {};

    try {
        const players = await Player.find(filter).sort(sortOptions);
        res.json(players);
    } catch (error) {
        res.status(500).send(error);
    }
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

// Agrupar jogadores por posição
router.get('/grouped', async (req, res) => {
    try {
        const groupedPlayers = await Player.aggregate([
            { $group: { _id: "$position", count: { $sum: 1 } } },
            { $sort: { count: -1 } } // Ordena pela contagem em ordem decrescente
        ]);
        res.json(groupedPlayers);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
