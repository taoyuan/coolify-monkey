import $ from 'jquery';

import {waitForSelector} from '../utils';
import {Secrets} from './consts';

export async function patchToggleSecretsVisibility() {
  const divSecrets = await waitForSelector('div.title:contains("Secrets")');
  if (!divSecrets) {
    return;
  }

  if ($(`button:contains(${Secrets.ToggleSecretsBtnText})`).length) {
    return;
  }

  const btn = $(`<button>${Secrets.ToggleSecretsBtnText}</button>`)
    .addClass('btn btn-sm btn-primary')
    .on('click', revealSecrets);
  btn.insertAfter(divSecrets[0]);
}

function revealSecrets(event: JQuery.ClickEvent) {
  event.preventDefault();

  const revealNodes = $(
    'input[id="secretValueNew"] ~ div > div > div:first-child',
  );
  revealNodes.trigger('click');
}
