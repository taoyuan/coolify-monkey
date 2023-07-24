// Function to wait for an element to be available in the DOM
export function waitForSelector(
  selector: string,
  timeout = 10000,
): Promise<JQuery | undefined> {
  return new Promise(resolve => {
    const endTime = Date.now() + timeout;

    function checkElement() {
      const nodes = $(selector);
      if (nodes?.length > 0) {
        resolve(nodes);
      } else if (Date.now() < endTime) {
        setTimeout(checkElement, 100);
      } else {
        resolve(undefined);
      }
    }

    checkElement();
  });
}
