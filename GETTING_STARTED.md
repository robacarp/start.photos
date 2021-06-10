## Getting Started

This is documentation for how to develop the browser extensions packaged in this repository. For contributing images to the feed, see `CONTRIBUTING.md`.

Developing WebExtension based browser extension is pretty straightforward. Clone this repo down to your machine and then check out the section for your browser.

### Firefox

- From the repo_root, run `bin/package firefox`, which merges the manifest.json file.
- For sanity, disable or uninstall the browser extension from `about:addons`.
- Navigate to `about:debugging` and click `Load Temporary Addon...` then select `<repo_root>/web_extension/manifest.json`.
- Visit a new tab!

### Chrome

- From the repo_root, run `bin/package chrome`, which merges the manifest.json file.
- For your own sanity, disable or uninstall the browser extension from `chrome://extensions`.
- If the `Load unpacked` button is not available on the extensions page, click the `Developer mode` toggle.
- Click `Load unpacked` and select the _folder_ at `<repo_root>/web_extension`.


### Serving the jekyll image repository locally

- From repo_root/docs
- Install dependencies: `bundle install`
- run `jekyll serve`

## Manifest.json

Changes to manifest.json should be made in the `manifests/shared.json` file whenever possible. Just be sure to run `bin/package <browser>` after modifying any of the manifest files.

## Application Version

While not a library on which anything can depend, the application version follows sematic versioning.

The source of truth for the version of the extension is the `web_extension/VERSION` file. A binary utility is provided at `bin/version` to manipulate the build version.

## Packaging and Deployment

To build a version for deployment, first increment the application version with `bin/version`.

Then, package a zip for each browser: `bin/package -a firefox` `bin/package -a chrome`

`bin/package` emits .zips to `<repo_root>/releases` which are clearly named and can be easily uploaded to the browser addon distribution.
