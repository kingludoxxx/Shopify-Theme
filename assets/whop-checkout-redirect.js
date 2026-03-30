document.addEventListener('DOMContentLoaded', function () {
  if (!window.location.pathname.includes('miner-forge-pro-limited-edition')) return;

  const form = document.querySelector('form[action="/cart/add"]');
  if (!form) return;

  const button = form.querySelector('button[name="add"], button[type="submit"]');
  if (!button) return;

  button.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation(); 

    const qtyInput = form.querySelector('input[name="quantity"]');
    const quantity = parseInt(qtyInput?.value || '1', 10);

    let planId = null;
    if (quantity === 1) {
      planId = 'plan_Yxm8J2v2uupFn';
    } else if (quantity === 2) {
      planId = 'plan_Yhw3BCefgUbyb';
    } else if (quantity >= 3) {
      planId = 'plan_U3o0qslZnxPaJ';
    }

    if (!planId) return;

    window.location.href = `https://checkout.mineblock.co/?product_id=${planId}`;
  }, true); 
});
