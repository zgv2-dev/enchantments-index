/*
 * Anvil order optimizer UI.
 * Algorithm adapted from iamcal/enchant-order (https://github.com/iamcal/enchant-order)
 * Copyright (c) 2021 Cal Henderson, MIT License.
 * See assets/enchant-order-LICENSE.txt.
 */
(() => {
  const OD = window.ORDER_DATA;
  const ENCH_BY_ID = Object.fromEntries(ENCHANTMENTS.map(enchantment => [enchantment.id, enchantment]));

  const SCOPED_CATEGORIES = new Set(["armor", "weapons", "tools", "ranged", "trident", "fishing"]);

  const ITEM_KEYS = {
    helmet: "Helmet",
    chestplate: "Chestplate",
    leggings: "Leggings",
    boots: "Boots",
    turtle_shell: "Turtle shell",
    elytra: "Elytra",
    sword: "Sword",
    axe: "Axe",
    mace: "Mace",
    spear: "Spear",
    trident: "Trident",
    bow: "Bow",
    crossbow: "Crossbow",
    pickaxe: "Pickaxe",
    shovel: "Shovel",
    hoe: "Hoe",
    fishing_rod: "Fishing rod",
    shears: "Shears"
  };

  const EXTRA_ITEM_LABELS = {
    shield: { en: "Shield", de: "Schild", fr: "Bouclier", it: "Scudo", es: "Escudo", uk: "Щит", zhCn: "盾牌", zhTw: "盾牌", ja: "盾" },
    brush: { en: "Brush", de: "Pinsel", fr: "Pinceau", it: "Pennello", es: "Pincel", uk: "Пензель", zhCn: "刷子", zhTw: "刷子", ja: "ブラシ" },
    flint_and_steel: { en: "Flint and Steel", de: "Feuerzeug", fr: "Briquet", it: "Acciarino", es: "Mechero", uk: "Кресало", zhCn: "打火石", zhTw: "打火石", ja: "火打ち石と打ち金" },
    carrot_on_a_stick: { en: "Carrot on a Stick", de: "Karottenrute", fr: "Carotte sur un bâton", it: "Carota su un bastone", es: "Zanahoria en un palo", uk: "Морква на палиці", zhCn: "胡萝卜钓竿", zhTw: "胡蘿蔔釣竿", ja: "ニンジン付きの棒" },
    warped_fungus_on_a_stick: { en: "Warped Fungus on a Stick", de: "Wirrpilzrute", fr: "Champignon biscornu sur un bâton", it: "Fungo distorto su un bastone", es: "Hongo distorsionado en un palo", uk: "Химерний гриб на палиці", zhCn: "诡异菌钓竿", zhTw: "詭異菌釣竿", ja: "歪んだキノコ付きの棒" },
    pumpkin: { en: "Pumpkin", de: "Kürbis", fr: "Citrouille", it: "Zucca", es: "Calabaza", uk: "Гарбуз", zhCn: "南瓜", zhTw: "南瓜", ja: "カボチャ" },
    book: { en: "Book", de: "Buch", fr: "Livre", it: "Libro", es: "Libro", uk: "Книга", zhCn: "书", zhTw: "書", ja: "本" }
  };

  const ORDER_UI = {
    en: {
      open: "Order optimizer", title: "Enchantment order optimizer", kicker: "Anvil planner",
      intro: "Plan the cheapest order for combining enchanted books and applying them to your gear at an anvil.",
      item: "Item", chooseItem: "Choose an item", enchantments: "Enchantments", level: "Level",
      allowIncompatible: "Allow incompatible enchantments", optimize: "Optimize for",
      modeLevels: "Least XP/levels", modePrior: "Least prior work penalty",
      calculate: "Calculate", calculating: "Calculating…",
      selectOne: "Select at least one enchantment.", limit: "Up to 10 enchantments",
      placeholder: "Choose an item and enchantments to find the cheapest order.",
      resultTitle: "Optimal order", totalCost: "Total cost", steps: "Steps",
      combine: "Combine", with: "with", cost: "Cost", prior: "Prior work",
      completed: "Completed in", noSolution: "No solution found within the anvil's 39-level limit.",
      alreadyOptimal: "No anvil work needed.", close: "Close", book: "Enchanted book",
      levelOne: "level", levelMany: "levels", xp: "XP",
      source: "Algorithm adapted from iamcal/enchant-order (MIT)."
    },
    de: {
      open: "Reihenfolge planen", title: "Optimierer für Verzauberungsreihenfolge", kicker: "Amboss-Planer",
      intro: "Plane die günstigste Reihenfolge, um verzauberte Bücher zu kombinieren und sie am Amboss auf deine Ausrüstung anzuwenden.",
      item: "Gegenstand", chooseItem: "Wähle einen Gegenstand", enchantments: "Verzauberungen", level: "Stufe",
      allowIncompatible: "Inkompatible Verzauberungen erlauben", optimize: "Optimieren für",
      modeLevels: "Wenigste XP/Stufen", modePrior: "Geringste vorherige Zusatzkosten",
      calculate: "Berechnen", calculating: "Berechnung läuft…",
      selectOne: "Wähle mindestens eine Verzauberung.", limit: "Höchstens 10 Verzauberungen",
      placeholder: "Wähle einen Gegenstand und Verzauberungen, um die günstigste Reihenfolge zu finden.",
      resultTitle: "Optimale Reihenfolge", totalCost: "Gesamtkosten", steps: "Schritte",
      combine: "Kombiniere", with: "mit", cost: "Kosten", prior: "Vorherige Zusatzkosten",
      completed: "Gefunden in", noSolution: "Keine Lösung innerhalb des Ambosslimits von 39 Stufen gefunden.",
      alreadyOptimal: "Keine Ambossarbeit nötig.", close: "Schließen", book: "Verzaubertes Buch",
      levelOne: "Stufe", levelMany: "Stufen", xp: "XP",
      source: "Algorithmus angepasst von iamcal/enchant-order (MIT)."
    },
    fr: {
      open: "Planifier l'ordre", title: "Optimiseur d'ordre d'enchantement", kicker: "Planificateur d'enclume",
      intro: "Planifiez l'ordre le moins coûteux pour combiner des livres enchantés et les appliquer sur votre équipement à l'enclume.",
      item: "Objet", chooseItem: "Choisissez un objet", enchantments: "Enchantements", level: "Niveau",
      allowIncompatible: "Autoriser les enchantements incompatibles", optimize: "Optimiser pour",
      modeLevels: "Le moins de XP/niveaux", modePrior: "Le moins de pénalité de réparations antérieures",
      calculate: "Calculer", calculating: "Calcul en cours…",
      selectOne: "Sélectionnez au moins un enchantement.", limit: "10 enchantements maximum",
      placeholder: "Choisissez un objet et des enchantements pour trouver l'ordre le moins coûteux.",
      resultTitle: "Ordre optimal", totalCost: "Coût total", steps: "Étapes",
      combine: "Combinez", with: "avec", cost: "Coût", prior: "Pénalité de réparations antérieures",
      completed: "Terminé en", noSolution: "Aucune solution trouvée dans la limite de 39 niveaux de l'enclume.",
      alreadyOptimal: "Aucun travail à l'enclume nécessaire.", close: "Fermer", book: "Livre enchanté",
      levelOne: "niveau", levelMany: "niveaux", xp: "XP",
      source: "Algorithme adapté de iamcal/enchant-order (MIT)."
    },
    it: {
      open: "Pianifica l'ordine", title: "Ottimizzatore dell'ordine degli incantesimi", kicker: "Pianificatore dell'incudine",
      intro: "Pianifica l'ordine meno costoso per combinare libri incantati e applicarli alla tua attrezzatura all'incudine.",
      item: "Oggetto", chooseItem: "Scegli un oggetto", enchantments: "Incantesimi", level: "Livello",
      allowIncompatible: "Permetti incantesimi incompatibili", optimize: "Ottimizza per",
      modeLevels: "Meno XP/livelli", modePrior: "Minima penalità per il lavoro precedente",
      calculate: "Calcola", calculating: "Calcolo in corso…",
      selectOne: "Seleziona almeno un incantesimo.", limit: "Massimo 10 incantesimi",
      placeholder: "Scegli un oggetto e gli incantesimi per trovare l'ordine meno costoso.",
      resultTitle: "Ordine ottimale", totalCost: "Costo totale", steps: "Passaggi",
      combine: "Unisci", with: "con", cost: "Costo", prior: "Penalità per il lavoro precedente",
      completed: "Completato in", noSolution: "Nessuna soluzione trovata entro il limite di 39 livelli dell'incudine.",
      alreadyOptimal: "Nessun lavoro all'incudine necessario.", close: "Chiudi", book: "Libro incantato",
      levelOne: "livello", levelMany: "livelli", xp: "XP",
      source: "Algoritmo adattato da iamcal/enchant-order (MIT)."
    },
    es: {
      open: "Planificar orden", title: "Optimizador del orden de encantamientos", kicker: "Planificador de yunque",
      intro: "Planifica el orden más barato para combinar libros encantados y aplicarlos a tu equipo en el yunque.",
      item: "Objeto", chooseItem: "Elige un objeto", enchantments: "Encantamientos", level: "Nivel",
      allowIncompatible: "Permitir encantamientos incompatibles", optimize: "Optimizar para",
      modeLevels: "Menos XP/niveles", modePrior: "Menor penalización de trabajo",
      calculate: "Calcular", calculating: "Calculando…",
      selectOne: "Selecciona al menos un encantamiento.", limit: "Máximo 10 encantamientos",
      placeholder: "Elige un objeto y encantamientos para encontrar el orden más barato.",
      resultTitle: "Orden óptimo", totalCost: "Coste total", steps: "Pasos",
      combine: "Combina", with: "con", cost: "Coste", prior: "Penalización de trabajo",
      completed: "Completado en", noSolution: "No se encontró ninguna solución dentro del límite de 39 niveles del yunque.",
      alreadyOptimal: "No hace falta trabajar en el yunque.", close: "Cerrar", book: "Libro encantado",
      levelOne: "nivel", levelMany: "niveles", xp: "XP",
      source: "Algoritmo adaptado de iamcal/enchant-order (MIT)."
    },
    uk: {
      open: "Порядок зачарувань", title: "Оптимізатор порядку зачарувань", kicker: "Планувальник ковадла",
      intro: "Сплануйте найдешевший порядок поєднання зачарованих книг і застосування їх до спорядження на ковадлі.",
      item: "Предмет", chooseItem: "Виберіть предмет", enchantments: "Зачарування", level: "Рівень",
      allowIncompatible: "Дозволити несумісні зачарування", optimize: "Оптимізувати для",
      modeLevels: "Найменше досвіду/рівнів", modePrior: "Найменший штраф",
      calculate: "Обчислити", calculating: "Обчислення…",
      selectOne: "Виберіть принаймні одне зачарування.", limit: "Не більше 10 зачарувань",
      placeholder: "Виберіть предмет і зачарування, щоб знайти найдешевший порядок.",
      resultTitle: "Оптимальний порядок", totalCost: "Загальна вартість", steps: "Кроки",
      combine: "Поєднайте", with: "із", cost: "Вартість", prior: "Штраф",
      completed: "Завершено за", noSolution: "Рішення не знайдено в межах ліміту ковадла у 39 рівнів.",
      alreadyOptimal: "Робота на ковадлі не потрібна.", close: "Закрити", book: "Зачарована книга",
      levelOne: "рівень", levelMany: "рівнів", xp: "XP",
      source: "Алгоритм адаптовано з iamcal/enchant-order (MIT)."
    },
    zhCn: {
      open: "附魔顺序", title: "附魔顺序优化器", kicker: "铁砧规划器",
      intro: "规划最省经验的附魔书合并与铁砧应用顺序。",
      item: "物品", chooseItem: "选择物品", enchantments: "附魔", level: "等级",
      allowIncompatible: "允许不兼容的附魔", optimize: "优化目标",
      modeLevels: "最少经验/等级", modePrior: "最少累积惩罚",
      calculate: "计算", calculating: "正在计算…",
      selectOne: "请至少选择一个附魔。", limit: "最多10个附魔",
      placeholder: "选择物品和附魔，找出最省成本的顺序。",
      resultTitle: "最佳顺序", totalCost: "总成本", steps: "步骤",
      combine: "组合", with: "与", cost: "成本", prior: "累积惩罚",
      completed: "完成于", noSolution: "在铁砧39级限制内未找到解决方案。",
      alreadyOptimal: "无需在铁砧上操作。", close: "关闭", book: "附魔书",
      levelOne: "级", levelMany: "级", xp: "经验",
      source: "算法改编自 iamcal/enchant-order（MIT）。"
    },
    zhTw: {
      open: "附魔順序", title: "附魔順序最佳化工具", kicker: "鐵砧規劃器",
      intro: "規劃最省經驗的附魔書合併與鐵砧應用順序。",
      item: "物品", chooseItem: "選擇物品", enchantments: "附魔", level: "等級",
      allowIncompatible: "允許不相容的附魔", optimize: "最佳化目標",
      modeLevels: "最少經驗/等級", modePrior: "最少累積懲罰",
      calculate: "計算", calculating: "正在計算…",
      selectOne: "請至少選擇一個附魔。", limit: "最多10個附魔",
      placeholder: "選擇物品和附魔，找出最省成本的順序。",
      resultTitle: "最佳順序", totalCost: "總成本", steps: "步驟",
      combine: "組合", with: "與", cost: "成本", prior: "累積懲罰",
      completed: "完成於", noSolution: "在鐵砧39級限制內找不到解決方案。",
      alreadyOptimal: "無需在鐵砧上操作。", close: "關閉", book: "附魔書",
      levelOne: "級", levelMany: "級", xp: "經驗",
      source: "演算法改編自 iamcal/enchant-order（MIT）。"
    },
    ja: {
      open: "順序を最適化", title: "エンチャント順序オプティマイザー", kicker: "金床プランナー",
      intro: "エンチャントの本を組み合わせ、金床で装備に適用する最も安い順序を計画します。",
      item: "アイテム", chooseItem: "アイテムを選択", enchantments: "エンチャント", level: "レベル",
      allowIncompatible: "競合するエンチャントを許可する", optimize: "最適化基準",
      modeLevels: "経験値/レベルを最小化", modePrior: "累積作業費用を最小化",
      calculate: "計算する", calculating: "計算中…",
      selectOne: "エンチャントを1つ以上選択してください。", limit: "最大10個のエンチャント",
      placeholder: "アイテムとエンチャントを選び、最も安い順序を求めます。",
      resultTitle: "最適な順序", totalCost: "合計コスト", steps: "手順",
      combine: "組み合わせ", with: "と", cost: "コスト", prior: "累積作業費用",
      completed: "所要時間", noSolution: "金床の39レベル制限内に解が見つかりませんでした。",
      alreadyOptimal: "金床での作業は不要です。", close: "閉じる", book: "エンチャントの本",
      levelOne: "レベル", levelMany: "レベル", xp: "XP",
      source: "アルゴリズムは iamcal/enchant-order（MIT）を基にしています。"
    }
  };

  const SCOPE_LABELS = {
    en: "Showing {category} items only.",
    de: "Es werden nur Gegenstände für {category} angezeigt.",
    fr: "Affichage des objets pour {category} uniquement.",
    it: "Mostrando solo oggetti per {category}.",
    es: "Mostrando solo objetos de {category}.",
    uk: "Показано лише предмети для категорії «{category}».",
    zhCn: "仅显示“{category}”物品。",
    zhTw: "僅顯示「{category}」物品。",
    ja: "「{category}」のアイテムのみ表示しています。"
  };
  Object.entries(SCOPE_LABELS).forEach(([language, label]) => {
    if (ORDER_UI[language]) ORDER_UI[language].scope = label;
  });

  const DONE_LABELS = {
    en: "Done", de: "Fertig", fr: "Terminé", it: "Fatto", es: "Listo",
    uk: "Готово", zhCn: "完成", zhTw: "完成", ja: "完了"
  };
  Object.entries(DONE_LABELS).forEach(([language, label]) => {
    if (ORDER_UI[language]) ORDER_UI[language].done = label;
  });

  const GROUP_LABELS = {
    en: { groupChoose: "Incompatible — choose one", groupAllowed: "Incompatible — multiple allowed" },
    de: { groupChoose: "Inkompatibel – wähle eines", groupAllowed: "Inkompatibel – mehrere erlaubt" },
    fr: { groupChoose: "Incompatibles – choisissez-en un", groupAllowed: "Incompatibles – plusieurs autorisés" },
    it: { groupChoose: "Incompatibili – scegline uno", groupAllowed: "Incompatibili – più di uno consentito" },
    es: { groupChoose: "Incompatibles: elige uno", groupAllowed: "Incompatibles: varios permitidos" },
    uk: { groupChoose: "Несумісні — виберіть одне", groupAllowed: "Несумісні — дозволено кілька" },
    zhCn: { groupChoose: "不兼容——只能选一个", groupAllowed: "不兼容——允许多选" },
    zhTw: { groupChoose: "不相容——只能選一個", groupAllowed: "不相容——允許多選" },
    ja: { groupChoose: "競合 — 1つ選択", groupAllowed: "競合 — 複数選択可" }
  };
  Object.entries(GROUP_LABELS).forEach(([language, labels]) => {
    if (ORDER_UI[language]) Object.assign(ORDER_UI[language], labels);
  });

  const els = {
    open: document.getElementById("order-open"),
    openLabel: document.getElementById("order-open-label"),
    dialog: document.getElementById("order-dialog"),
    close: document.getElementById("order-close"),
    kicker: document.getElementById("order-kicker"),
    title: document.getElementById("order-title"),
    intro: document.getElementById("order-intro"),
    scope: document.getElementById("order-scope"),
    form: document.getElementById("order-form"),
    item: document.getElementById("order-item"),
    itemLabel: document.getElementById("order-item-label"),
    allow: document.getElementById("order-allow-incompatible"),
    allowLabel: document.getElementById("order-allow-label"),
    modeLabel: document.getElementById("order-mode-label"),
    modeLevels: document.getElementById("order-mode-levels-label"),
    modePrior: document.getElementById("order-mode-prior-label"),
    enchantLabel: document.getElementById("order-enchants-label"),
    limit: document.getElementById("order-limit"),
    enchants: document.getElementById("order-enchants"),
    calculate: document.getElementById("order-calculate"),
    calculateLabel: document.getElementById("order-calculate-label"),
    calculateCheck: document.getElementById("order-calculate-check"),
    notice: document.getElementById("order-notice"),
    result: document.getElementById("order-result"),
    resultTitle: document.getElementById("order-result-title"),
    time: document.getElementById("order-time"),
    totalLabel: document.getElementById("order-total-label"),
    totalValue: document.getElementById("order-total-value"),
    stepsTitle: document.getElementById("order-steps-title"),
    steps: document.getElementById("order-steps"),
    placeholder: document.getElementById("order-placeholder"),
    placeholderText: document.getElementById("order-placeholder-text"),
    credit: document.getElementById("order-credit")
  };

  const orderState = {
    item: "",
    selected: new Map(),
    result: null,
    elapsed: 0,
    busy: false,
    worker: null,
    workerUrl: null,
    start: 0,
    loadingTimer: null,
    doneTimer: null,
    showLoading: false,
    done: false
  };

  function ot(key) {
    return (ORDER_UI[state.language] && ORDER_UI[state.language][key]) || ORDER_UI.en[key] || key;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function itemLabel(id) {
    const key = ITEM_KEYS[id];
    if (key) return (UI[state.language]?.items?.[key]) || key;
    const extra = EXTRA_ITEM_LABELS[id];
    return extra ? (extra[state.language] || extra.en) : id;
  }

  function levelText(count) {
    const n = Number(count) || 0;
    if (state.language === "uk") {
      const mod100 = Math.abs(n) % 100;
      const mod10 = mod100 % 10;
      let word = "рівнів";
      if (mod100 < 11 || mod100 > 14) {
        if (mod10 === 1) word = "рівень";
        else if (mod10 >= 2 && mod10 <= 4) word = "рівні";
      }
      return `${n} ${word}`;
    }
    return `${n} ${n === 1 ? ot("levelOne") : ot("levelMany")}`;
  }

  function xpText(count) {
    const n = Math.round(Number(count) || 0);
    const locale = LANGUAGE_HTML[state.language] || "en";
    return `${n.toLocaleString(locale)} ${ot("xp")}`;
  }

  function durationText(ms) {
    if (ms < 1000) return `${Math.max(1, Math.round(ms))} ms`;
    return `${(ms / 1000).toFixed(1)} s`;
  }

  function allowedOrderItems() {
    if (!state.category || state.category === "all" || !SCOPED_CATEGORIES.has(state.category)) return OD.items.slice();
    const allowed = new Set();
    ENCHANTMENTS
      .filter(enchantment => enchantment.category === state.category)
      .forEach(enchantment => {
        (OD.enchants[enchantment.id]?.items || []).forEach(itemId => {
          if (OD.items.includes(itemId)) allowed.add(itemId);
        });
      });
    return OD.items.filter(itemId => allowed.has(itemId));
  }

  function updateOrderScope() {
    if (!els.scope) return;
    const allowed = allowedOrderItems();
    const category = state.category;
    if (!category || !SCOPED_CATEGORIES.has(category) || allowed.length >= OD.items.length) {
      els.scope.hidden = true;
      els.scope.textContent = "";
      return;
    }
    const categoryLabel = UI[state.language]?.categories?.[category] || category;
    els.scope.textContent = ot("scope").replace("{category}", categoryLabel);
    els.scope.hidden = false;
  }

  function renderItemOptions(selected) {
    const allowed = allowedOrderItems();
    const current = selected || "";
    els.item.innerHTML = `<option value="">${escapeHTML(ot("chooseItem"))}</option>` + allowed.map(id =>
      `<option value="${escapeHTML(id)}">${escapeHTML(itemLabel(id))}</option>`
    ).join("");
    els.item.value = allowed.includes(current) ? current : "";
    orderState.item = els.item.value;
    updateOrderScope();
  }

  function eligibleEnchantments(itemId) {
    return ENCHANTMENTS
      .filter(enchantment => itemId === "book" || (OD.enchants[enchantment.id]?.items || []).includes(itemId))
      .sort((a, b) => displayName(a).localeCompare(displayName(b), LANGUAGE_HTML[state.language] || "en"));
  }

  function readSelection() {
    const selected = new Map();
    els.enchants.querySelectorAll(".order-enchant-row").forEach(row => {
      const checkbox = row.querySelector(".order-enchant-check");
      if (!checkbox || !checkbox.checked) return;
      const level = row.querySelector(".order-enchant-level");
      selected.set(row.dataset.id, level ? Number(level.value) : 1);
    });
    return selected;
  }

  function syncSelection() {
    orderState.selected = readSelection();
    return orderState.selected;
  }

  function renderCalculateButton() {
    if (!els.calculateLabel) return;
    els.calculate.classList.toggle("is-done", orderState.done);
    if (orderState.done) {
      els.calculateLabel.textContent = ot("done");
      els.calculateCheck.hidden = false;
      els.calculate.disabled = true;
      return;
    }
    els.calculateCheck.hidden = true;
    if (orderState.busy && orderState.showLoading) {
      els.calculateLabel.textContent = ot("calculating");
      els.calculate.disabled = true;
      return;
    }
    els.calculateLabel.textContent = ot("calculate");
    // While a fast calculation runs, keep the button visually solid; the
    // inert form already blocks interaction. Only slow work shows a loading state.
    els.calculate.disabled = !orderState.busy && readSelection().size === 0;
  }

  function clearButtonTimers() {
    clearTimeout(orderState.loadingTimer);
    clearTimeout(orderState.doneTimer);
    orderState.loadingTimer = null;
    orderState.doneTimer = null;
  }

  function showOrderDone() {
    clearTimeout(orderState.doneTimer);
    orderState.loadingTimer = null;
    orderState.showLoading = false;
    orderState.done = true;
    renderCalculateButton();
    orderState.doneTimer = setTimeout(() => {
      orderState.done = false;
      orderState.doneTimer = null;
      renderCalculateButton();
    }, 850);
  }

  function updateLimits() {
    const count = readSelection().size;
    orderState.selected = readSelection();
    const full = count >= 10;
    els.enchants.querySelectorAll(".order-enchant-row").forEach(row => {
      const checkbox = row.querySelector(".order-enchant-check");
      const level = row.querySelector(".order-enchant-level");
      if (!checkbox) return;
      if (!checkbox.checked) checkbox.disabled = full;
      if (level) level.disabled = !checkbox.checked;
    });
    renderCalculateButton();
  }

  function showNotice(message, progress = false) {
    els.notice.textContent = message;
    els.notice.classList.toggle("is-progress", progress);
    els.notice.hidden = false;
  }

  function hideNotice() {
    els.notice.hidden = true;
    els.notice.classList.remove("is-progress");
  }

  function clearResult() {
    orderState.result = null;
    orderState.elapsed = 0;
    els.result.hidden = true;
    els.steps.innerHTML = "";
    els.placeholder.hidden = false;
    hideNotice();
  }

  function compareOrderNames(a, b) {
    return displayName(a).localeCompare(displayName(b), LANGUAGE_HTML[state.language] || "en");
  }

  function groupEligibleEnchantments(enchantments) {
    const byId = new Map(enchantments.map(enchantment => [enchantment.id, enchantment]));
    const parent = new Map(enchantments.map(enchantment => [enchantment.id, enchantment.id]));
    const find = id => {
      let root = parent.get(id);
      if (root !== id) {
        root = find(root);
        parent.set(id, root);
      }
      return root;
    };
    const union = (a, b) => {
      const rootA = find(a);
      const rootB = find(b);
      if (rootA !== rootB) parent.set(rootB, rootA);
    };
    enchantments.forEach(enchantment => {
      (OD.enchants[enchantment.id]?.incompatible || []).forEach(conflict => {
        if (byId.has(conflict)) union(enchantment.id, conflict);
      });
    });

    const grouped = new Map();
    enchantments.forEach(enchantment => {
      const root = find(enchantment.id);
      if (!grouped.has(root)) grouped.set(root, []);
      grouped.get(root).push(enchantment);
    });

    const groups = [];
    const singles = [];
    grouped.forEach(group => {
      if (group.length > 1) {
        group.sort(compareOrderNames);
        groups.push(group);
      } else {
        singles.push(group[0]);
      }
    });
    groups.sort((a, b) => compareOrderNames(a[0], b[0]));
    singles.sort(compareOrderNames);
    return { groups, singles };
  }

  function groupLabelText() {
    return els.allow.checked ? ot("groupAllowed") : ot("groupChoose");
  }

  function updateGroupLabels() {
    els.enchants.querySelectorAll(".order-enchant-group:not(.order-enchant-group-curses) .order-group-label").forEach(label => {
      label.textContent = groupLabelText();
    });
  }

  function enchantmentRowMarkup(enchantment, preserve) {
    const checked = preserve.has(enchantment.id);
    const level = Math.min(enchantment.maxLevel, Math.max(1, preserve.get(enchantment.id) || enchantment.maxLevel));
    const levelOptions = Array.from({ length: enchantment.maxLevel }, (_, index) => {
      const value = index + 1;
      return `<option value="${value}"${value === level ? " selected" : ""}>${ROMAN[value]}</option>`;
    }).join("");
    const levelControl = enchantment.maxLevel > 1
      ? `<select class="order-enchant-level" aria-label="${escapeHTML(`${displayName(enchantment)} ${ot("level")}`)}"${checked ? "" : " disabled"}>${levelOptions}</select>`
      : `<span class="order-level-fixed" aria-hidden="true">I</span>`;
    const inputId = `order-ench-${escapeHTML(enchantment.id)}`;
    return `<div class="order-enchant-row" data-id="${escapeHTML(enchantment.id)}">
      <input class="order-enchant-check" id="${inputId}" type="checkbox"${checked ? " checked" : ""}>
      <label class="order-enchant-name" for="${inputId}">
        <img class="order-enchant-icon" src="assets/enchant-icons/${escapeHTML(enchantment.id)}.png" alt="" width="14" height="14" loading="lazy">
        <span class="order-enchant-text">${escapeHTML(displayName(enchantment))}</span>
      </label>
      ${levelControl}
    </div>`;
  }

  function renderEnchantRows(preserve = new Map()) {
    const itemId = els.item.value;
    orderState.item = itemId;
    orderState.selected = new Map(preserve);
    if (!itemId) {
      els.enchants.hidden = true;
      els.enchants.innerHTML = "";
      els.calculate.disabled = true;
      return;
    }

    const enchantments = eligibleEnchantments(itemId);
    const curses = enchantments.filter(enchantment => enchantment.category === "curses").sort(compareOrderNames);
    const normal = enchantments.filter(enchantment => enchantment.category !== "curses");
    const { groups, singles } = groupEligibleEnchantments(normal);
    const groupMarkup = groups.map(group => `<div class="order-enchant-group">
      <div class="order-enchant-group-head">
        <span class="order-group-mark" aria-hidden="true">!</span>
        <span class="order-group-label">${escapeHTML(groupLabelText())}</span>
      </div>
      ${group.map(enchantment => enchantmentRowMarkup(enchantment, preserve)).join("")}
    </div>`).join("");
    const singleMarkup = singles.map(enchantment => enchantmentRowMarkup(enchantment, preserve)).join("");
    const curseLabel = UI[state.language]?.categories?.curses || "Curses";
    const curseMarkup = curses.length ? `<div class="order-enchant-group order-enchant-group-curses">
      <div class="order-enchant-group-head">
        <svg class="order-group-skull" aria-hidden="true" viewBox="0 0 16 16"><use href="#i-skull"/></svg>
        <span class="order-curse-label">${escapeHTML(curseLabel)}</span>
      </div>
      ${curses.map(enchantment => enchantmentRowMarkup(enchantment, preserve)).join("")}
    </div>` : "";
    els.enchants.innerHTML = groupMarkup + singleMarkup + curseMarkup;
    els.enchants.hidden = enchantments.length === 0;
    updateLimits();
  }

  function uncheckRow(id) {
    const row = els.enchants.querySelector(`.order-enchant-row[data-id="${id}"]`);
    if (!row) return;
    const checkbox = row.querySelector(".order-enchant-check");
    const level = row.querySelector(".order-enchant-level");
    if (checkbox) checkbox.checked = false;
    if (level) level.disabled = true;
    orderState.selected.delete(id);
  }

  function enforceCompatibility() {
    if (els.allow.checked) return;
    const kept = new Set();
    els.enchants.querySelectorAll(".order-enchant-row").forEach(row => {
      const checkbox = row.querySelector(".order-enchant-check");
      if (!checkbox || !checkbox.checked) return;
      const id = row.dataset.id;
      const incompatible = OD.enchants[id]?.incompatible || [];
      if (incompatible.some(conflict => kept.has(conflict))) {
        uncheckRow(id);
      } else {
        kept.add(id);
      }
    });
    syncSelection();
    updateLimits();
  }

  function onEnchantChange(event) {
    if (orderState.busy) return;
    const target = event.target;
    const row = target.closest(".order-enchant-row");
    if (!row) return;

    if (target.classList.contains("order-enchant-check")) {
      if (target.checked) {
        const count = readSelection().size;
        if (count > 10) {
          target.checked = false;
          showNotice(ot("limit"));
          updateLimits();
          return;
        }
        const level = row.querySelector(".order-enchant-level");
        if (level) {
          level.disabled = false;
          if (!level.value) level.value = level.options[level.options.length - 1].value;
        }
        if (!els.allow.checked) {
          const conflicts = OD.enchants[row.dataset.id]?.incompatible || [];
          conflicts.forEach(conflict => {
            if (conflict !== row.dataset.id) uncheckRow(conflict);
          });
        }
      } else {
        const level = row.querySelector(".order-enchant-level");
        if (level) level.disabled = true;
      }
      clearResult();
      syncSelection();
      updateLimits();
    }

    if (target.classList.contains("order-enchant-level")) {
      clearResult();
      syncSelection();
    }
  }

  function setFormBusy(busy) {
    orderState.busy = busy;
    // Keep the controls visually stable while calculating; inert stops
    // interactions without native disabled styling (which looks like a blink).
    els.form.inert = busy;
    if (busy) {
      clearButtonTimers();
      orderState.done = false;
      orderState.showLoading = false;
      renderCalculateButton();
      // Quick calculations should not flash a loading label.
      orderState.loadingTimer = setTimeout(() => {
        if (!orderState.busy) return;
        orderState.showLoading = true;
        renderCalculateButton();
      }, 300);
    } else {
      clearTimeout(orderState.loadingTimer);
      orderState.loadingTimer = null;
      orderState.showLoading = false;
      updateLimits();
    }
  }

  function collectNode(node, acc) {
    if (!node || typeof node !== "object") return;
    if (typeof node.I === "string") {
      if (ENCH_BY_ID[node.I]) {
        const weight = Number(OD.enchants[node.I]?.weight) || 1;
        const level = Math.max(1, Math.round((Number(node.l) || 0) / weight));
        if (!acc.enchants.some(([id]) => id === node.I)) acc.enchants.push([node.I, level]);
        return;
      }
      if (OD.items.includes(node.I)) {
        acc.item = node.I;
      }
      return;
    }
    collectNode(node.L, acc);
    collectNode(node.R, acc);
  }

  function nodeLabel(node) {
    const acc = { item: "", enchants: [] };
    collectNode(node, acc);
    const base = acc.item ? itemLabel(acc.item) : ot("book");
    const parts = acc.enchants.map(([id, level]) => `${displayName(ENCH_BY_ID[id])} ${ROMAN[level] || ""}`.trim());
    return parts.length ? `${base} · ${parts.join(", ")}` : base;
  }

  function nodeMarkup(node) {
    const acc = { item: "", enchants: [] };
    collectNode(node, acc);
    const base = acc.item ? itemLabel(acc.item) : ot("book");
    const parts = acc.enchants.map(([id, level]) => {
      const label = `${displayName(ENCH_BY_ID[id])} ${ROMAN[level] || ""}`.trim();
      return `<span class="order-step-enchant"><img class="order-step-icon" src="assets/enchant-icons/${escapeHTML(id)}.png" alt="" width="12" height="12" loading="lazy"><span>${escapeHTML(label)}</span></span>`;
    });
    if (!parts.length) return `<span class="order-step-base">${escapeHTML(base)}</span>`;
    return `<span class="order-step-base">${escapeHTML(base)}</span><span class="order-step-dot" aria-hidden="true">·</span><span class="order-step-enchants">${parts.join('<span class="order-step-comma" aria-hidden="true">, </span>')}</span>`;
  }

  function renderResult() {
    const result = orderState.result;
    if (!result) return;
    els.result.hidden = false;
    els.placeholder.hidden = true;
    els.resultTitle.textContent = ot("resultTitle");
    els.totalLabel.textContent = ot("totalCost");
    els.stepsTitle.textContent = ot("steps");

    if (result.special === "already") {
      els.time.textContent = ot("alreadyOptimal");
      els.totalValue.textContent = `${levelText(0)} · ${xpText(0)}`;
      els.stepsTitle.hidden = true;
      els.steps.innerHTML = "";
      return;
    }

    const levels = result.extra?.[0] || 0;
    const xpMin = result.item_obj?.x || 0;
    const xpMax = result.extra?.[1] || xpMin;
    const total = Math.round(xpMin) === Math.round(xpMax)
      ? xpText(xpMin)
      : `${xpText(xpMin)}–${xpText(xpMax)}`;
    els.time.textContent = `${ot("completed")} ${durationText(orderState.elapsed)}`;
    els.totalValue.textContent = `${levelText(levels)} · ${total}`;
    els.stepsTitle.hidden = false;

    if (!result.instructions?.length) {
      els.steps.innerHTML = `<li>${escapeHTML(ot("noSolution"))}</li>`;
      return;
    }

    els.steps.innerHTML = result.instructions.map(instruction => {
      const [left, right, cost, xp, work] = instruction;
      return `<li>
        <span class="order-step-merge"><strong>${nodeMarkup(left)}</strong> <span class="order-step-op" aria-hidden="true">+</span> <strong>${nodeMarkup(right)}</strong></span>
        <span class="order-step-cost">${escapeHTML(ot("cost"))}: ${escapeHTML(levelText(cost))} · ${escapeHTML(xpText(xp))} · ${escapeHTML(ot("prior"))}: ${escapeHTML(work)}</span>
      </li>`;
    }).join("");
  }

  function failCalculation() {
    orderState.busy = false;
    setFormBusy(false);
    clearResult();
    showNotice(ot("noSolution"));
  }

  function ensureWorker() {
    if (orderState.worker) return orderState.worker;
    const source = document.getElementById("order-worker-source").textContent;
    orderState.workerUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    const worker = new Worker(orderState.workerUrl);
    worker.onmessage = event => {
      const data = event.data || {};
      if (data.msg === "complete") {
        orderState.elapsed = performance.now() - orderState.start;
        orderState.result = data;
        orderState.busy = false;
        setFormBusy(false);
        hideNotice();
        renderResult();
        showOrderDone();
      } else if (data.msg === "error") {
        failCalculation();
      }
    };
    worker.onerror = () => {
      failCalculation();
      worker.terminate();
      orderState.worker = null;
    };
    worker.postMessage({ msg: "set_data", data: { enchants: OD.enchants } });
    orderState.worker = worker;
    return worker;
  }

  function calculate() {
    if (orderState.busy) return;
    clearTimeout(orderState.doneTimer);
    orderState.doneTimer = null;
    orderState.done = false;
    renderCalculateButton();
    const selected = syncSelection();
    if (selected.size === 0) {
      showNotice(ot("selectOne"));
      return;
    }
    if (selected.size > 10) {
      showNotice(ot("limit"));
      return;
    }
    enforceCompatibility();
    const finalSelected = syncSelection();
    if (finalSelected.size === 0) return;

    hideNotice();

    if (orderState.item === "book" && finalSelected.size === 1) {
      orderState.result = { special: "already" };
      orderState.elapsed = 0;
      renderResult();
      showOrderDone();
      return;
    }

    const mode = document.querySelector('input[name="order-mode"]:checked')?.value || "levels";
    orderState.start = performance.now();
    setFormBusy(true);
    ensureWorker().postMessage({
      msg: "process",
      item: orderState.item,
      enchants: Array.from(finalSelected.entries()),
      mode
    });
  }

  function updateText() {
    els.openLabel.textContent = ot("open");
    els.open.setAttribute("aria-label", ot("title"));
    els.title.textContent = ot("title");
    els.kicker.textContent = ot("kicker");
    els.intro.textContent = ot("intro");
    els.itemLabel.textContent = ot("item");
    els.allowLabel.textContent = ot("allowIncompatible");
    els.modeLabel.textContent = ot("optimize");
    els.modeLevels.textContent = ot("modeLevels");
    els.modePrior.textContent = ot("modePrior");
    els.enchantLabel.textContent = ot("enchantments");
    els.limit.textContent = ot("limit");
    els.placeholderText.textContent = ot("placeholder");
    els.close.setAttribute("aria-label", ot("close"));
    els.credit.innerHTML = `<a href="https://github.com/iamcal/enchant-order" target="_blank" rel="noopener noreferrer">${escapeHTML(ot("source"))}</a>`;
    if (els.item.options.length) els.item.options[0].textContent = ot("chooseItem");
    renderCalculateButton();
  }

  function updateLanguage() {
    updateText();
    const previousItem = els.item.value;
    const previousSelection = readSelection();
    const allowed = allowedOrderItems();
    const nextItem = allowed.includes(previousItem)
      ? previousItem
      : (allowed.length === 1 ? allowed[0] : "");
    const changed = nextItem !== previousItem;
    renderItemOptions(nextItem);
    if (changed) {
      orderState.selected = new Map();
      clearResult();
      renderEnchantRows(new Map());
    } else if (nextItem) {
      renderEnchantRows(previousSelection);
    } else {
      renderEnchantRows(new Map());
      if (orderState.result) clearResult();
    }
    if (!changed && orderState.result) renderResult();
    if (orderState.busy) setFormBusy(true);
  }

  function resetOrder() {
    if (orderState.worker) {
      orderState.worker.terminate();
      orderState.worker = null;
    }
    if (orderState.workerUrl) {
      URL.revokeObjectURL(orderState.workerUrl);
      orderState.workerUrl = null;
    }
    clearButtonTimers();
    orderState.busy = false;
    orderState.showLoading = false;
    orderState.done = false;
    orderState.item = "";
    orderState.selected = new Map();
    orderState.result = null;
    orderState.elapsed = 0;
    els.form.inert = false;
    els.item.value = "";
    els.allow.checked = false;
    els.dialog.querySelectorAll('input[name="order-mode"]').forEach(input => {
      if (input.value === "levels") input.checked = true;
    });
    els.enchants.innerHTML = "";
    els.enchants.hidden = true;
    els.steps.innerHTML = "";
    els.result.hidden = true;
    els.placeholder.hidden = false;
    hideNotice();
    renderCalculateButton();
  }

  function openDialog() {
    if (els.dialog.open) return;
    updateLanguage();
    els.dialog.showModal();
    document.documentElement.classList.add("order-modal-open");
    setTimeout(() => els.item.focus(), 0);
  }

  function closeDialog() {
    if (els.dialog.open) els.dialog.close();
  }

  els.open.addEventListener("click", openDialog);
  els.close.addEventListener("click", closeDialog);
  els.dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("order-modal-open");
    resetOrder();
  });
  els.dialog.addEventListener("click", event => {
    if (event.target === els.dialog) closeDialog();
  });
  els.item.addEventListener("change", () => {
    if (orderState.busy) return;
    orderState.item = els.item.value;
    orderState.selected = new Map();
    clearResult();
    renderEnchantRows();
    if (!els.item.value) hideNotice();
  });
  els.allow.addEventListener("change", () => {
    if (orderState.busy) return;
    enforceCompatibility();
    updateGroupLabels();
    clearResult();
  });
  els.enchants.addEventListener("change", onEnchantChange);
  els.dialog.querySelectorAll('input[name="order-mode"]').forEach(input => {
    input.addEventListener("change", () => {
      if (!orderState.busy) clearResult();
    });
  });
  els.calculate.addEventListener("click", calculate);

  renderItemOptions("");
  updateText();
  renderEnchantRows();
  window.updateOrderLanguage = updateLanguage;
})();
