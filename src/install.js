export let deferredInstallPrompt = null;

export const saveBeforeInstallPromptEvent = evt => {
  deferredInstallPrompt = evt;
};

export const promptUser = () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(choice => {
      if (choice.outcome === "accepted") {
        console.log("User accepted the A2HS prompt", choice);
      } else {
        console.log("User dismissed the A2HS prompt", choice);
      }
      deferredInstallPrompt = null;
    });
  }
};
