// import Query from '../config/oracledb';
import knexOra from '../database/oracle';
import knexPg from '../database/postgres';
import qrProducts from '../querys/products';

class ProductController {
  async store(req, res) {
    try {
      await knexPg('products')
        .del()
        .truncate();

      const products = await knexOra.raw(qrProducts.query);

      const nDate = new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      });

      products.map(async product => {
        await knexPg('products').insert({
          seqproduto: product.seqproduto,
          ean: product.ean,
          description: product.description,
          quantity_packing: product.quantity_packing,
          created_at: nDate,
          updated_at: nDate,
        });
      });

      return res.json({ message: 'syncy ok' });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `Falha ao inserir dados no banco de dados${error}` });
    }
  }

  async index(req, res) {
    try {
      const products = await knexOra
        .raw(qrProducts.query)
        .options({ nestTables: false, rowMode: 'object' });

      return res.json(products);
    } catch (error) {
      return res
        .status(400)
        .json({ error: `Falha ao sincronizar banco de dados${error}` });
    }
  }
}

export default new ProductController();
