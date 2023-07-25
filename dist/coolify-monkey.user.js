// ==UserScript==
// @name         Coolify Monkey
// @namespace    https://github.com/taoyuan/coolify-monkey
// @version      1.0.0
// @author       TY
// @description  A userscript to make Coolify even cooler!
// @icon         https://coolify.io/favicon.png
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @grant        none
// ==/UserScript==

(function ($$1) {
  'use strict';

  function waitForSelector(selector, timeout = 1e4) {
    return new Promise((resolve) => {
      const endTime = Date.now() + timeout;
      function checkElement() {
        const nodes = $(selector);
        if ((nodes == null ? void 0 : nodes.length) > 0) {
          resolve(nodes);
        } else if (Date.now() < endTime) {
          setTimeout(checkElement, 100);
        } else {
          resolve(void 0);
        }
      }
      checkElement();
    });
  }
  const runOnUrlChange = (fn) => {
    const pS = window.history.pushState;
    const rS = window.history.replaceState;
    window.history.pushState = function(...args) {
      const [, , url] = args;
      fn(url);
      pS.call(this, ...args);
    };
    window.history.replaceState = function(...args) {
      const [, , url] = args;
      fn(url);
      rS.call(this, ...args);
    };
  };
  var Secrets;
  ((Secrets2) => {
    Secrets2.ToggleSecretsBtnText = "Toggle Secrets Visibility";
    Secrets2.FetchBtnText = "Fetch Secrets";
    Secrets2.UpdateSecrets = "Update Secrets";
  })(Secrets || (Secrets = {}));
  function listSecretControls() {
    const nameNodes = $$1('input[id="secretNameNew"]');
    const valueNodes = $$1('input[id="secretValueNew"]');
    const isBuildNodes = $$1("button").filter(function() {
      return $$1(this).find('span:contains("Use isBuildSecret")').length > 0;
    });
    const setNodes = $$1('button.btn-primary:contains("Set")');
    const removeNodes = $$1('button.btn-error:contains("Remove")');
    const result = {};
    for (let i = 0; i < nameNodes.length; i++) {
      const name = $$1(nameNodes[i]);
      const value = $$1(valueNodes[i]);
      const isBuild = $$1(isBuildNodes[i]);
      const set = $$1(setNodes[i]);
      const remove = $$1(removeNodes[i]);
      if (!value) {
        throw new Error(`No Value control found for secret ${name.val()}`);
      }
      if (!isBuild) {
        throw new Error(`No Build control found for secret ${name.val()}`);
      }
      if (!set) {
        throw new Error(`No Set control found for secret ${name.val()}`);
      }
      if (!remove) {
        throw new Error(`No Remove control found for secret ${name.val()}`);
      }
      result[name.val()] = {
        name,
        value,
        isBuild,
        set,
        remove
      };
    }
    return result;
  }
  async function patchFetchSecrets() {
    const btnAddInBatch = await waitForSelector(
      'button:contains("Add Secrets in Batch")'
    );
    if (!btnAddInBatch) {
      return;
    }
    if ($$1(`button:contains(${Secrets.FetchBtnText})`).length) {
      return;
    }
    const btn = $$1(`<button>${Secrets.FetchBtnText}</button>`).addClass("btn btn-sm btn-primary").on("click", fetchSecrets);
    btn.insertBefore(btnAddInBatch);
  }
  async function fetchSecrets(event) {
    event.preventDefault();
    const textArea = $$1("textarea.w-full");
    if (!textArea.length) {
      return console.log("No textarea found");
    }
    const secrets = listSecretControls();
    textArea.val(
      Object.entries(secrets).map(([key, item]) => `${key}=${item.value.val()}`).join("\n")
    );
  }
  async function patchToggleSecretsVisibility() {
    const divSecrets = await waitForSelector('div.title:contains("Secrets")');
    if (!divSecrets) {
      return;
    }
    if ($$1(`button:contains(${Secrets.ToggleSecretsBtnText})`).length) {
      return;
    }
    const btn = $$1(`<button>${Secrets.ToggleSecretsBtnText}</button>`).addClass("btn btn-sm btn-primary").on("click", revealSecrets);
    btn.insertAfter(divSecrets[0]);
  }
  function revealSecrets(event) {
    event.preventDefault();
    const revealNodes = $$1(
      'input[id="secretValueNew"] ~ div > div > div:first-child'
    );
    revealNodes.trigger("click");
  }
  async function patchSecretsPage() {
    await Promise.all([patchToggleSecretsVisibility(), patchFetchSecrets()]);
  }
  async function main() {
    runOnUrlChange(async () => {
      await Promise.all([patchSecretsPage()]);
    });
  }
  main().catch(console.error);

})(jQuery);
