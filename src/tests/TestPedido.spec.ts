const request = require("supertest");
import { app } from "../server"; // Certifique-se de que o caminho está correto
import { Pedido } from "../models/Pedido";
import { Cliente } from "../models/Cliente";

describe("Teste da Rota incluirPedido", () => {
  let pedidoId: number
  let clienteId: number

  beforeAll(async () => {
    const novoCliente = {
      nome: "Joao",
      sobrenome: "Silva",
      cpf: "123.345.678-90"
    }
    const cliente = await Cliente.create(novoCliente);

    clienteId = cliente.id
  })

  it("Deve incluir um novo pedido com sucesso", async () => {

    const novoPedido = {
      data: "2024-01-01",
      id_cliente: clienteId
    }
    const response = await request(app).post("/incluirPedido").send(novoPedido)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.data.startsWith(novoPedido.data)).toBe(true)
    expect(response.body.id_cliente).toBe(novoPedido.id_cliente)

    pedidoId = response.body.id
  })

  afterAll(async () => {
    if (pedidoId) {
      await Pedido.destroy({ where: { id: pedidoId } })
    }
    if (clienteId) {
      await Cliente.destroy({ where: { id: clienteId } })
    }
  })
});

describe("Teste da Rota getPedidoById", () => {
  let pedidoId: number
  let clienteId: number

  beforeAll(async () => {
    const novoCliente = {
      nome: "Joao",
      sobrenome: "Silva",
      cpf: "123.345.678-90"
    }
    const cliente = await Cliente.create(novoCliente);

    clienteId = cliente.id

    const pedido = await Pedido.create({ data: "2024-01-01", id_cliente: clienteId })
    pedidoId = pedido.id
  })

  it("Deve retornar o pedido correto quando o id e valido", async () => {
    const response = await request(app).get(`/pedidos/${pedidoId}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id", pedidoId)
  })

  it("Deve retornar status 404 quando Id do pedido nao existe", async () => {
    const idNaoExistente = pedidoId + 1
    const response = await request(app).get(`/pedidos/${idNaoExistente}`)

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Pedido não encontrado");
  })

  afterAll(async () => {
    if (pedidoId) {
      await Pedido.destroy({ where: { id: pedidoId } })
    }
    if (clienteId) {
      await Cliente.destroy({ where: { id: clienteId } })
    }
  });
});

describe("Teste da Rota listarPedidos", () => {
  let clienteId: number

  beforeAll(async () => {
    const novoCliente = {
      nome: "Joao",
      sobrenome: "Silva",
      cpf: "123.345.678-90"
    }
    const cliente = await Cliente.create(novoCliente);

    clienteId = cliente.id

    let pedido = await Pedido.create({ data: "2024-01-01", id_cliente: cliente.id })
    pedido = await Pedido.create({ data: "2024-01-02", id_cliente: cliente.id })
    pedido = await Pedido.create({ data: "2024-01-03", id_cliente: cliente.id })
  })

  it("Deve retornar uma lista de pedidos", async () => {
    const response = await request(app).get("/pedidos");

    expect(response.status).toBe(200);
    expect(response.body.produtos).toBeInstanceOf(Array);
  });

  it("Deve retornar a lista de pedidos dentro de um tempo aceitavel", async () => {
    const start = Date.now();
    const response = await request(app).get("/pedidos");
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100); // Verifica se a resposta é retornada em menos de 500ms
  });

  afterAll(async () => {
    if (clienteId) {
      Cliente.destroy({ where: { id: clienteId } })
    }
    const listaPedidos = await Pedido.findAll()
    listaPedidos.forEach((p) => p.destroy())
  })
});

// describe("Teste da Rota excluirPedido", () => {
//   const pedidoId = 420
//
//   beforeAll(async () => {
//     await Pedido.create({ id: pedidoId, data: "2024-01-01", id_cliente: 1 });
//   });
//
//   afterAll(async () => {
//     await Pedido.destroy({ where: { id: pedidoId } })
//   })
//
//   it("Deve excluir um pedido existente", async () => {
//     const response = await request(app).delete(`/excluirPedido/${pedidoId}`)
//
//     expect(response.status).toBe(200)
//     expect(response.body).toHaveProperty("message", "Pedido excluído com sucesso");
//
//     const pedidoExcluido = await Pedido.findByPk(pedidoId)
//     expect(pedidoExcluido).toBeNull();
//   })
//
// });
//
// describe("Teste da Rota atualizarPedido", () => {
//   let pedidoId: number
//
//   beforeAll(async () => {
//     const pedido = await Pedido.create({ data: "2024-01-01", id_cliente: 1 })
//     pedidoId = pedido.id
//   })
//
//   afterAll(async () => {
//     if (pedidoId) {
//       await Pedido.destroy({ where: { id: pedidoId } });
//     }
//   });
//
//   it("Deve atualizar pedido com sucesso", async () => {
//     const pedidoAtualizado = {
//       data: "2024-01-02",
//       id_cliente: 2
//     }
//     const response = await request(app).put(`/atualizarPedido/${pedidoId}`)
//
//     expect(response.status).toBe(200)
//     expect(response.body.data).toBe(pedidoAtualizado.data)
//     expect(response.body.id_cliente).toBe(pedidoAtualizado.id_cliente)
//   })
// });
