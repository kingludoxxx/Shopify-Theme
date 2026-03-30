import { QuantitySelectorComponent } from '@theme/component-quantity-selector';

/**
 * A custom element that allows the user to select a quantity in the cart.
 * Extends QuantitySelectorComponent but uses absolute max limits instead of effective max.
 * Semantics: "What should the total quantity BE in the cart" vs "How many to ADD to cart"
 *
 * @extends {QuantitySelectorComponent}
 */
class CartQuantitySelectorComponent extends QuantitySelectorComponent {
  /**
   * Gets the effective maximum value for cart quantity selector
   * Cart page: uses absolute max (how much can be in cart total)
   * @returns {number | null} The effective max, or null if no max
   */
  getEffectiveMax() {
    const { max } = this.getCurrentValues();
    return max; // Cart uses absolute max, not max minus cart quantity
  }

  /**
   * Updates button states based on current value and limits.
   * Minus is never fully disabled in cart — at min it triggers removal instead.
   */
  updateButtonStates() {
    const { minusButton, plusButton } = this.refs;
    const { value } = this.getCurrentValues();
    const effectiveMax = this.getEffectiveMax();

    // Always keep minus enabled so pressing it at qty 1 triggers removal
    minusButton.disabled = false;
    plusButton.disabled = effectiveMax !== null && value >= effectiveMax;
  }

  /**
   * Overrides decrease to allow going to 0 at minimum quantity, which
   * triggers the cart items component to remove the line item entirely.
   * @param {Event} event
   */
  decreaseQuantity(event) {
    if (!(event.target instanceof HTMLElement)) return;
    event.preventDefault();

    const { quantityInput } = this.refs;
    const { min, step, value } = this.getCurrentValues();

    if (value <= min) {
      // Set to 0 — component-cart-items.js treats 0 as a removal
      quantityInput.value = '0';
      this.onQuantityChange();
      this.updateButtonStates();
    } else {
      this.updateQuantity(-1);
    }
  }
}

if (!customElements.get('cart-quantity-selector-component')) {
  customElements.define('cart-quantity-selector-component', CartQuantitySelectorComponent);
}
