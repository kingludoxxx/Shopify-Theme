(function () {
  'use strict';

  /* ===================== ONLY KACHING TRANSLATIONS ===================== */
  const translations = {
    /* ===================== GERMAN ===================== */
    de: {
      'BUNDLE & SAVE': 'BUNDLE & SPAREN',
      'Buy 1 Miner': '1 Miner kaufen',
      'Buy 2 Miners': '2 Miner kaufen',
      'Buy 3, get 1 free!': '3 kaufen, 1 gratis!',
      'You save': 'Du sparst',
      'Free Shipping': 'Kostenloser Versand',
      'Best Value': 'Bester Wert',
      '2x ODDS': '2× CHANCEN',
      '4x ODDS': '4× CHANCEN',
      'Save': 'Spare',
      'ADD TO CART': 'IN DEN WARENKORB',
      'Add': 'Hinzufügen',
      'Added!': 'Hinzugefügt!',
      "There's not enough items in our stock, please select smaller bundle.":
        'Nicht genügend Artikel auf Lager. Bitte wähle ein kleineres Bundle.',
      'Sorry, this is not currently available.':
        'Entschuldigung, dies ist derzeit nicht verfügbar.',
      'Unavailable': 'Nicht verfügbar',
      'Sold out': 'Ausverkauft',
      'Out of stock': 'Nicht auf Lager'
    },

    /* ===================== DUTCH ===================== */
    nl: {
      'BUNDLE & SAVE': 'BUNDEL & BESPAAR',
      'Buy 1 Miner': 'Koop 1 miner',
      'Buy 2 Miners': 'Koop 2 miners',
      'Buy 3, get 1 free!': 'Koop 3, krijg 1 gratis!',
      'You save': 'Je bespaart',
      'Free Shipping': 'Gratis verzending',
      'Best Value': 'Beste deal',
      '2x ODDS': '2× KANSEN',
      '4x ODDS': '4× KANSEN',
      'Save': 'Bespaar',
      'ADD TO CART': 'IN WINKELWAGEN',
      'Add': 'Toevoegen',
      'Added!': 'Toegevoegd!',
      "There's not enough items in our stock, please select smaller bundle.":
        'Niet genoeg voorraad beschikbaar. Kies een kleinere bundel.',
      'Sorry, this is not currently available.':
        'Sorry, dit is momenteel niet beschikbaar.',
      'Unavailable': 'Niet beschikbaar',
      'Sold out': 'Uitverkocht',
      'Out of stock': 'Niet op voorraad'
    },

    /* ===================== FRENCH ===================== */
    fr: {
      'BUNDLE & SAVE': 'PACK & ÉCONOMISEZ',
      'Buy 1 Miner': 'Acheter 1 mineur',
      'Buy 2 Miners': 'Acheter 2 mineurs',
      'Buy 3, get 1 free!': 'Achetez-en 3, 1 offert !',
      'You save': 'Vous économisez',
      'Free Shipping': 'Livraison gratuite',
      'Best Value': 'Meilleure offre',
      '2x ODDS': '2× CHANCES',
      '4x ODDS': '4× CHANCES',
      'Save': 'Économisez',
      'ADD TO CART': 'AJOUTER AU PANIER',
      'Add': 'Ajouter',
      'Added!': 'Ajouté !',
      "There's not enough items in our stock, please select smaller bundle.":
        'Stock insuffisant. Veuillez choisir un pack plus petit.',
      'Sorry, this is not currently available.':
        'Désolé, ce produit n’est pas disponible actuellement.',
      'Unavailable': 'Indisponible',
      'Sold out': 'Épuisé',
      'Out of stock': 'Rupture de stock'
    },

    /* ===================== ITALIAN ===================== */
    it: {
      'BUNDLE & SAVE': 'BUNDLE & RISPARMIA',
      'Buy 1 Miner': 'Acquista 1 miner',
      'Buy 2 Miners': 'Acquista 2 miner',
      'Buy 3, get 1 free!': 'Comprane 3, 1 gratis!',
      'You save': 'Risparmi',
      'Free Shipping': 'Spedizione gratuita',
      'Best Value': 'Miglior valore',
      '2x ODDS': '2× PROBABILITÀ',
      '4x ODDS': '4× PROBABILITÀ',
      'Save': 'Risparmia',
      'ADD TO CART': 'AGGIUNGI AL CARRELLO',
      'Add': 'Aggiungi',
      'Added!': 'Aggiunto!',
      "There's not enough items in our stock, please select smaller bundle.":
        'Scorte insufficienti. Seleziona un bundle più piccolo.',
      'Sorry, this is not currently available.':
        'Spiacenti, non è disponibile al momento.',
      'Unavailable': 'Non disponibile',
      'Sold out': 'Esaurito',
      'Out of stock': 'Non disponibile'
    },

    /* ===================== SPANISH ===================== */
    es: {
      'BUNDLE & SAVE': 'PACK & AHORRA',
      'Buy 1 Miner': 'Comprar 1 minero',
      'Buy 2 Miners': 'Comprar 2 mineros',
      'Buy 3, get 1 free!': 'Compra 3 y recibe 1 gratis',
      'You save': 'Ahorras',
      'Free Shipping': 'Envío gratis',
      'Best Value': 'Mejor oferta',
      '2x ODDS': '2× PROBABILIDADES',
      '4x ODDS': '4× PROBABILIDADES',
      'Save': 'Ahorra',
      'ADD TO CART': 'AÑADIR AL CARRITO',
      'Add': 'Añadir',
      'Added!': 'Añadido!',
      "There's not enough items in our stock, please select smaller bundle.":
        'No hay suficiente stock. Selecciona un paquete más pequeño.',
      'Sorry, this is not currently available.':
        'Lo sentimos, no está disponible actualmente.',
      'Unavailable': 'No disponible',
      'Sold out': 'Agotado',
      'Out of stock': 'Sin stock'
    }
  };

  /* ===================== COUNTRY → LANGUAGE ===================== */
  const countryToLanguage = {
    DE: 'de', AT: 'de', CH: 'de', LI: 'de', LU: 'de',
    NL: 'nl',
    FR: 'fr',
    IT: 'it',
    ES: 'es'
  };

  function getLang() {
    return window.Shopify?.country && countryToLanguage[Shopify.country]
      ? countryToLanguage[Shopify.country]
      : null;
  }

  function translateText(text, lang) {
    if (!translations[lang]) return text;

    const clean = text.trim();
    if (translations[lang][clean]) return translations[lang][clean];

    if (clean.startsWith('You save')) {
      return translations[lang]['You save'] + clean.replace('You save', '');
    }

    const saveMatch = clean.match(/Save\s+(\d+)%/i);
    if (saveMatch) {
      return translations[lang]['Save'] + ' ' + saveMatch[1] + '%';
    }

    return text;
  }

  function translateElement(el, lang) {
    if (!el || el.dataset.kachingTranslated) return;

    const original = el.textContent.trim();
    const translated = translateText(original, lang);

    if (translated !== original) {
      el.textContent = translated;
      el.dataset.kachingTranslated = 'true';
    }
  }

  function translateBundles(lang) {
    if (!lang) return;

    document.querySelectorAll(
      `
      .kaching-bundles__block-title,
      .kaching-bundles__bar-title,
      .kaching-bundles__bar-subtitle,
      .kaching-bundles__bar-label,
      .kaching-bundles__bar-most-popular__content,
      .kaching-bundles__free-gift__text,
      .kaching-bundles__cta button,
      .kaching-bundles__cta span,
      .kaching-bundles *
      `
    ).forEach(el => {
      if (el.children.length === 0) {
        translateElement(el, lang);
      }
    });
  }

  function init() {
    const lang = getLang();
    if (!lang) return;

    translateBundles(lang);

    const observer = new MutationObserver(() => {
      translateBundles(lang);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
