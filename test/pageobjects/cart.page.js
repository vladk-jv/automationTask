import { $ } from "@wdio/globals";
import Page from "./page.js";

class CartPage extends Page {
  get productCartTitle() {
    return $(".inventory_item_name");
  }

  get cartItem() {
    return $(".cart-item");
  }

  get errorMessage() {
    return $("#error-message");
  }

  get checkoutButton() {
    return $("#checkout");
  }

  get firstNameInput() {
    return $("#first-name");
  }

  get lastNameInput() {
    return $("#last-name");
  }
  get postalCodeInput() {
    return $("#postal-code");
  }
  get continueButton() {
    return $("#continue");
  }

  get checkoutTitle() {
    return $(".title");
  }

  get cartPageTotalPrice() {
    return $(".summary_subtotal_label");
  }

  get finishButton() {
    return $("#finish");
  }

  get completeMessage() {
    return $(".complete-text");
  }

  get backHomeButton() {
    return $("#back-to-products");
  }

  async checkout(firstName, lastName, code) {
    await this.firstNameInput.setValue(firstName);
    await this.lastNameInput.setValue(lastName);
    await this.postalCodeInput.setValue(code);
    await this.continueButton.click();
  }
}

export default new CartPage();
