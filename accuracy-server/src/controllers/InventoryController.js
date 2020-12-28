import knexPg from '../database/postgres';

class InventoryController {
  async store(req, res) {
    const nDate = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });

    const {
      user,
      area,
      subarea,
      quantity_packing,
      seqproduto,
      ean,
      description,
      quantity,
      inventory_number,
      collector,
    } = req.body;

    await knexPg('inventories').insert({
      user,
      area,
      subarea,
      quantity_packing,
      seqproduto,
      ean,
      description,
      quantity,
      inventory_number,
      collector,
      created_at: nDate,
      updated_at: nDate,
    });

    return res.json({ message: 'ok' });
  }

  async index(req, res) {
    let where = {}
    for (const [key, value] of Object.entries(req.query)) {
      where[key] = value
    }
    res.json(
      await knexPg('inventories')
            .where(where)
            .select('*')
            .orderBy('collector')
    );
  }

  async indexGroup(req, res) {
    let where = {}
    for (const [key, value] of Object.entries(req.query)) {
      where[key] = value
    }
    res.json(
      await knexPg('inventories')
            .select('collector')
            .count('*')
            .where(where)
            .groupBy('collector')
            .orderBy('collector')
    )
  }

  async delete(req, res) {
    let where = {}
    for (const [key, value] of Object.entries(req.query)) {
      where[key] = value
    }

    res.json(
      await knexPg('inventories').delete()
        .where(where)
        .select('*')
    );
  }
}

export default new InventoryController();
