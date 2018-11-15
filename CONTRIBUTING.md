## Contributing

This is documentation for how to use use the browser extensions packaged in this repository to contribute images to the feed. For contributing to the development of the extensions themselves, see `GETTING_STARTED.md`

For ease of use, a sister extension located at `<repo_root>/assistant` is provided which allows easier creation of json documents which represent image posts in the feed. 

The assistant is only tested under firefox.

The ruby companion to the assistant is only tested on macOS (clipboard integration is provided by the `pbpaste` command).

## Loading the assistant

- In firefox, navigate to `about:debugging`.
- Click `Load Temporary Addon...` and select the manifest file at `<repo_root>/assistant/manifest.json`
- Validate by navigating to a 500px photo page and look for the rocket icon in the address bar.

## Usage

The assistant will copy a json blob to your clipboard which contains all the necessary information and urls.

Then, from the extension directory, run `bin/import.rb` which will dump and parse the clipboard and create a file in the jekyll directory which will add the image to the feed.

## Pushing suggestions

Create a git branch, commit, and pull request.
