// Trabalhos de cada diretor na aba /diretores — gerado a partir do canal
// público de Vimeo de cada um (API v2 do Vimeo, os 15 mais recentes).
// É ponto de partida para curadoria: edite marca/título, apague o que não
// deve aparecer, reordene. O primeiro item é o primeiro da grade.
//
// `reel` foi identificado pelo título do vídeo ("reel", "showreel") —
// confirme com cada diretor.

export type ObraVimeo = { id: string; marca: string; titulo: string; thumb: string }
export type CanalDiretor = { canal: string; reel: { vimeo: string; thumb: string } | null; obras: ObraVimeo[] }

export const obrasVimeo: Record<string, CanalDiretor> = {
  "bia-flecha": {
    "canal": "https://vimeo.com/biaflecha",
    "reel": null,
    "obras": [
      {
        "id": "1231006038",
        "marca": "rio bar brasil",
        "titulo": "carla",
        "thumb": "https://i.vimeocdn.com/video/2206061676-be1d943143f5b27594fa078250715ecbf9804222163f3c760e8e209758bb749a-d_1280?region=us"
      },
      {
        "id": "1231002868",
        "marca": "3,2,1 ... caipirinha de uva, limão siciliano e manjericão",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2206058210-8e47b89648029f70ae0159f3a296d1b28ef9e9699f693e47d60b20b82c7353c6-d_1280?region=us"
      },
      {
        "id": "1230040797",
        "marca": "hyundai signos",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2204852207-8b8573770cda6d05963d2354c7e32ba8cb2038dcb10f687fd94ff15d95f79cbb-d_1280?region=us"
      },
      {
        "id": "1230040256",
        "marca": "hyundai features",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2204850618-c8b6d924d313ccbac5ffff85f120d9505b7af646cba8f1e58e4aa3ab4f91d552-d_1280?region=us"
      },
      {
        "id": "1230039095",
        "marca": "hyundai central multimídia",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2204849098-1f74d5b9382e49d64656549ab1a29c40911f02f9e9b61150aa00d6eb3627f9da-d_1280?region=us"
      },
      {
        "id": "1227451528",
        "marca": "apex tarifaço",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2201674337-83cfac36fb2391d874934fe881b30f07c393cfe757a6533c6e7e017648f0f022-d_1280?region=us"
      },
      {
        "id": "1161892962",
        "marca": "continental \"narração \"",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2117463744-fdf48fa5a5b4f8c7e874cb96b3dad0c931ceca33c84dc1ab295e3378f04ab6ac-d_1280?region=us"
      },
      {
        "id": "1129314833",
        "marca": "outubro rosa",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2072662091-720aefb36ffe9f01178399a968445155783efcdcd427b09fd8a4723ec0b59761-d_1280?region=us"
      },
      {
        "id": "1117578544",
        "marca": "intelbras restaurante",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2057540565-c1907ac7a129da50357f23706a066a047f19a4761fd8ab069257e259bb9a582f-d_1280?region=us"
      },
      {
        "id": "1117578497",
        "marca": "intelbras empresarial",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2057540027-d614a3fbd57b929f6b8b7c8ea0efce4ed69f9e6912bed5096586920a4d7c61d0-d_1280?region=us"
      },
      {
        "id": "1117576122",
        "marca": "intelbras residencial",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2057586491-fbac64df98faf40fb700715207ca56503355760d0ff921e246a1da002eeee541-d_1280?region=us"
      },
      {
        "id": "1068156667",
        "marca": "feira",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1996222724-679b72f2cca1d20ea7e500302c5c341633cc9e2435a058b5d6faf17aaecbfdca-d_1280?region=us"
      },
      {
        "id": "1057967696",
        "marca": "ademicon",
        "titulo": "veículos",
        "thumb": "https://i.vimeocdn.com/video/1984031570-c9a75d8d133ec3dca011d123df0450c5cd86cb0fb4facd6def472dcad2068eea-d_1280?region=us"
      },
      {
        "id": "1057960796",
        "marca": "ademicon",
        "titulo": "serviços",
        "thumb": "https://i.vimeocdn.com/video/1984019847-ed25aa0e27b12611ae2b74bedd0e3c516c39b2df7248f26ab3c036aad26452b3-d_1280?region=us"
      },
      {
        "id": "1057944661",
        "marca": "ademicon",
        "titulo": "investimentos",
        "thumb": "https://i.vimeocdn.com/video/1984013778-2429a81689fc0a14d97d6e5d2db8fd5b3f4dd01d5769b04d3e4ae65428ed9073-d_1280?region=us"
      }
    ]
  },
  "john-porciuncula": {
    "canal": "https://vimeo.com/johnporciuncula",
    "reel": {
      "vimeo": "1205887503",
      "thumb": "https://i.vimeocdn.com/video/2174587011-f448b37f611ceecc48c2cfa4b81df13758aaea993ae5319f935adccc61c1cfa3-d_1280?region=us"
    },
    "obras": [
      {
        "id": "1211022214",
        "marca": "brasilidades pará",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2182798896-7ce8f7431d1ed84e4859a88bf708f374aaab90625cff5458dafe72da7fcffe7e-d_1280?region=us"
      },
      {
        "id": "1205902883",
        "marca": "metro",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2174605011-7ac80d8ac0b1a1524de3eb81d9bcb8df2a1a346336a24f97280b66bcae410be9-d_1280?region=us"
      },
      {
        "id": "1202625668",
        "marca": "kia lista",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2170378185-c8cd61e7891f066f21c92e0b242645e5c4e12e511a9a4e9d92e253e5d5916a6e-d_1280?region=us"
      },
      {
        "id": "1113676836",
        "marca": "ela, por joão suplicy e coral",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2052230588-d8cea4c6888def47876a2775aaf1f55c9eaa93349a80214d4071d5dc03cf8645-d_1280?region=us"
      },
      {
        "id": "1091221025",
        "marca": "brasilidades",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2024006339-e96b49d2b7d8a445e657bab74bf67fb422425788ccd2721e60f5f631867219ba-d_1280?region=us"
      },
      {
        "id": "1090920090",
        "marca": "chicken parm",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2023633921-19b321435835093499191896d30174a12c2dc47bb78053cebf9c4518ad017bc4-d_1280?region=us"
      },
      {
        "id": "1026153329",
        "marca": "tempo",
        "titulo": "campanha",
        "thumb": "https://i.vimeocdn.com/video/1945879574-e7225e4f29fcdc5112409fd3ee4b82d3bbe675808d5640f08a0ecf3a6f011d90-d_1280?region=us"
      },
      {
        "id": "1026149820",
        "marca": "pense bem campanha",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1945877883-5f5ed825307f629f2ac9ffde331a9e8ed37e3857425d5c2e064032826ec94381-d_1280?region=us"
      },
      {
        "id": "1026146814",
        "marca": "aniversário sao luis",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1945871551-0a7fff402c693f47734a2d3759f9a90677da107291aabc850e93adb8baf3e670-d_1280?region=us"
      },
      {
        "id": "1026140273",
        "marca": "filme luz",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1945863861-fd01c320e57ff39cc152b69a150bdf99fe455efd1c14d32cb519f471d5b3703b-d_1280?region=us"
      },
      {
        "id": "990587583",
        "marca": "cbday",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1906379933-43cae58d02242fa8396b5b39e9c3713ad53ad848b0831131d871702aa172a00f-d_1280?region=us"
      },
      {
        "id": "990157807",
        "marca": "ftd",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1905915356-9602841d23d6cac31ecfa03ffc6a8ee13e8f9131657e30d44f1fb2e72b7b548e-d_1280?region=us"
      },
      {
        "id": "990155518",
        "marca": "descontraida shopping allos",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1905912858-3af8b3fb1e6b086e8c954ffec09c7cf71c99f614e1587582316e0d951ecaac01-d_1280?region=us"
      },
      {
        "id": "990155061",
        "marca": "ftd 30",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1905912323-30471b2e9a2c8e56da5b8470b6b23752d79c807a3c1f7843bc1a46c79a97b6f9-d_1280?region=us"
      },
      {
        "id": "954393154",
        "marca": "longa documentario \"josue\"",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1865232665-42810ff6a01e470a3422aa39844fbaba99c183984cd928aa2fc8a6e0076ebd00-d_1280?region=us"
      }
    ]
  },
  "raoni-rodrigues": {
    "canal": "https://vimeo.com/raonir",
    "reel": {
      "vimeo": "958557276",
      "thumb": "https://i.vimeocdn.com/video/1870689649-2b06826f82692df4261249359abb4e2cb7ade8bedf5d430c30b045ef550f1b73-d_1280?region=us"
    },
    "obras": [
      {
        "id": "1088442957",
        "marca": "plan international brasil",
        "titulo": "saúde no rolê convida andréia coutinho - mudanças climáticas",
        "thumb": "https://i.vimeocdn.com/video/2020670335-b2b1d79813fc127259eb4ee4a0c5aeae35ed18c1b174f49bea1388a5ffa263ce-d_1280?region=us"
      },
      {
        "id": "1088423637",
        "marca": "elefante 90s",
        "titulo": "extrato de tomate - descoberta 2024",
        "thumb": "https://i.vimeocdn.com/video/2020645656-eb0c788731ecbe68af524b3ca51cc7c6f646eae7b961b6a9fd688623b0d3cb8c-d_1280?region=us"
      },
      {
        "id": "1088420100",
        "marca": "loterias caixa",
        "titulo": "hahaha 2025",
        "thumb": "https://i.vimeocdn.com/video/2020640882-d3a7b3c9433ab1470c383590e4928837dc619f5d0dd127ad24d6f7bdc047f804-d_1280?region=us"
      },
      {
        "id": "1021275931",
        "marca": "clicksign",
        "titulo": "o click que muda sua vida",
        "thumb": "https://i.vimeocdn.com/video/1940008748-3f57e549b2cc649fa1105aa1bb25e54bb9a31c57e9afc547e63edb47ea9e89f6-d_1280?region=us"
      },
      {
        "id": "1019601373",
        "marca": "cdhu novo casa paulista",
        "titulo": "habitometro v60 para arquivo mosca-leg-libras",
        "thumb": "https://i.vimeocdn.com/video/1938892757-9e511a50e5279bf5a78498820f96c020b0584ed8db11c6eda5aa1c236e8d37ef-d_1280?region=us"
      },
      {
        "id": "1019550842",
        "marca": "elefante 30s",
        "titulo": "extrato de tomate - descoberta 2024",
        "thumb": "https://i.vimeocdn.com/video/1937950578-213d6b04a0528293811e51af716beedab4bcc4a01121af063bf73cf1995b43ba-d_1280?region=us"
      },
      {
        "id": "1018019225",
        "marca": "passagrana",
        "titulo": "disney e intro pictures - trailer",
        "thumb": "https://i.vimeocdn.com/video/2020638492-e4b3612661c33fbe449be16e46937bc771403475ee8a32f6846bc6bb9cc125ec-d_1280?region=us"
      },
      {
        "id": "1017957428",
        "marca": "cdhu",
        "titulo": "regularização 2024",
        "thumb": "https://i.vimeocdn.com/video/1936987102-13f0eee96d77394fdac04a67c3451ff7811520b3540d934695ec52326e5997a4-d_1280?region=us"
      },
      {
        "id": "1017945917",
        "marca": "sebraefe24 isabela penteado",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1936045816-910148635ca171f75a4a6a48131409b250d0da52ac9314d595462b1fe2614555-d_1280?region=us"
      },
      {
        "id": "1017945885",
        "marca": "sebraefe24 helena horta",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1936045210-50b7d2329fbeeb12ddb1b1a3e1ae417abff5662f06ce64d476d66330f2f3b160-d_1280?region=us"
      },
      {
        "id": "1017945849",
        "marca": "sebraefe24 arlindo salgado",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1936044415-6c6aa0f4519654f056249d914830d9a135f142d0516882291c84364090dc1334-d_1280?region=us"
      },
      {
        "id": "942348593",
        "marca": "clicksign",
        "titulo": "goomer",
        "thumb": "https://i.vimeocdn.com/video/1944787745-8d0c4ce8d3950191559a088a6c21d9fa8ab25128fd1b74e8fd8e69392cd818c1-d_1280?region=us"
      },
      {
        "id": "914595917",
        "marca": "provão paulista",
        "titulo": "seduc",
        "thumb": "https://i.vimeocdn.com/video/1801205978-51787d7db73ff7e7af6a2cfe1fde4d1faf42fa6d20873dfcc86b2266888bb406-d_1280?region=us"
      },
      {
        "id": "870815907",
        "marca": "kitchen",
        "titulo": "jardim",
        "thumb": "https://i.vimeocdn.com/video/1937375346-54c800458fdb8aa9776c2fb510c7b9837deff37a024b2544d0d655a13ffdbe75-d_1280?region=us"
      },
      {
        "id": "870815534",
        "marca": "kitchen",
        "titulo": "home office",
        "thumb": "https://i.vimeocdn.com/video/1733040277-261d44d942960e2f4a01c0bd314878aca25094a4905e2138560cdbf06f5e157a-d_1280?region=us"
      }
    ]
  },
  "diego-lisboa": {
    "canal": "https://vimeo.com/daigodili",
    "reel": {
      "vimeo": "979343881",
      "thumb": "https://i.vimeocdn.com/video/1926131416-3cf80ce90a89fa4de63c89032e4c1b61b78f8ec39d5dab208fd8e3da2e50a970-d_1280?region=us"
    },
    "obras": [
      {
        "id": "1123586027",
        "marca": "memoria curta",
        "titulo": "cinema político",
        "thumb": "https://i.vimeocdn.com/video/2065240481-53d84ba1af475bb252da6ace16fa92397c53fe5e65fe13531c8433b13f81a6f6-d_1280?region=us"
      },
      {
        "id": "1120172427",
        "marca": "filme governo da bahia",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/2060855319-ebce1cf1d928a21622b94640d624e31852db560b12e0bf1f141b1c33b993d1bc-d_1280?region=us"
      },
      {
        "id": "1006695526",
        "marca": "embratur europa",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1926126966-967644f54d8c388afd931dd5c80944ae3e17a74468995ecab0e70baf68809bfb-d_1280?region=us"
      },
      {
        "id": "1006608110",
        "marca": "embratur amazonia",
        "titulo": "",
        "thumb": "https://i.vimeocdn.com/video/1923345805-00dac05790fb3f7801b234e3e1b9217e6c94354975e382bdec2e8ec3e55785d6-d_1280?region=us"
      },
      {
        "id": "941408985",
        "marca": "ode",
        "titulo": "cinema",
        "thumb": "https://i.vimeocdn.com/video/1926129829-35969c34b57b38af4a31d7d4534c219bf8fe43af36ac2acaea2d38dc82612a65-d_1280?region=us"
      },
      {
        "id": "941403838",
        "marca": "filme banco do brasil. ep 1",
        "titulo": "serie",
        "thumb": "https://i.vimeocdn.com/video/1926131086-296943be06100fa5ca7b1c02def085cc27c7f737f2763836aee8d3ccab7722de-d_1280?region=us"
      },
      {
        "id": "916882293",
        "marca": "encantados film",
        "titulo": "experimental",
        "thumb": "https://i.vimeocdn.com/video/1804911168-891afaaf65b1e2dbd861b7dc2613530806a94f43ba6117ee0dc6d323999ea1f9-d_1280?region=us"
      },
      {
        "id": "893069981",
        "marca": "mae gentil",
        "titulo": "gov fed - publicidade",
        "thumb": "https://i.vimeocdn.com/video/1926130099-d815f01df733bd54d9444ca6316f393ca6e6dcd386edb3755d287a33e1c0c678-d_1280?region=us"
      }
    ]
  }
}
