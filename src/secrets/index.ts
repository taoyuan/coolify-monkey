import {patchFetchSecrets} from './secrets-fetch';
import {patchToggleSecretsVisibility} from './secrets-visibility';

export async function patchSecretsPage() {
  await Promise.all([patchToggleSecretsVisibility(), patchFetchSecrets()]);
}
