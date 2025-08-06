import { $, $$ } from "@wdio/globals";
import Page from "./page.js";

class ProductPage extends Page {
  get sortSelect() {
    return $(".product_sort_container");
  }

  get cartIcon() {
    return $(".shopping_cart_link");
  }

  get cartCount() {
    return $(".shopping_cart_badge");
  }

  get burgerMenuButton() {
    return $("#react-burger-menu-btn");
  }

  get burgerMenuItems() {
    return $$(".bm-item");
  }
  get logoutButton() {
    return $("#logout_sidebar_link");
  }

  get products() {
    return $$(".inventory_item");
  }

  get facebookLinkButton() {
    return $('[data-test="social-facebook"]');
  }

  get twitterLinkButton() {
    return $('[data-test="social-twitter"]');
  }

  get linkedinLinkButton() {
    return $('[data-test="social-linkedin"]');
  }

  async logout() {
    await this.burgerMenuButton.click();
    await this.logoutButton.click();
  }

  addToCartById(productId) {
    return $(`#add-to-cart-${productId}`);
  }

  removeFromCartButton(productId) {
    return $(`#remove-${productId}`);
  }

  async getProductNames() {
    const nameElements = await $$(".inventory_item_name");
    const names = [];
    for (const el of nameElements) {
      names.push(await el.getText());
    }
    return names;
  }

  async getProductPrices() {
    const priceElements = await $$(".inventory_item_price");
    const prices = [];
    for (const el of priceElements) {
      const text = await el.getText();
      prices.push(parseFloat(text.replace("$", "")));
    }
    return prices;
  }
  sortLocally(items, type, order = "asc") {
    return [...items].sort((a, b) => {
      if (type === "price") {
        return order === "asc" ? a - b : b - a;
      } else {
        return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
      }
    });
  }

  async getSortedItems(option) {
    await this.sortSelect.selectByAttribute("value", option.value);

    return option.type === "price"
      ? await this.getProductPrices()
      : await this.getProductNames();
  }
}

export default new ProductPage();
