// ==UserScript==
// @name         Coolify Monkey
// @namespace    coolify-monkey
// @version      0.0.1
// @author       TT
// @description  A userscript to make Coolify even cooler!
// @icon         https://coolify.io/favicon.png
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
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
    const nameNodes = $('input[id="secretNameNew"]');
    const valueNodes = $('input[id="secretValueNew"]');
    const isBuildNodes = $("button").filter(function() {
      return $(this).find('span:contains("Use isBuildSecret")').length > 0;
    });
    const setNodes = $('button.btn-primary:contains("Set")');
    const removeNodes = $('button.btn-error:contains("Remove")');
    const result = {};
    for (let i = 0; i < nameNodes.length; i++) {
      const name = $(nameNodes[i]);
      const value = $(valueNodes[i]);
      const isBuild = $(isBuildNodes[i]);
      const set = $(setNodes[i]);
      const remove = $(removeNodes[i]);
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
    if ($(`button:contains(${Secrets.FetchBtnText})`).length) {
      return;
    }
    const btn = $(`<button>${Secrets.FetchBtnText}</button>`).addClass("btn btn-sm btn-primary").on("click", fetchSecrets);
    btn.insertBefore(btnAddInBatch);
  }
  async function fetchSecrets(event) {
    event.preventDefault();
    const textArea = $("textarea.w-full");
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
    if ($(`button:contains(${Secrets.ToggleSecretsBtnText})`).length) {
      return;
    }
    const btn = $(`<button>${Secrets.ToggleSecretsBtnText}</button>`).addClass("btn btn-sm btn-primary").on("click", revealSecrets);
    btn.insertAfter(divSecrets[0]);
  }
  function revealSecrets(event) {
    event.preventDefault();
    const revealNodes = $(
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

})();
