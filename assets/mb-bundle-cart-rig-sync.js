/**
 * Keeps free Mining Rig qty in sync when bundle miner line qty changes (+/- in cart).
 * Variant IDs must match blocks/bundle-selector.liquid (VARIANTS_BY_TIER + TIERS.rigs).
 *
 * Decreasing qty via /cart/change.js often splits one rig line into separate free/paid rows.
 * For decreases (or multiple rig lines), we remove all bundle rig lines then add one clean line.
 */
(function () {
  var RIG_VARIANT = 56077888815435;
  /** @type {Record<number, number>} miner variant id -> rig count per unit */
  var RIGS_PER_MINER_UNIT = {
    56573140566347: 0,
    56573140599115: 0,
    56573140631883: 1,
    56573140664651: 2,
    56573140697419: 4,
    56573140730187: 6,
  };

  var RIG_PROPERTIES = {
    'Bundle Gift': 'Mining Rig',
    'Bundle Type': 'MineBlock PDP-v3',
  };

  var syncing = false;

  function changeJsUrl() {
    var u = (window.Theme && Theme.routes && Theme.routes.cart_change_url) || '/cart/change';
    return u.slice(-3) === '.js' ? u : u + '.js';
  }

  function addJsUrl() {
    return (window.Theme && Theme.routes && Theme.routes.cart_add_url) || '/cart/add.js';
  }

  function updateJsUrl() {
    var u = (window.Theme && Theme.routes && Theme.routes.cart_update_url) || '/cart/update';
    return u.slice(-3) === '.js' ? u : u + '.js';
  }

  function collectSections() {
    var ids = [];
    document.querySelectorAll('cart-items-component[data-section-id]').forEach(function (el) {
      ids.push(el.getAttribute('data-section-id'));
    });
    return ids.join(',');
  }

  function rigsPerVariant(variantId) {
    var n = Number(variantId);
    return Object.prototype.hasOwnProperty.call(RIGS_PER_MINER_UNIT, n) ? RIGS_PER_MINER_UNIT[n] : 0;
  }

  function isBundleRigLine(item) {
    if (Number(item.variant_id) !== RIG_VARIANT) return false;
    var p = item.properties || {};
    return String(p['Bundle Gift'] || '') === 'Mining Rig';
  }

  function findAllBundleRigLines(items) {
    var out = [];
    if (!items) return out;
    for (var i = 0; i < items.length; i++) {
      if (isBundleRigLine(items[i])) out.push(items[i]);
    }
    return out;
  }

  function findBundleRigLine(items) {
    var all = findAllBundleRigLines(items);
    return all.length ? all[0] : null;
  }

  function targetRigQuantity(items) {
    var total = 0;
    if (!items) return 0;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var per = rigsPerVariant(it.variant_id);
      if (per > 0) total += Number(it.quantity) * per;
    }
    return total;
  }

  function dispatchCartUpdateFromResponse(data) {
    if (!data || data.status || data.errors) return;
    document.dispatchEvent(
      new CustomEvent('cart:update', {
        bubbles: true,
        detail: {
          resource: data,
          sourceId: 'mb-rig-sync',
          data: {
            source: 'mb-rig-sync',
            itemCount: data.item_count,
            sections: data.sections || {},
          },
        },
      })
    );
  }

  function postJson(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json();
    });
  }

  function isErrorResponse(data) {
    return !!(data && (data.status || data.errors));
  }

  /**
   * Remove every bundle rig row, then optionally add one row at `target` qty (single discount line).
   */
  function replaceAllBundleRigs(lines, target, sec, done) {
    var updates = {};
    lines.forEach(function (l) {
      updates[String(l.key)] = 0;
    });

    postJson(updateJsUrl(), Object.assign({ updates: updates }, sec))
      .then(function (data) {
        if (isErrorResponse(data)) {
          throw new Error(String((data && (data.message || data.description)) || 'Cart update failed'));
        }
        if (target <= 0) {
          dispatchCartUpdateFromResponse(data);
          return null;
        }
        return postJson(
          addJsUrl(),
          Object.assign(
            {
              items: [{ id: RIG_VARIANT, quantity: target, properties: RIG_PROPERTIES }],
            },
            sec
          )
        );
      })
      .then(function (data2) {
        if (!data2) return;
        if (isErrorResponse(data2)) {
          throw new Error(String((data2 && (data2.message || data2.description)) || 'Add to cart failed'));
        }
        dispatchCartUpdateFromResponse(data2);
      })
      .catch(function (e) {
        console.error('[MB rig sync]', e);
      })
      .finally(done);
  }

  function syncRigToTarget(cart) {
    if (!cart || !cart.items) return;

    var target = targetRigQuantity(cart.items);
    var lines = findAllBundleRigLines(cart.items);
    var sumCurrent = lines.reduce(function (a, l) {
      return a + Number(l.quantity);
    }, 0);

    if (target === sumCurrent && lines.length === 1) return;

    var sections = collectSections();
    var sec = { sections: sections, sections_url: window.location.pathname || '/' };

    syncing = true;
    var done = function () {
      syncing = false;
    };

    function handleErr(e) {
      console.error('[MB rig sync]', e);
    }

    if (lines.length === 0) {
      if (target <= 0) {
        done();
        return;
      }
      postJson(
        addJsUrl(),
        Object.assign(
          {
            items: [{ id: RIG_VARIANT, quantity: target, properties: RIG_PROPERTIES }],
          },
          sec
        )
      )
        .then(function (data) {
          if (isErrorResponse(data)) {
            throw new Error(String((data && (data.message || data.description)) || 'Add to cart failed'));
          }
          dispatchCartUpdateFromResponse(data);
        })
        .catch(handleErr)
        .finally(done);
      return;
    }

    var singleLine = lines.length === 1;
    var increasing = target > sumCurrent;

    if (singleLine && increasing) {
      postJson(changeJsUrl(), Object.assign({ id: String(lines[0].key), quantity: target }, sec))
        .then(function (data) {
          if (isErrorResponse(data)) {
            throw new Error(String((data && (data.message || data.description)) || 'Cart change failed'));
          }
          dispatchCartUpdateFromResponse(data);
        })
        .catch(handleErr)
        .finally(done);
      return;
    }

    replaceAllBundleRigs(lines, target, sec, done);
  }

  document.addEventListener('cart:update', function (e) {
    if (syncing) return;
    if (e.detail && e.detail.data && e.detail.data.source === 'mb-rig-sync') return;

    var cart = e.detail && e.detail.resource;
    if (!cart || !Array.isArray(cart.items)) return;

    var hasBundleMiner = cart.items.some(function (it) {
      return rigsPerVariant(it.variant_id) > 0;
    });
    var hasBundleRig = findBundleRigLine(cart.items);
    if (!hasBundleMiner && !hasBundleRig) return;

    syncRigToTarget(cart);
  });
})();
