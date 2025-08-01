import { $, $$ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ProductPage extends Page {
 get sortSelect() { return $('.product_sort_container'); }

 async getProductNames() {
    const nameElements = await $$('.inventory_item_name');
    const names = [];
    for (const el of nameElements) {
      names.push(await el.getText());
    }
    return names;
  }

  async getProductPrices() {
    const priceElements = await $$('.inventory_item_price');
    const prices = [];
    for (const el of priceElements) {
      // видаляємо знак $ і конвертуємо в число
      const text = await el.getText();
      prices.push(parseFloat(text.replace('$', '')));
    }
    return prices;
  }

    // get addToCartButton() {
    //     return $("#add-to-cart-sauce-labs-backpack")
    // }
    addToCartById(productId) {
        return $(`#add-to-cart-${productId}`);
    }

    removeFromCartButton(productId) {
        return $(`#remove-${productId}`)
    }

    get cartIcon() {
        return $(".shopping_cart_link")
    }

    get cartCount() {
        return $(".shopping_cart_badge")
    }

    get burgerMenu() {
        return $("#react-burger-menu-btn")
    }

     get itemsBurgerMenu() {
        return $$(".bm-item")
    }
    get logoutButton() {
        return $('#logout_sidebar_link')
    }

    get products() {
        return $$(".inventory_item")
    }

    async logout () {
        await this.burgerMenu.click();
        await this.logoutButton.click();
    }


    get facebookLinkButton(){
        return $('[data-test="social-facebook"]')
    }

     get twitterLinkButton(){
        return $('[data-test="social-twitter"]')
    }

     get linkedinLinkButton(){
        return $('[data-test="social-linkedin"]')
    }
}

export default new ProductPage();
