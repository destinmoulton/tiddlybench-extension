# browser-extension-template

[link-webext-polyfill]: https://github.com/mozilla/webextension-polyfill
[link-rgh]: https://github.com/sindresorhus/refined-github
[link-ngh]: https://github.com/sindresorhus/notifier-for-github
[link-hfog]: https://github.com/sindresorhus/hide-files-on-github
[link-tsconfig]: https://github.com/sindresorhus/tsconfig
[link-xo-ts]: https://github.com/xojs/eslint-config-xo-typescript
[link-options-sync]: https://github.com/fregante/webext-options-sync
[link-cws-keys]: https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md
[link-amo-keys]: https://addons.mozilla.org/en-US/developers/addon/api/key

## Features

-   Use modern Promise-based `browser.*` APIs [webextension-polyfill][link-webext-polyfill].
-   [Auto-syncing options](#auto-syncing-options).
-   [Auto-publishing](#publishing) with auto-versioning and support for manual releases.
-   [Extensive configuration documentation](#configuration).

This extension template is heavily inspired by [refined-github][link-rgh], [notifier-for-github][link-ngh], and [hide-files-on-github][link-hfog] browser extensions. You can always refer to these browser extensions' source code if you find anything confusing on how to create a new extension.

## Configuration

The extension doesn't target any specific ECMAScript environment or provide any transpiling by default. The extensions output will be the same ECMAScript you write. This allows us to always target the latest browser version, which is a good practice you should be following.

# Debugging TiddlyBench

## Debugging options page

### Chrome

Visit `chrome-extension://<extension_id>/options.html`
