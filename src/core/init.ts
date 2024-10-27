import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  $debug,
  init as initSDK,
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Mount all components used in the project.
  backButton.isSupported() && backButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();

  // Use a static variable to track if viewport has been mounted
  if (!init.viewportMounted) {
    void viewport.mount().then(() => {
      // Define components-related CSS variables after viewport is mounted
      viewport.bindCssVars();
      miniApp.bindCssVars();
      themeParams.bindCssVars();
      init.viewportMounted = true;
    }).catch((e) => {
      console.error("Something went wrong mounting the viewport", e);
    });
  }

  // Add Eruda if needed.
  debug && import('eruda')
    .then((lib) => lib.default.init())
    .catch(console.error);
}

// Add a static property to the init function
init.viewportMounted = false;
