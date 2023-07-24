export interface SecretItem {
  name: JQuery;
  value: JQuery;
  isBuild: JQuery;
  set: JQuery;
  remove: JQuery;
}

export function listSecretControls() {
  const nameNodes = $('input[id="secretNameNew"]');
  const valueNodes = $('input[id="secretValueNew"]');
  const isBuildNodes = $('button').filter(function () {
    return $(this).find('span:contains("Use isBuildSecret")').length > 0;
  });
  const setNodes = $('button.btn-primary:contains("Set")');
  const removeNodes = $('button.btn-error:contains("Remove")');

  const result: Record<string, SecretItem> = {};
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

    result[name.val() as string] = {
      name,
      value,
      isBuild,
      set,
      remove,
    };
  }
  return result;
}

export function findNewSecretControls(): {
  name: JQuery;
  value: JQuery;
  add: JQuery;
} {
  const nameNodes = $('input[id="secretName"]');
  const valueNodes = $('input[id="secretValue"]');
  const addNodes = $('button.btn:contains("Add")');

  return {
    name: $(nameNodes[0]),
    value: $(valueNodes[0]),
    add: $(addNodes[0]),
  };
}

export function parseSecrets(content: string): {[key: string]: string} {
  const env: {[key: string]: string} = {};

  content.split('\n').forEach(line => {
    line = line.trim();
    // Skip empty and commented lines
    if (line === '' || line.startsWith('#')) {
      return;
    }
    const [key, value] = line.split('=');
    env[key] = value;
  });

  return env;
}
