// Cadastro de produtos com base na query de inventário

module.exports = {
  query: `select
    d.seqproduto as "seqproduto",
    x.codacesso as "ean",
    d.desccompleta as "description",
    x.qtdembalagem as "quantity_packing"
    from mrl_produtoempresa c,
    map_produto d,
    map_famdivcateg e,
    map_categoria f,
    map_prodcodigo x
    where c.seqproduto = x.seqproduto
    and c.seqproduto = d.seqproduto
    and d.seqfamilia = e.seqfamilia
    and e.seqcategoria = f.seqcategoria
    and x.tipcodigo in ('E','B','D')
    and f.nivelhierarquia = 1
    and f.tipcategoria = 'M'
    and f.statuscategor = 'A'
    and c.nroempresa = 1
    and d.seqproduto < 100
    and f.seqcategoria not in (719,720,1845,1847,1848,1843 )
    group by d.seqproduto, x.codacesso, d.desccompleta, x.qtdembalagem`,
};
