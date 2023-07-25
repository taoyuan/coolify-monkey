import $ from 'jquery';

import {waitForSelector} from '../utils';
import {Secrets} from './consts';
import {listSecretControls} from './helpers';

export async function patchFetchSecrets() {
  const btnAddInBatch = await waitForSelector(
    'button:contains("Add Secrets in Batch")',
  );
  if (!btnAddInBatch) {
    return;
  }

  if ($(`button:contains(${Secrets.FetchBtnText})`).length) {
    return;
  }

  const btn = $(`<button>${Secrets.FetchBtnText}</button>`)
    .addClass('btn btn-sm btn-primary')
    .on('click', fetchSecrets);
  btn.insertBefore(btnAddInBatch);
}

async function fetchSecrets(event: JQuery.ClickEvent) {
  event.preventDefault();

  // find textarea
  const textArea = $('textarea.w-full');
  if (!textArea.length) {
    return console.log('No textarea found');
  }

  const secrets = listSecretControls();

  textArea.val(
    Object.entries(secrets)
      .map(([key, item]) => `${key}=${item.value.val()}`)
      .join('\n'),
  );
}
