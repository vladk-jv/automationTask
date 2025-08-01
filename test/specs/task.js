import { browser, expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import SecurePage from '../pageobjects/secure.page.js'
import productPage from '../pageobjects/product.page.js';
import cartPage from '../pageobjects/cart.page.js';



describe('My Login application', () => {

  //TC-0001
  it('should login with valid password', async () => {
    await LoginPage.open();
    await LoginPage.login('standard_user', 'secret_sauce');


    const products = await productPage.products; 

    expect(products.length).toBeGreaterThan(5);   
    await expect(productPage.cartIcon).toBeDisplayed()

  });

  //TC-0002
  it('should show an error when logging in with invalid password', async () => {
    await LoginPage.open();
    await LoginPage.login('standard_user', 'secret_sauce_wrong');

    await expect(LoginPage.errorMessage).toBeDisplayed()
    await expect(LoginPage.iconX).toBeDisplayed()

  });
  //TC-0003
   it('should show an error when logging in with invalid login', async () => {
    await LoginPage.open();
    await LoginPage.login('standarD_user', 'secret_sauce');

    await expect(LoginPage.errorMessage).toBeDisplayed()
    await expect(LoginPage.iconX).toBeDisplayed()

  });

  //TC-0004
  it('should logout', async () => {
    // precondition 
    await LoginPage.open();
    await LoginPage.login('standard_user', 'secret_sauce');

    await productPage.burgerMenu.click()
    const burgerLinks = await productPage.itemsBurgerMenu
    await expect(productPage.logoutButton).toBeDisplayed()
    expect(burgerLinks.length).toBe(4)

    await productPage.logoutButton.click()

    await expect(LoginPage.inputUsername).toBeDisplayed();
    await expect(LoginPage.inputUsername).toHaveValue('');
    await expect(LoginPage.inputUsername).toHaveValue('');

  });

  //TC-0005
  it('should save cart after logout', async () => {
    // precondition 
    await LoginPage.open();
    await LoginPage.login('standard_user', 'secret_sauce');

    //add product to the cart
    await productPage.addToCartById("sauce-labs-backpack").click()
    await expect(productPage.cartCount).toHaveText('1');

    //logout
    productPage.logout()

    //login
    await LoginPage.login('standard_user', 'secret_sauce');
    //check cart
    await expect(productPage.cartCount).toHaveText('1');

    await productPage.removeFromCartButton("sauce-labs-backpack").click()
  });

  //TC-0006
  it('should sort products correctly by all sorting options', async () => {
      
    await LoginPage.open();
    await LoginPage.login('standard_user', 'secret_sauce');

    for (const option of sortOptions) {
      await productPage.sortSelect.selectByAttribute('value', option.value);


      let items;
      if (option.type === 'price') {
        items = await productPage.getProductPrices();
      } else {
        items = await productPage.getProductNames();
      }

      const sorted = [...items].sort((a, b) => {
        if (option.type === 'price') {
          return option.order === 'asc' ? a - b : b - a;
        } else {
          return option.order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
        }
      });

      expect(items).toEqual(sorted);
    }
  });
  //TC-0007
  it('should redirect to twitter', async () => {
    await LoginPage.open();
    await LoginPage.login('standard_user', 'secret_sauce');
    
    await testSocialRedirect(productPage.twitterLinkButton, 'https://x.com/saucelabs');
    await testSocialRedirect(productPage.facebookLinkButton, 'https://www.facebook.com/saucelabs');
    await testSocialRedirect(productPage.linkedinLinkButton, 'https://www.linkedin.com/company/sauce-labs/');


  });

  //TC-0008
  it('should successfully checkout', async () => {
    await LoginPage.open();
    await LoginPage.login('standard_user', 'secret_sauce');
    
    //add to cart
    await productPage.addToCartById("sauce-labs-backpack").click()
    await productPage.cartIcon.click()
    await expect(cartPage.productCartTitle).toHaveText("Sauce Labs Backpack")
    await cartPage.checkoutButton.click()

    //checkout info
    await expect(cartPage.inputFirstName).toBeDisplayed()
    await cartPage.checkout("vv","vv","vv")

    //overview checkout
    await expect(cartPage.checkoutTitle).toHaveText("Checkout: Overview")
    await expect(cartPage.productCartTitle).toHaveText("Sauce Labs Backpack")
    await expect(cartPage.cartPageTotalPrice).toHaveText("Item total: $29.99")

    //Completed checkout
    await cartPage.finishButton.click()
    await expect(cartPage.checkoutTitle).toHaveText("Checkout: Complete!")
    await expect(cartPage.completeMessage).toHaveText("Your order has been dispatched, and will arrive just as fast as the pony can get there!")

    //Back home
    await cartPage.backHomeButton.click()

    const products = await productPage.products; 

    expect(products.length).toBeGreaterThan(5);   
    await expect(productPage.cartIcon).toBeDisplayed()
    await expect(productPage.cartCount).not.toBeDisplayed()
});
  //TC-0009
  it('should show error about empty cart', async () => {
    await LoginPage.open();
    await LoginPage.login('standard_user', 'secret_sauce');
    
    await expect(productPage.cartIcon).toBeDisplayed()
    await expect(cartPage.cartItem).not.toBeDisplayed()

    //this test failed! No error message
    //Explanation: The page doesn't have an error element, so I assumed there should be one with the ID "error-message"
    // so i get error "Can't call getText on element with selector "#error-message" because element wasn't found"
    await expect(cartPage.errorMessage).toHaveText("Cart is empty")




});
});

async function testSocialRedirect(buttonElement, expectedUrlPart) {
  const originalWindow = await browser.getWindowHandle();

  await buttonElement.click();

  await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2, {
    timeout: 5000,
    timeoutMsg: 'expected a new window to open after 5s'
  });

  const windows = await browser.getWindowHandles();
  const newWindow = windows.find(w => w !== originalWindow);

  await browser.switchToWindow(newWindow);
  await expect(browser).toHaveUrl(expectedUrlPart);
  await browser.closeWindow();
  await browser.switchToWindow(originalWindow);
}

const sortOptions = [
    { value: 'lohi', type: 'price', order: 'asc' },
    { value: 'hilo', type: 'price', order: 'desc' },
    { value: 'az', type: 'name', order: 'asc' },
    { value: 'za', type: 'name', order: 'desc' },
  ];
 