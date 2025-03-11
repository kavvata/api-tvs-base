import { Request, Response } from 'express';
import { Produto } from '../models/Produto';
import { Pedido } from '../models/Pedido';
import { Cliente } from '../models/Cliente';


export const listarPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await Pedido.findAll();

    if (pedidos.length === 0) {
      res.status(404).json({ message: 'Nenhum pedido encontrado' })
    } else {
      res.json({ pedidos: pedidos });
    }
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ message: 'Erro ao listar pedidos.' });
  }
};

export const incluirPedido = async (req: Request, res: Response) => {
  try {
    const { data, id_cliente } = req.body;

    // Certifique-se de que o pedido e o produto existem antes de criar o item do pedido
    const clienteExistente = await Cliente.findByPk(id_cliente);

    if (!clienteExistente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    const novoPedido = await Pedido.create({
      id_cliente: id_cliente,
      data: data
    });

    res.status(201).json(novoPedido);
  } catch (error) {
    console.error('Erro ao incluir pedido:', error);
    res.status(500).json({ message: 'Erro ao incluir pedido' });
  }
};

export const atualizarPedido = async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id, 10);
    const { id_pedido, id_produto, qtdade } = req.body;

    const itemDoPedido = await Pedido.findByPk(itemId);

    if (itemDoPedido) {
      // Certifique-se de que o pedido e o produto existem antes de atualizar o item do pedido
      const pedidoExistente = await Pedido.findByPk(id_pedido);
      const produtoExistente = await Produto.findByPk(id_produto);

      if (!pedidoExistente || !produtoExistente) {
        return res.status(404).json({ message: 'Pedido ou Produto não encontrado' });
      }

      await itemDoPedido.update({ id_pedido, id_produto, qtdade });
      res.json(itemDoPedido);
    } else {
      res.status(404).json({ message: 'Item do Pedido não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar item do pedido:', error);
    res.status(500).json({ message: 'Erro ao atualizar item do pedido' });
  }
};

export const excluirPedido = async (req: Request, res: Response) => {
  try {
    const pedidoId = parseInt(req.params.id, 10);
    const pedido = await Pedido.findByPk(pedidoId);

    if (pedido) {
      await pedido.destroy();
      res.json({ message: 'Pedido excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao excluir pedido:', error);
    res.status(500).json({ message: 'Erro ao excluir pedido.' });
  }
};

export const getPedidoById = async (req: Request, res: Response) => {
  try {
    const pedidoId = parseInt(req.params.id, 10);
    const pedido = await Pedido.findByPk(pedidoId);

    if (pedido) {
      res.json(pedido);
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ message: 'Erro ao buscar pedido' });
  }
};
