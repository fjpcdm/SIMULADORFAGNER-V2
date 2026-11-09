// ============================================================
// ARQUIVO: dados_rotas.js
// BANCO DE DADOS DE ROTAS - SIMULADOR
// ============================================================
window.linesDatabase = window.linesDatabase || {};

// ============================================================
// LINHA: 3450 - Bosque
// ============================================================
window.linesDatabase["301C"] = {

  "linha": "301C",
  "nome": "Terminal Ibirité / Belo Horizonte - Via Amazonas",
  "arquivo_fonte": "301C Terminal Ibirité x BH - Via Amazonas.txt",
  "total_registros": 104,
  "criterio_divisao": "Ida: registros 1 a 48, encerrando no ponto final da Av. Olegário Maciel, 330. Volta: registros 49 a 104, conforme sequência do TXT.",
  "formato_coordenadas": "latitude/longitude decimais; valores null enquanto não geocodificados. Não foram inventadas coordenadas.",
  "sentidos": {
    "ida": {
      "inicio": "Terminal Ibirité",
      "fim": "Av. Olegário Maciel, 330",
      "quantidade_paradas": 48,
      "paradas": [
        {
          "ordem": 1,
          "endereco": "Terminal Ibirité",
          "referencia": "Linhas Troncais",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 2,
          "endereco": "Av. Pinheiros, 1755",
          "referencia": "Oposto A Entrada Do Serra Dourada",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 3,
          "endereco": "Rua Sessenta e Tres 56",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 4,
          "endereco": "Av. Pinheiros, 1153",
          "referencia": "Oposto A Escola Vila Ideal Serra Dourada",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 5,
          "endereco": "Av. Pinheiros, 815",
          "referencia": "Ibiritrans Sentido Barreiro",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 6,
          "endereco": "Avenida Pinheiros 778",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 7,
          "endereco": "Av. Pinheiros, 595",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 8,
          "endereco": "Av. Pinheiros, 189",
          "referencia": "Auto Escola Ciganos Sentido Barreiro",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 9,
          "endereco": "Rua Júlio De Mesquita, 348",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 10,
          "endereco": "Rua Júlio De Mesquita, 268",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 11,
          "endereco": "Rua Júlio De Mesquita, 179",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 12,
          "endereco": "Avenida Nelio Cerqueira 2069",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 13,
          "endereco": "Rua Lupércio Paixão, 219",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 14,
          "endereco": "Rua Lupércio Paixão, 75",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 15,
          "endereco": "Rua Antônio Eustáquio Piazza, 3785",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 16,
          "endereco": "Rua Antônio Eustáquio Piazza, 3385",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 17,
          "endereco": "Rua Antônio Eustáquio Piazza, 3267",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 18,
          "endereco": "Rua Antônio Eustáquio Piazza, 2815",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 19,
          "endereco": "Rua Antonio Eustaquio Piazza 77",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 20,
          "endereco": "Av. Afonso Vaz De Melo, 2317",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 21,
          "endereco": "Av. Afonso Vaz De Melo, 1535",
          "referencia": "Lado Oposto Ao Villefort Atacadista",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 22,
          "endereco": "Avenida Sinfrônio Brochado, 1281",
          "referencia": "Colégio São Paulo Da Cruz",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 23,
          "endereco": "Avenida Sinfrônio Brochado, 1053",
          "referencia": "Comercial Esporte Clube",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 24,
          "endereco": "Avenida Sinfrônio Brochado, 773",
          "referencia": "Oposto A Toc Pneus",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 25,
          "endereco": "Avenida Sinfrônio Brochado, 355",
          "referencia": "Escola Estadual Rodrigues Campos E Oposto A Papelaria Milcopy",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 26,
          "endereco": "Avenida Sinfrônio Brochado, 91",
          "referencia": "Banco Itaú, Hanbai Motos",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 27,
          "endereco": "Avenida Olinto Meireles, 321",
          "referencia": "Oposto A Unimed",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 28,
          "endereco": "Avenida Tito Fulgêncio 1131",
          "referencia": "Hospital Santa Rita",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 29,
          "endereco": "Avenida Tito Fulgêncio, 861",
          "referencia": "Altas Horas",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 30,
          "endereco": "Avenida Tito Fulgêncio, 660",
          "referencia": "Oposto Ao Super Tecidos Paraiso",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 31,
          "endereco": "Avenida Tito Fulgêncio, 353",
          "referencia": "Garapão",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 32,
          "endereco": "Avenida Tito Fulgêncio, 69",
          "referencia": "Car Vidros",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 33,
          "endereco": "Avenida General David Sarnoff 237",
          "referencia": "Antiga Fábrica Aymore Antes Da Roma Fiat",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 34,
          "endereco": "Praça Da Vilma Sentido Belo Horizonte",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 35,
          "endereco": "Avenida Amazonas, 8755",
          "referencia": "Cardiesel",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 36,
          "endereco": "Avenida Amazonas, 7650",
          "referencia": "Cefet Campus II",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 37,
          "endereco": "Avenida Amazonas, 6955",
          "referencia": "Colégio Salesiano",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 38,
          "endereco": "Hospital Sarah",
          "referencia": "Oposto Ao Expominas",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 39,
          "endereco": "Avenida Amazonas, 5455",
          "referencia": "Depois Do Cdd Correios",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 40,
          "endereco": "Cefet-Mg Campus I - Ponto 1",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 41,
          "endereco": "Avenida Amazonas, 3787",
          "referencia": "Pastelaria Amazonas",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 42,
          "endereco": "Avenida Amazonas, 3555",
          "referencia": "Antes Da Othomóveis",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 43,
          "endereco": "Avenida Amazonas, 3203",
          "referencia": "Oposto A Unincor",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 44,
          "endereco": "Avenida Amazonas, 2515",
          "referencia": "Amazonas Com Martim De Carvalho 1",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 45,
          "endereco": "Rua Araguari, 653 Com R. Timbiras",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 46,
          "endereco": "Rua Araguari, 227 Com R. Goitacazes 1",
          "referencia": "",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 47,
          "endereco": "Rua Dos Tupinambás, 1045",
          "referencia": "Senac 2",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 48,
          "endereco": "Av. Olegário Maciel, 330",
          "referencia": "Ponto Final Linhas 300c, 301c E 3992",
          "sentido": "ida",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        }
      ],
      "trajeto": []
    },
    "volta": {
      "inicio": "Av. Olegário Maciel, 714",
      "fim": "Terminal Ibirité",
      "quantidade_paradas": 56,
      "paradas": [
        {
          "ordem": 49,
          "endereco": "Av. Olegário Maciel, 714",
          "referencia": "Mercado Novo 1",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 50,
          "endereco": "Avenida Amazonas, 1744",
          "referencia": "Colégio Santo Agostinho 6",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 51,
          "endereco": "Av. Amazonas, 2116",
          "referencia": "Av. Amazonas Com Barbacena 4",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 52,
          "endereco": "Avenida Amazonas, 2464",
          "referencia": "Orquestra Filarmônica 1",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 53,
          "endereco": "Avenida Amazonas, 2900",
          "referencia": "Bar E Lanchonete A.F.R.",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 54,
          "endereco": "Avenida Amazonas, 3200",
          "referencia": "Unincor",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 55,
          "endereco": "Avenida Amazonas, 3718",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 56,
          "endereco": "Avenida Amazonas, 4444",
          "referencia": "Antes Da Igreja Assembléia De Deus",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 57,
          "endereco": "Avenida Amazonas, 5100",
          "referencia": "Bh Convention Hotel E Oposto Ao Cefet-Mg Campus I",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 58,
          "endereco": "Avenida Amazonas, 5400",
          "referencia": "Marcela Móveis",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 59,
          "endereco": "Avenida Amazonas, 6000",
          "referencia": "Parque De Exposições Da Gameleira/Expominas E Oposto Ao Cefet-Mg Campus VI",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 60,
          "endereco": "Avenida Amazonas, 6500",
          "referencia": "Citerol Uniformes E Oposto 5º Batalhão De Polícia Militar",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 61,
          "endereco": "Avenida Amazonas, 7100",
          "referencia": "Oposto A Escola Estadual Ordem E Progresso",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 62,
          "endereco": "Avenida Amazonas, 7500",
          "referencia": "Oposto Ao Cefet Campus II",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 63,
          "endereco": "Avenida Amazonas, 8400",
          "referencia": "Igreja Universal",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 64,
          "endereco": "Avenida Amazonas, 8720",
          "referencia": "Oposto A Cardiesel",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 65,
          "endereco": "Praça Da Vilma Sentido Contagem/Betim/Barreiro",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 66,
          "endereco": "Av. Cardeal Eugênio Pacelli, 1145",
          "referencia": "General Electric",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 67,
          "endereco": "Avenida General David Sarnoff, 237",
          "referencia": "Estamparia Sentido Barreiro",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 68,
          "endereco": "Avenida General David Sarnoff, 5547",
          "referencia": "Antes Do Viaduto",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 69,
          "endereco": "Avenida Tito Fulgêncio, 142",
          "referencia": "Inss 1",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 70,
          "endereco": "Avenida Tito Fulgêncio, 306",
          "referencia": "Transit Car",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 71,
          "endereco": "Avenida Tito Fulgêncio 604",
          "referencia": "Depois Do Villefort",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 72,
          "endereco": "Avenida Tito Fulgêncio, 860",
          "referencia": "Industrial Tintas",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 73,
          "endereco": "Avenida Tito Fulgêncio 1134",
          "referencia": "Ótica Sete (Próximo Ao Hospital Santa Rita)",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 74,
          "endereco": "Avenida Olinto Meireles, 304",
          "referencia": "Unimed/Flaviokar Veículos/Fazendinha Do Barreiro",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 75,
          "endereco": "Avenida Sinfrônio Brochado, 196",
          "referencia": "Lanchonete Pastelouco",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 76,
          "endereco": "Avenida Visconde De Ibituruna, 94",
          "referencia": "Magazine Luiza",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 77,
          "endereco": "Avenida Afonso Vaz De Melo, 250",
          "referencia": "Stepanie Colchões",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 78,
          "endereco": "Avenida Afonso Vaz De Melo, 460",
          "referencia": "Via Shopping Antes Da Passarela",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 79,
          "endereco": "Av. Afonso Vaz De Melo, 1000",
          "referencia": "Praça Cristo Reina",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 80,
          "endereco": "Avenida Afonso Vaz De Melo, 1256",
          "referencia": "Puc Minas Campus Barreiro",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 81,
          "endereco": "Av. Afonso Vaz De Melo, 1730",
          "referencia": "Villefort Atacadista",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 82,
          "endereco": "Av. Do Canal, 53",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 83,
          "endereco": "Av. Do Canal, 313",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 84,
          "endereco": "Rua Antonio Eustaquio Piazza 2514",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 85,
          "endereco": "Rua Antônio Eustáquio Piazza, 2240",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 86,
          "endereco": "Rua Braulio Gomes Nogueira 59",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 87,
          "endereco": "Rua Caetano De Vasconcelos, 120",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 88,
          "endereco": "Rua Antônio Eustáquio Piazza, 3242",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 89,
          "endereco": "Rua Antônio Eustáquio Piazza, 3482",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 90,
          "endereco": "Rua Antônio Eustáquio Piazza 3744",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 91,
          "endereco": "Rua Antônio Eustáquio Piazza, 4020",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 92,
          "endereco": "Rua Lupércio Paixão, 226",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 93,
          "endereco": "Av. Nélio Cerqueira, 1800",
          "referencia": "Depósito Portela, Auto Escola Ciganos",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 94,
          "endereco": "Rua Júlio Mesquita, 178",
          "referencia": "Supermercado Dia",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 95,
          "endereco": "Rua Júlio De Mesquita, 273",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 96,
          "endereco": "Rua Júlio De Mesquita, 143",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 97,
          "endereco": "Av. Noraldino Lima, 20",
          "referencia": "Trevo De Ibirité Sentido Ibirité/Contagem",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 98,
          "endereco": "Av. Pinheiros, 200",
          "referencia": "Oposto A Auto Escola Ciganos Sentido Centro De Ibirité",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 99,
          "endereco": "Av. Pinheiros, 590",
          "referencia": "Renascer Colchões E Móveis",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 100,
          "endereco": "Avenida Pinheiros 780",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 101,
          "endereco": "Av. Pinheiros, 1140",
          "referencia": "Escola Vila Ideal Serra Dourada",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 102,
          "endereco": "Rodovia Renato Brandão Azeredo 1440",
          "referencia": "",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 103,
          "endereco": "Av. Pinheiros, 1700",
          "referencia": "Entrada Para O Serra Dourada",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        },
        {
          "ordem": 104,
          "endereco": "Terminal Ibirité",
          "referencia": "Só Desembarque (Encerrando Viagem)",
          "sentido": "volta",
          "latitude": null,
          "longitude": null,
          "status_coordenada": "pendente de geocodificacao"
        }
      ],
      "trajeto": []
    }
  },
  "paradas_sequencia_original": [
    {
      "ordem": 1,
      "endereco": "Terminal Ibirité",
      "referencia": "Linhas Troncais",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 2,
      "endereco": "Av. Pinheiros, 1755",
      "referencia": "Oposto A Entrada Do Serra Dourada",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 3,
      "endereco": "Rua Sessenta e Tres 56",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 4,
      "endereco": "Av. Pinheiros, 1153",
      "referencia": "Oposto A Escola Vila Ideal Serra Dourada",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 5,
      "endereco": "Av. Pinheiros, 815",
      "referencia": "Ibiritrans Sentido Barreiro",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 6,
      "endereco": "Avenida Pinheiros 778",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 7,
      "endereco": "Av. Pinheiros, 595",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 8,
      "endereco": "Av. Pinheiros, 189",
      "referencia": "Auto Escola Ciganos Sentido Barreiro",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 9,
      "endereco": "Rua Júlio De Mesquita, 348",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 10,
      "endereco": "Rua Júlio De Mesquita, 268",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 11,
      "endereco": "Rua Júlio De Mesquita, 179",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 12,
      "endereco": "Avenida Nelio Cerqueira 2069",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 13,
      "endereco": "Rua Lupércio Paixão, 219",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 14,
      "endereco": "Rua Lupércio Paixão, 75",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 15,
      "endereco": "Rua Antônio Eustáquio Piazza, 3785",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 16,
      "endereco": "Rua Antônio Eustáquio Piazza, 3385",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 17,
      "endereco": "Rua Antônio Eustáquio Piazza, 3267",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 18,
      "endereco": "Rua Antônio Eustáquio Piazza, 2815",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 19,
      "endereco": "Rua Antonio Eustaquio Piazza 77",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 20,
      "endereco": "Av. Afonso Vaz De Melo, 2317",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 21,
      "endereco": "Av. Afonso Vaz De Melo, 1535",
      "referencia": "Lado Oposto Ao Villefort Atacadista",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 22,
      "endereco": "Avenida Sinfrônio Brochado, 1281",
      "referencia": "Colégio São Paulo Da Cruz",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 23,
      "endereco": "Avenida Sinfrônio Brochado, 1053",
      "referencia": "Comercial Esporte Clube",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 24,
      "endereco": "Avenida Sinfrônio Brochado, 773",
      "referencia": "Oposto A Toc Pneus",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 25,
      "endereco": "Avenida Sinfrônio Brochado, 355",
      "referencia": "Escola Estadual Rodrigues Campos E Oposto A Papelaria Milcopy",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 26,
      "endereco": "Avenida Sinfrônio Brochado, 91",
      "referencia": "Banco Itaú, Hanbai Motos",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 27,
      "endereco": "Avenida Olinto Meireles, 321",
      "referencia": "Oposto A Unimed",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 28,
      "endereco": "Avenida Tito Fulgêncio 1131",
      "referencia": "Hospital Santa Rita",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 29,
      "endereco": "Avenida Tito Fulgêncio, 861",
      "referencia": "Altas Horas",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 30,
      "endereco": "Avenida Tito Fulgêncio, 660",
      "referencia": "Oposto Ao Super Tecidos Paraiso",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 31,
      "endereco": "Avenida Tito Fulgêncio, 353",
      "referencia": "Garapão",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 32,
      "endereco": "Avenida Tito Fulgêncio, 69",
      "referencia": "Car Vidros",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 33,
      "endereco": "Avenida General David Sarnoff 237",
      "referencia": "Antiga Fábrica Aymore Antes Da Roma Fiat",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 34,
      "endereco": "Praça Da Vilma Sentido Belo Horizonte",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 35,
      "endereco": "Avenida Amazonas, 8755",
      "referencia": "Cardiesel",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 36,
      "endereco": "Avenida Amazonas, 7650",
      "referencia": "Cefet Campus II",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 37,
      "endereco": "Avenida Amazonas, 6955",
      "referencia": "Colégio Salesiano",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 38,
      "endereco": "Hospital Sarah",
      "referencia": "Oposto Ao Expominas",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 39,
      "endereco": "Avenida Amazonas, 5455",
      "referencia": "Depois Do Cdd Correios",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 40,
      "endereco": "Cefet-Mg Campus I - Ponto 1",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 41,
      "endereco": "Avenida Amazonas, 3787",
      "referencia": "Pastelaria Amazonas",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 42,
      "endereco": "Avenida Amazonas, 3555",
      "referencia": "Antes Da Othomóveis",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 43,
      "endereco": "Avenida Amazonas, 3203",
      "referencia": "Oposto A Unincor",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 44,
      "endereco": "Avenida Amazonas, 2515",
      "referencia": "Amazonas Com Martim De Carvalho 1",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 45,
      "endereco": "Rua Araguari, 653 Com R. Timbiras",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 46,
      "endereco": "Rua Araguari, 227 Com R. Goitacazes 1",
      "referencia": "",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 47,
      "endereco": "Rua Dos Tupinambás, 1045",
      "referencia": "Senac 2",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 48,
      "endereco": "Av. Olegário Maciel, 330",
      "referencia": "Ponto Final Linhas 300c, 301c E 3992",
      "sentido": "ida",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 49,
      "endereco": "Av. Olegário Maciel, 714",
      "referencia": "Mercado Novo 1",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 50,
      "endereco": "Avenida Amazonas, 1744",
      "referencia": "Colégio Santo Agostinho 6",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 51,
      "endereco": "Av. Amazonas, 2116",
      "referencia": "Av. Amazonas Com Barbacena 4",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 52,
      "endereco": "Avenida Amazonas, 2464",
      "referencia": "Orquestra Filarmônica 1",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 53,
      "endereco": "Avenida Amazonas, 2900",
      "referencia": "Bar E Lanchonete A.F.R.",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 54,
      "endereco": "Avenida Amazonas, 3200",
      "referencia": "Unincor",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 55,
      "endereco": "Avenida Amazonas, 3718",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 56,
      "endereco": "Avenida Amazonas, 4444",
      "referencia": "Antes Da Igreja Assembléia De Deus",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 57,
      "endereco": "Avenida Amazonas, 5100",
      "referencia": "Bh Convention Hotel E Oposto Ao Cefet-Mg Campus I",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 58,
      "endereco": "Avenida Amazonas, 5400",
      "referencia": "Marcela Móveis",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 59,
      "endereco": "Avenida Amazonas, 6000",
      "referencia": "Parque De Exposições Da Gameleira/Expominas E Oposto Ao Cefet-Mg Campus VI",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 60,
      "endereco": "Avenida Amazonas, 6500",
      "referencia": "Citerol Uniformes E Oposto 5º Batalhão De Polícia Militar",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 61,
      "endereco": "Avenida Amazonas, 7100",
      "referencia": "Oposto A Escola Estadual Ordem E Progresso",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 62,
      "endereco": "Avenida Amazonas, 7500",
      "referencia": "Oposto Ao Cefet Campus II",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 63,
      "endereco": "Avenida Amazonas, 8400",
      "referencia": "Igreja Universal",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 64,
      "endereco": "Avenida Amazonas, 8720",
      "referencia": "Oposto A Cardiesel",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 65,
      "endereco": "Praça Da Vilma Sentido Contagem/Betim/Barreiro",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 66,
      "endereco": "Av. Cardeal Eugênio Pacelli, 1145",
      "referencia": "General Electric",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 67,
      "endereco": "Avenida General David Sarnoff, 237",
      "referencia": "Estamparia Sentido Barreiro",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 68,
      "endereco": "Avenida General David Sarnoff, 5547",
      "referencia": "Antes Do Viaduto",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 69,
      "endereco": "Avenida Tito Fulgêncio, 142",
      "referencia": "Inss 1",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 70,
      "endereco": "Avenida Tito Fulgêncio, 306",
      "referencia": "Transit Car",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 71,
      "endereco": "Avenida Tito Fulgêncio 604",
      "referencia": "Depois Do Villefort",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 72,
      "endereco": "Avenida Tito Fulgêncio, 860",
      "referencia": "Industrial Tintas",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 73,
      "endereco": "Avenida Tito Fulgêncio 1134",
      "referencia": "Ótica Sete (Próximo Ao Hospital Santa Rita)",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 74,
      "endereco": "Avenida Olinto Meireles, 304",
      "referencia": "Unimed/Flaviokar Veículos/Fazendinha Do Barreiro",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 75,
      "endereco": "Avenida Sinfrônio Brochado, 196",
      "referencia": "Lanchonete Pastelouco",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 76,
      "endereco": "Avenida Visconde De Ibituruna, 94",
      "referencia": "Magazine Luiza",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 77,
      "endereco": "Avenida Afonso Vaz De Melo, 250",
      "referencia": "Stepanie Colchões",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 78,
      "endereco": "Avenida Afonso Vaz De Melo, 460",
      "referencia": "Via Shopping Antes Da Passarela",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 79,
      "endereco": "Av. Afonso Vaz De Melo, 1000",
      "referencia": "Praça Cristo Reina",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 80,
      "endereco": "Avenida Afonso Vaz De Melo, 1256",
      "referencia": "Puc Minas Campus Barreiro",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 81,
      "endereco": "Av. Afonso Vaz De Melo, 1730",
      "referencia": "Villefort Atacadista",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 82,
      "endereco": "Av. Do Canal, 53",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 83,
      "endereco": "Av. Do Canal, 313",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 84,
      "endereco": "Rua Antonio Eustaquio Piazza 2514",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 85,
      "endereco": "Rua Antônio Eustáquio Piazza, 2240",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 86,
      "endereco": "Rua Braulio Gomes Nogueira 59",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 87,
      "endereco": "Rua Caetano De Vasconcelos, 120",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 88,
      "endereco": "Rua Antônio Eustáquio Piazza, 3242",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 89,
      "endereco": "Rua Antônio Eustáquio Piazza, 3482",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 90,
      "endereco": "Rua Antônio Eustáquio Piazza 3744",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 91,
      "endereco": "Rua Antônio Eustáquio Piazza, 4020",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 92,
      "endereco": "Rua Lupércio Paixão, 226",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 93,
      "endereco": "Av. Nélio Cerqueira, 1800",
      "referencia": "Depósito Portela, Auto Escola Ciganos",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 94,
      "endereco": "Rua Júlio Mesquita, 178",
      "referencia": "Supermercado Dia",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 95,
      "endereco": "Rua Júlio De Mesquita, 273",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 96,
      "endereco": "Rua Júlio De Mesquita, 143",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 97,
      "endereco": "Av. Noraldino Lima, 20",
      "referencia": "Trevo De Ibirité Sentido Ibirité/Contagem",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 98,
      "endereco": "Av. Pinheiros, 200",
      "referencia": "Oposto A Auto Escola Ciganos Sentido Centro De Ibirité",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 99,
      "endereco": "Av. Pinheiros, 590",
      "referencia": "Renascer Colchões E Móveis",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 100,
      "endereco": "Avenida Pinheiros 780",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 101,
      "endereco": "Av. Pinheiros, 1140",
      "referencia": "Escola Vila Ideal Serra Dourada",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 102,
      "endereco": "Rodovia Renato Brandão Azeredo 1440",
      "referencia": "",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 103,
      "endereco": "Av. Pinheiros, 1700",
      "referencia": "Entrada Para O Serra Dourada",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    },
    {
      "ordem": 104,
      "endereco": "Terminal Ibirité",
      "referencia": "Só Desembarque (Encerrando Viagem)",
      "sentido": "volta",
      "latitude": null,
      "longitude": null,
      "status_coordenada": "pendente de geocodificacao"
    }
  ],
 


};
