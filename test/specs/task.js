import loginPage from "../pageobjects/login.page.js";
import productPage from "../pageobjects/product.page.js";
import cartPage from "../pageobjects/cart.page.js";
import { testSocialRedirect } from "../helpers/redirect.helper.js";

describe("Login failure cases", () => {
  //TC-0002
  it("should show an error when logging in with invalid password", async () => {
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce_wrong");

    await expect(loginPage.errorMessage).toBeDisplayed();
    await expect(loginPage.XIcon).toBeDisplayed();
  });
  //TC-0003
  it("should show an error when logging in with invalid login", async () => {
    await loginPage.open();
    await loginPage.login("standarD_user", "secret_sauce");

    await expect(loginPage.errorMessage).toBeDisplayed();
    await expect(loginPage.XIcon).toBeDisplayed();
  });
});

describe("Tests that require login", () => {
  beforeEach(async () => {
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce");
  });
  //TC-0001
  it("should login with valid password", async () => {
    const products = await productPage.products;

    expect(products.length).toBeGreaterThan(5);
    await expect(productPage.cartIcon).toBeDisplayed();
  });

  //TC-0004
  it("should logout", async () => {
    await productPage.burgerMenuButton.click();
    const burgerLinks = await productPage.burgerMenuItems;
    await expect(productPage.logoutButton).toBeDisplayed();
    expect(burgerLinks.length).toBe(4);

    await productPage.logoutButton.click();

    await expect(loginPage.usernameInput).toBeDisplayed();
    await expect(loginPage.usernameInput).toHaveValue("");
    await expect(loginPage.usernameInput).toHaveValue("");
  });

  //TC-0005
  it("should save cart after logout", async () => {
    await productPage.addToCartById("sauce-labs-backpack").click();
    await expect(productPage.cartCount).toHaveText("1");

    productPage.logout();

    await loginPage.login("standard_user", "secret_sauce");
    await expect(productPage.cartCount).toHaveText("1");

    await productPage.removeFromCartButton("sauce-labs-backpack").click();
  });

  //TC-0006
  it("should sort products correctly by all sorting options", async () => {
    for (const option of sortOptions) {
      const items = await productPage.getSortedItems(option);
      const expected = productPage.sortLocally(
        items,
        option.type,
        option.order
      );
      expect(items).toEqual(expected);
    }
  });
  //TC-0007
  it("should redirect to twitter", async () => {
    await testSocialRedirect(
      productPage.twitterLinkButton,
      "https://x.com/saucelabs"
    );
    await testSocialRedirect(
      productPage.facebookLinkButton,
      "https://www.facebook.com/saucelabs"
    );
    await testSocialRedirect(
      productPage.linkedinLinkButton,
      "https://www.linkedin.com/company/sauce-labs/"
    );
  });

  //TC-0008
  it("should successfully checkout", async () => {
    await productPage.addToCartById("sauce-labs-backpack").click();
    await productPage.cartIcon.click();
    await expect(cartPage.productCartTitle).toHaveText("Sauce Labs Backpack");
    await cartPage.checkoutButton.click();

    await expect(cartPage.firstNameInput).toBeDisplayed();
    await cartPage.checkout("vv", "vv", "vv");

    await expect(cartPage.checkoutTitle).toHaveText("Checkout: Overview");
    await expect(cartPage.productCartTitle).toHaveText("Sauce Labs Backpack");
    await expect(cartPage.cartPageTotalPrice).toHaveText("Item total: $29.99");

    await cartPage.finishButton.click();
    await expect(cartPage.checkoutTitle).toHaveText("Checkout: Complete!");
    await expect(cartPage.completeMessage).toHaveText(
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
    );

    await cartPage.backHomeButton.click();

    const products = await productPage.products;

    expect(products.length).toBeGreaterThan(5);
    await expect(productPage.cartIcon).toBeDisplayed();
    await expect(productPage.cartCount).not.toBeDisplayed();
  });
  //TC-0009
  it("should show error about empty cart", async () => {
    await expect(productPage.cartIcon).toBeDisplayed();
    await expect(cartPage.cartItem).not.toBeDisplayed();

    await expect(cartPage.errorMessage).toHaveText("Cart is empty");
  });
});

const sortOptions = [
  { value: "lohi", type: "price", order: "asc" },
  { value: "hilo", type: "price", order: "desc" },
  { value: "az", type: "name", order: "asc" },
  { value: "za", type: "name", order: "desc" },
];
