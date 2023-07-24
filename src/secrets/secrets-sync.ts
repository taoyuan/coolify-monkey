import {compareArrays, delay, waitForSelector} from '../utils';
import {Secrets} from './consts';
import {
  findNewSecretControls,
  listSecretControls,
  parseSecrets,
} from './helpers';

export async function patchSyncSecrets() {
  const btnAddInBatch = await waitForSelector(
    'button:contains("Add Secrets in Batch")',
  );
  if (!btnAddInBatch) {
    return;
  }

  const result = findNewSecretControls();
  console.log(result);

  const btn = $(`<button>${Secrets.UpdateSecrets}</button>`)
    .addClass('btn btn-sm btn-primary')
    .on('click', syncSecrets);
  btnAddInBatch.parent().append(btn);
}

async function syncSecrets(event: JQuery.ClickEvent) {
  event.preventDefault();

  const textArea = $('textarea.w-full');
  if (!textArea.length) {
    return console.log('No textarea found');
  }

  const items = listSecretControls();
  const secrets = parseSecrets(textArea.val() as string);

  let {
    shared: updates,
    uniqueToLeft: removes,
    uniqueToRight: adds,
  } = compareArrays(Object.keys(items), Object.keys(secrets));

  updates = updates.filter(key => items[key].value.val() !== secrets[key]);

  if (!updates.length && !removes.length && !adds.length) {
    alert('No changes to update');
    return;
  }

  const proceed = confirm(
    `This will update ${updates.length} secrets, remove ${removes.length} secrets and add ${adds.length} secrets. Are you sure?`,
  );

  if (!proceed) {
    return;
  }

  for (const key of updates) {
    const item = items[key];
    item.value.val(secrets[key]);
    item.value[0].dispatchEvent(new Event('input'));
    item.set.trigger('click');
    await delay(100);
  }

  for (const key of removes) {
    const item = items[key];
    item.remove.trigger('click');
    await delay(100);
  }
}
