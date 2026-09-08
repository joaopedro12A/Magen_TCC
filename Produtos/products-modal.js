/* =========================================================================
   MAGEN — Pop-up "Ver Detalhes" da página de Produtos
   Cada produto tem uma descrição, uma lista de componentes/especificações
   e (exceto o YESOD) uma aba com lojas recomendadas para comprar o item.
   ========================================================================= */

const PRODUCTS = {
  "yesod": {
    name: "YESOD",
    price: "R$2000 · Kit com 3 unidades",
    image: "./YESOD.png",
    description:
      "Kit YESOD: o conjunto principal do sistema MAGEN, reunindo três unidades sensoras prontas para instalação em pontos estratégicos da estrutura monitorada. Cada unidade concentra a captação de vibração, deformação e inclinação, enviando os dados em tempo real para o painel central de análise.",
    components: [
      "3 unidades sensoras completas, já calibradas de fábrica",
      "Módulo de comunicação sem fio integrado para envio dos dados",
      "Case resistente para instalação em ambientes de obra",
      "Cabo de alimentação e guia rápido de instalação"
    ],
    stores: null // produto próprio do projeto — não recomendamos lojas externas
  },
  "esp32": {
    name: "ESP32",
    price: "$0.00",
    image: "./ESP.png",
    description:
      "Microcontrolador com Wi-Fi e Bluetooth integrados, responsável por coletar as leituras dos sensores e transmiti-las ao painel do MAGEN. É o cérebro de comunicação de cada unidade sensora, escolhido pelo baixo custo e pelo bom desempenho em aplicações de IoT.",
    components: [
      "Processador dual-core de até 240 MHz",
      "Wi-Fi 802.11 b/g/n e Bluetooth 4.2 (Classic + BLE)",
      "Diversas GPIOs para conexão de sensores analógicos e digitais",
      "Baixo consumo de energia, ideal para uso contínuo em campo"
    ],
    stores: [
      { name: "FilipeFlop", note: "Boa variedade de kits ESP32 e frete rápido", url: "https://www.filipeflop.com" },
      { name: "Eletrogate", note: "Preço competitivo em módulos avulsos", url: "https://www.eletrogate.com" },
      { name: "Curto Circuito", note: "Opção com suporte técnico em português", url: "https://www.curtocircuito.com.br" }
    ]
  },
  "mpu6050": {
    name: "MPU6030",
    price: "$0.00",
    image: "./MPU.png",
    description:
      "Sensor inercial de 6 eixos (acelerômetro + giroscópio) usado para captar vibração e microdeformações da estrutura. É um dos principais responsáveis pela detecção precoce de fissuras no sistema MAGEN, comparando as leituras com as faixas normais de operação.",
    components: [
      "Acelerômetro de 3 eixos + giroscópio de 3 eixos",
      "Comunicação via barramento I2C",
      "Sensor de temperatura embutido para compensação de leitura",
      "Alta sensibilidade, ideal para detectar pequenas vibrações"
    ],
    stores: [
      { name: "Robocore", note: "Módulo com boa documentação técnica", url: "https://www.robocore.net" },
      { name: "Eletrogate", note: "Costuma ter o menor preço por unidade", url: "https://www.eletrogate.com" },
      { name: "Mercado Livre", note: "Bom para comparar vendedores e prazos", url: "https://www.mercadolivre.com.br" }
    ]
  },
  "arduino-uno": {
    name: "Arduino UNO",
    price: "$0.00",
    image: "./Arduino uno.png",
    description:
      "Placa de prototipagem baseada no microcontrolador ATmega328P, utilizada nos testes e na validação inicial dos sensores antes da integração com o ESP32. Sua ampla comunidade e documentação facilitam a etapa de desenvolvimento do projeto.",
    components: [
      "Microcontrolador ATmega328P, 16 MHz",
      "14 pinos digitais e 6 entradas analógicas",
      "Alimentação via USB ou fonte externa (7–12V)",
      "Compatível com a IDE Arduino e grande variedade de shields"
    ],
    stores: [
      { name: "FilipeFlop", note: "Placas originais e clones com boa procedência", url: "https://www.filipeflop.com" },
      { name: "Curto Circuito", note: "Kits completos para quem está começando", url: "https://www.curtocircuito.com.br" },
      { name: "Mercado Livre", note: "Boa opção para comparar preços rapidamente", url: "https://www.mercadolivre.com.br" }
    ]
  }
};

(function () {
  const overlay = document.getElementById("productModalOverlay");
  if (!overlay) return;

  const imgEl = document.getElementById("productModalImg");
  const titleEl = document.getElementById("productModalTitle");
  const priceEl = document.getElementById("productModalPrice");
  const descEl = document.getElementById("productModalDesc");
  const compWrapEl = document.getElementById("productModalCompWrap");
  const compListEl = document.getElementById("productModalComp");
  const storesEl = document.getElementById("productModalStores");
  const tabsWrap = document.getElementById("productModalTabs");
  const closeBtn = document.getElementById("productModalClose");
  const panels = overlay.querySelectorAll(".product-modal-panel");
  const tabs = overlay.querySelectorAll(".product-modal-tab");

  function setTab(name) {
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
    panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === name));
  }

  function openModal(key) {
    const product = PRODUCTS[key];
    if (!product) return;

    imgEl.src = product.image;
    imgEl.alt = product.name;
    titleEl.textContent = product.name;
    priceEl.textContent = product.price || "";
    descEl.textContent = product.description;

    compListEl.innerHTML = "";
    if (product.components && product.components.length) {
      compWrapEl.style.display = "";
      product.components.forEach((c) => {
        const div = document.createElement("div");
        div.className = "product-modal-comp-item";
        div.textContent = c;
        compListEl.appendChild(div);
      });
    } else {
      compWrapEl.style.display = "none";
    }

    // Aba "Onde Comprar": disponível para todos os produtos, exceto o YESOD
    // (kit próprio do projeto — não faz sentido recomendar loja externa).
    const storesTabBtn = tabsWrap.querySelector('[data-tab="stores"]');
    storesEl.innerHTML = "";
    if (product.stores && product.stores.length) {
      storesTabBtn.style.display = "";
      product.stores.forEach((s) => {
        const row = document.createElement("div");
        row.className = "store-item";
        row.innerHTML =
          '<div><div class="store-item-name">' + s.name + '</div>' +
          '<div class="store-item-note">' + s.note + '</div></div>' +
          '<a class="store-item-link" href="' + s.url + '" target="_blank" rel="noopener">Visitar loja →</a>';
        storesEl.appendChild(row);
      });
    } else {
      storesTabBtn.style.display = "none";
      storesEl.innerHTML = '<p class="store-empty">O YESOD é o kit próprio do projeto MAGEN — não há loja externa recomendada para ele.</p>';
    }

    setTab("desc");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-product-trigger]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(el.getAttribute("data-product-trigger"));
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setTab(tab.dataset.tab));
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
})();
