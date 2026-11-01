
window.linesDatabase = window.linesDatabase || {};

window.linesDatabase["3450"] = {
    nome: "3450 - Bosque",

    pontos: [
        { id: "K3aA0", nome: "Terminal Ibirité - Alimentadoras", coords: [-44.06599, -20.017567] },
        { id: "YOwN4", nome: "Próximo à UPA/Maternidade de Ibirité", coords: [-44.067492, -20.017527] },
        { id: "6lMZL", nome: "Prefeitura de Ibirité - Sentido Centro", coords: [-44.065701, -20.020613] },
        { id: "mXqwb", nome: "Rua Artur Campos, 501", coords: [-44.062235, -20.022646] },
        { id: "5Nj26", nome: "Av. Otacílio Negrão de Lima, 395", coords: [-44.059521, -20.02398] },
        { id: "yhJiP", nome: "Av. Otacílio Negrão de Lima, 259", coords: [-44.05877, -20.025188] },
        { id: "OHLUv", nome: "Av. Otacílio Negrão de Lima, 35 - Fórum", coords: [-44.05818, -20.027543] },
        { id: "R3h4U", nome: "Rua Freitas de Oliveira, 234 - Djeane Casa & Construção", coords: [-44.057815, -20.029055] },
        { id: "5yi4O", nome: "Rua Freitas de Oliveira, 312 - Megablitz", coords: [-44.057482, -20.029706] },
        { id: "jaR9k", nome: "Rua José Marques de Aquino, 105", coords: [-44.055991, -20.03031] },
        { id: "fmZfM", nome: "Rua Pedro Aleixo Rodrigues, 64", coords: [-44.055498, -20.029256] },
        { id: "GDfoB", nome: "Rua Santa Luzia, 132", coords: [-44.055004, -20.029413] },
        { id: "aZVEq", nome: "Rua Pedro José dos Anjos, 388", coords: [-44.054457, -20.030603] },
        { id: "opkVT", nome: "Rua Juciliano Narciso Campos, 730", coords: [-44.053802, -20.031701] },
        { id: "KMiDC", nome: "Rua Juciliano Narciso Campos, 372", coords: [-44.050198, -20.034295] },
        { id: "hqm1E", nome: "Rua Juciliano Narciso Campos, 1100", coords: [-44.05082, -20.036048] },
        { id: "1XTkh", nome: "Rua Juciliano Narciso Campos, 1276", coords: [-44.049146, -20.038608] },
        { id: "VdE1h", nome: "Rua Juciliano Narciso Campos, 1498", coords: [-44.047408, -20.039676] },
        { id: "QLo4H", nome: "Rua Gislaine Freitas de Araújo, 497", coords: [-44.046013, -20.039434] },
        { id: "fpXE6", nome: "Av. Alice Rodrigues de Carvalho, 899", coords: [-44.045777, -20.038185] },
        { id: "CtsZB", nome: "Av. Alice Rodrigues de Carvalho, 742", coords: [-44.047601, -20.036189] },
        { id: "iMjoW", nome: "Av. Alice Rodrigues de Carvalho, 633", coords: [-44.049683, -20.034134] },
        { id: "FsO6I", nome: "Av. Alice Rodrigues de Carvalho, 459", coords: [-44.054039, -20.031013] },
        { id: "wSgZC", nome: "Av. Alice Rodrigues de Carvalho, 275", coords: [-44.055026, -20.028826] },
        { id: "dvcFv", nome: "Rua Juciliano Narciso Campos, 925", coords: [-44.05612, -20.029663] },
        { id: "ORd4L", nome: "Rua Juciliano Narciso Campos, 733", coords: [-44.057204, -20.02925] },
        { id: "IRFyx", nome: "Rua Pedro José dos Anjos, 437", coords: [-44.057955, -20.030509] },
        { id: "sxlsM", nome: "Rua Santa Luzia, 125", coords: [-44.057815, -20.031547] },
        { id: "ws8M0", nome: "Rua Pedro Aleixo Rodrigues, 65", coords: [-44.057858, -20.032303] },
        { id: "KDqnx", nome: "Rua Jorge Marques de Aquino, 133", coords: [-44.058931, -20.030731] },
        { id: "nWiAR", nome: "Av. Mauro Nunes Moreira, 925", coords: [-44.059671, -20.028766] },
        { id: "yhDCi", nome: "Av. Mauro Nunes Moreira, 501 - Oposto ao Velório Municipal", coords: [-44.06142, -20.026329] },
        { id: "p4XP3", nome: "Rua Maria do Rosário, 151 - Sindicato dos Trabalhadores Rurais", coords: [-44.059403, -20.024625] },
        { id: "RTDRa", nome: "Av. Otacílio Negrão de Lima, 30 - Fórum de Ibirité", coords: [-44.059221, -20.023757] },
        { id: "lJDNd", nome: "Rua Artur Campos, 146 - Estação Ferroviária", coords: [-44.061903, -20.021672] },
        { id: "YQewH", nome: "Rua Artur Campos, 400", coords: [-44.065379, -20.020149] },
        { id: "eGsoD", nome: "Prefeitura de Ibirité - Sentido Terminal", coords: [-44.066269, -20.017287] }
    ],

    trajeto: []
};

// Gerar trajeto utilizando as coordenadas originais.
window.linesDatabase["3450"].trajeto =
    window.linesDatabase["3450"].pontos.map(ponto => [
        ponto.coords[0],
        ponto.coords[1]
    ]);



