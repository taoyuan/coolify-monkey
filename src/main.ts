// @ts-ignore isolatedModules
import {patchSecretsPage} from './secrets';
import {runOnUrlChange} from './utils';

async function main() {
  runOnUrlChange(async () => {
    await Promise.all([patchSecretsPage()]);
  });
}

main().catch(console.error);
