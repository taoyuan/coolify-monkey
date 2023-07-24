export const runOnUrlChange = (
  fn: (url?: string | URL | null) => Promise<void> | void,
) => {
  const pS = window.history.pushState;
  const rS = window.history.replaceState;

  window.history.pushState = function (...args) {
    const [, , url] = args;
    fn(url);
    pS.call(this, ...args);
  };

  window.history.replaceState = function (...args) {
    const [, , url] = args;
    fn(url);
    rS.call(this, ...args);
  };
};
