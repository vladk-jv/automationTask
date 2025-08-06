import { $ } from "@wdio/globals";
import Page from "./page.js";

class SecurePage extends Page {
  get flashAlert() {
    return $("#flash");
  }
}

export default new SecurePage();
