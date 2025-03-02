import * as Path from 'path';
import * as os from 'os';
import IBrowserEngine from '@ulixee/unblocked-specification/agent/browser/IBrowserEngine';
import { defaultScreen } from '../Viewports';

export function configureBrowserLaunchArgs(
  engine: IBrowserEngine,
  options: {
    showChrome?: boolean;
    disableGpu?: boolean;
    showDevtools?: boolean;
  },
): void {
  engine.launchArguments.push(
    '--disable-background-networking', // Disable various background network services, including extension updating,safe browsing service, upgrade detector, translate, UMA
    '--enable-features=NetworkService,NetworkServiceInProcess',
    '--disable-background-timer-throttling', // Disable timers being throttled in background pages/tabs
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad', // Disable crashdump collection (reporting is already disabled in Chromium)
    '--disable-client-side-phishing-detection', //  Disables client-side phishing detection.
    '--disable-domain-reliability', // Disables Domain Reliability Monitoring, which tracks whether the browser has difficulty contacting Google-owned sites and uploads reports to Google.
    '--disable-default-apps', // Disable installation of default apps on first run
    '--disable-dev-shm-usage', // https://github.com/GoogleChrome/puppeteer/issues/1834
    '--disable-extensions', // Disable all chrome extensions.
    /**
     * --disable-features
     *  site-per-process = Disables OOPIF
     *  OutOfBlinkCors = Disables feature in chrome80/81 for out of process cors
     *  AvoidUnnecessaryBeforeUnloadCheckSync = allow about:blank nav
     *  MediaRouter,DialMediaRouteProvider (don't lookup local area casting options)
     */
    '--disable-features=PaintHolding,LazyFrameLoading,DestroyProfileOnBrowserClose,AvoidUnnecessaryBeforeUnloadCheckSync,OutOfBlinkCors,GlobalMediaControls,MediaRouter,DialMediaRouteProvider',
    '--disable-blink-features=AutomationControlled',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection', // Some javascript functions can be used to flood the browser process with IPC. By default, protection is on to limit the number of IPC sent to 10 per second per frame.
    '--disable-prompt-on-repost', // Reloading a page that came from a POST normally prompts the user.
    '--disable-renderer-backgrounding', // This disables non-foreground tabs from getting a lower process priority This doesn't (on its own) affect timers or painting behavior. karma-chrome-launcher#123
    '--disable-sync', // Disable syncing to a Google account

    '--force-color-profile=srgb', // Force all monitors to be treated as though they have the specified color profile.
    '--disable-skia-runtime-opts', // Do not use runtime-detected high-end CPU optimizations in Skia.

    '--use-fake-device-for-media-stream',

    '--no-default-browser-check', //  Disable the default browser check, do not prompt to set it as such
    '--metrics-recording-only', // Disable reporting to UMA, but allows for collection
    '--no-first-run', // Skip first run wizards

    // '--enable-automation', BAB - disable because adds infobar, stops auto-reload on network errors (using other flags)
    '--enable-auto-reload', // Enable auto-reload of error pages.

    '--password-store=basic', // Avoid potential instability of using Gnome Keyring or KDE wallet.
    '--use-mock-keychain', // Use mock keychain on Mac to prevent blocking permissions dialogs
    '--allow-running-insecure-content',

    `--window-size=${defaultScreen.width},${defaultScreen.height}`,

    // don't leak private ip
    '--force-webrtc-ip-handling-policy=default_public_interface_only',
    '--no-startup-window',
  );

  if (options.showChrome) {
    const dataDir = Path.join(os.tmpdir(), engine.fullVersion.replace(/\./g, '-'));
    engine.launchArguments.push(`--user-data-dir=${dataDir}`); // required to allow multiple browsers to be headed
    engine.userDataDir = dataDir;

    if (options.showDevtools) engine.launchArguments.push('--auto-open-devtools-for-tabs');
  } else {
    engine.launchArguments.push(
      '--hide-scrollbars',
      '--mute-audio',
      '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4', // adds cursor to headless linux
    );
  }

  if (options.disableGpu === true) {
    engine.launchArguments.push('--disable-gpu', '--disable-software-rasterizer');
    const idx = engine.launchArguments.indexOf('--use-gl=any');
    if (idx >= 0) engine.launchArguments.splice(idx, 1);
  }
}
