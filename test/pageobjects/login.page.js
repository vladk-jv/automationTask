import { $ } from "@wdio/globals";
import Page from "./page.js";

class LoginPage extends Page {
  get usernameInput() {
    return $("#user-name");
  }

  get passwordInput() {
    return $("#password");
  }

  get submitButton() {
    return $("#login-button");
  }

  get errorMessage() {
    return $('[data-test="error"]');
  }
  get XIcon() {
    return $('[data-icon="times-circle"]');
  }

  async login(username, password) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.submitButton.click();
  }

  open() {
    return super.open("");
  }
}

export default new LoginPage();
