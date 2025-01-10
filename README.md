# Flow Notes Plugin for Obsidian

Flow Notes provides a Google Keep-like masonry view of your Obsidian notes, designed to facilitate atomic note-taking and make reviewing large collections of notes easier and more intuitive.

## Features

- **Masonry Layout**: Notes are displayed in a responsive grid layout that automatically adjusts based on content length and viewport size
- **Live Search**: Instantly filter notes as you type
- **Tag Filtering**: Filter notes by their tags using an intuitive dropdown interface
- **Multiple Sort Options**: Sort your notes by:
 - Title (alphabetical)
 - Creation date
 - Last modified date
- **Real-time Updates**: View updates automatically when notes are created, modified, or deleted
- **Preview Cards**: Each note is displayed as a card with a preview of its content
- **Smooth Animations**: Fade-in animations when loading notes for a polished feel

## Installation

> NOTE: This plugin has yet to be published and presented to the Obsidian team. The following instructions will be applicable once it is publised, but until then the plugin can only be built manually and placed in the plugins directory.


1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "Flow Notes"
4. Install the plugin
5. Enable the plugin in your Community Plugins list

## Usage

There are several ways to open the Flow Notes view:

- Click the dice icon in the ribbon menu
- Use the command palette and search for "Open All Notes View"
- Use the assigned hotkey (if you've set one)

### Controls

The view provides several ways to organize and find your notes:

- Use the search bar to filter notes by content
- Click "Filter Tags" to show/hide notes with specific tags
- Use the sort dropdown to change how notes are ordered
- Click any note card to open it in a new leaf

## Development

If you want to contribute to the plugin or modify it for your own use:

1. Clone this repository
2. Run '''npm install''' to install dependencies
3. Run '''npm run dev''' to start compilation in watch mode

### Manual Installation for Development

1. Create a folder in your vault's '''.obsidian/plugins''' folder called '''flow-notes'''
2. Copy your '''main.js''', '''manifest.json''', and '''styles.css''' files into the folder
3. Reload Obsidian to see changes

## Support

If you encounter any issues or have feature requests, please file them on the GitHub repository's Issues page.

## License

MIT License. See LICENSE file for details.

## Acknowledgements

- Built using the Obsidian Plugin API
- Uses Masonry.js for the grid layout