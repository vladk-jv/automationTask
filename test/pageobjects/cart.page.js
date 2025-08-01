import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CartPage extends Page {
    /**
     * define selectors using getter methods
     */

    
    get productCartTitle(){
        return $(".inventory_item_name")
    }


    
    get cartItem(){
        return $(".cart-item")
    }

    get errorMessage(){
        return $("#error-message")
    }

    get checkoutButton(){
        return $("#checkout")
    }

  
    get inputFirstName(){
        return $("#first-name")
    }

    get inputLastName(){
        return $("#last-name")
    }
     get inputPostalCode(){
        return $("#postal-code")
    }
    get continueButton(){
        return $("#continue")
    }

    get checkoutTitle(){
        return $(".title")
    }

    get cartPageTotalPrice(){
        return $(".summary_subtotal_label")
    }

    get finishButton (){
        return $('#finish')
    }

    get completeMessage(){
        return $('.complete-text')
    }

    get backHomeButton(){
        return $('#back-to-products')
    }

    async checkout (firstName,lastName,code) {
        await this.inputFirstName.setValue(firstName);
        await this.inputLastName.setValue(lastName);
        await this.inputPostalCode.setValue(code);
        await this.continueButton.click()
    }
}

export default new CartPage();
