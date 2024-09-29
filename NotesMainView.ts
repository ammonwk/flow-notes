// NotesMainView.ts

import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import { Plugin } from 'obsidian';

export const VIEW_TYPE_NOTES_MAIN = 'notes-main-view';

export class NotesMainView extends ItemView {
    plugin: Plugin;

    constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_NOTES_MAIN;
    }

    getDisplayText(): string {
        return 'All Notes';
    }

    // Updated onClose method to return Promise<void>
    async onClose(): Promise<void> {
        // Clean up if necessary
        this.containerEl.empty();
    }

    async onOpen(): Promise<void> {
        const container = this.containerEl.children[1];
        container.empty();

        // Create a scrollable container
        const scrollContainer = container.createDiv({ cls: 'notes-scroll-container' });

        // Fetch all markdown files
        const markdownFiles = this.plugin.app.vault.getMarkdownFiles();

        // Iterate and create note cards
        for (const file of markdownFiles) {
            const card = scrollContainer.createDiv({ cls: 'note-card' });

            // Title
            const title = file.basename;
            const titleEl = card.createEl('h3', { text: title, cls: 'note-title' });

            // Content Preview
            const content = await this.getNotePreview(file);
            const contentEl = card.createEl('p', { text: content, cls: 'note-content' });

            // Click to open the note
            card.addEventListener('click', () => {
                this.plugin.app.workspace.getLeaf(true).openFile(file);
            });
        }
    }

    async getNotePreview(file: TFile): Promise<string> {
        try {
            const text = await this.plugin.app.vault.read(file);
            return text.length > 100 ? text.substring(0, 100) + '...' : text;
        } catch (error) {
            console.error(`Error reading file ${file.path}:`, error);
            return '';
        }
    }
}
