// NotesMainView.ts

import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import { Plugin } from 'obsidian';
import Masonry from 'masonry-layout';

export const VIEW_TYPE_NOTES_MAIN = 'notes-main-view';

type SortOption = 'title' | 'created' | 'modified';

export class NotesMainView extends ItemView {
    plugin: Plugin;
    private currentSort: SortOption = 'title'; // Default sort option

    constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
        super(leaf);
        this.plugin = plugin;

        // Listen for vault changes to refresh notes
        this.plugin.registerEvent(
            this.plugin.app.vault.on('create', this.refreshNotes.bind(this))
        );
        this.plugin.registerEvent(
            this.plugin.app.vault.on('delete', this.refreshNotes.bind(this))
        );
        this.plugin.registerEvent(
            this.plugin.app.vault.on('modify', this.refreshNotes.bind(this))
        );
        this.plugin.registerEvent(
            this.plugin.app.vault.on('rename', this.refreshNotes.bind(this))
        );
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
        const container = this.containerEl.children[1] as HTMLElement;
        container.empty();

        // Create a search and sort container
        const controlContainer = container.createDiv({ cls: 'notes-control-container' });

        // Create a search input
        const searchInput = controlContainer.createEl('input', { cls: 'notes-search-input', type: 'text', placeholder: 'Search notes...' });

        // Create a sort dropdown
        const sortSelect = controlContainer.createEl('select', { cls: 'notes-sort-select' });
        sortSelect.createEl('option', { value: 'title', text: 'Sort by Title' });
        sortSelect.createEl('option', { value: 'created', text: 'Sort by Creation Date' });
        sortSelect.createEl('option', { value: 'modified', text: 'Sort by Modification Date' });
        sortSelect.value = this.currentSort; // Set default value

        // Listen for sort option changes
        sortSelect.addEventListener('change', (event: Event) => {
            const target = event.target as HTMLSelectElement;
            this.currentSort = target.value as SortOption;
            this.renderNotes(container);
        });

        // Create a scrollable container
        const scrollContainer = container.createDiv({ cls: 'notes-scroll-container' });

        // Initial render of notes with fade-in animation
        await this.renderNotes(container, true);

        // Implement search functionality with debouncing
        const debouncedFilter = this.debounce(this.filterNotes.bind(this), 300);
        searchInput.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const query = target.value.toLowerCase();
            debouncedFilter(query, scrollContainer);
        });
    }

    /**
     * Renders all notes based on the current sort option.
     * @param animate Whether to apply fade-in animation.
     */
    async renderNotes(container: HTMLElement, animate: boolean = false) {
        const scrollContainer = container.querySelector('.notes-scroll-container') as HTMLElement;
        if (!scrollContainer) return;
        scrollContainer.empty();

        // Fetch all markdown files
        let markdownFiles = this.plugin.app.vault.getMarkdownFiles();

        // Sort files based on the current sort option
        markdownFiles = this.sortFiles(markdownFiles, this.currentSort);

        // Iterate and create note cards
        for (const file of markdownFiles) {
            const card = scrollContainer.createDiv({ cls: 'note-card fade-in' });

            // Determine if the title matches 'Untitled ?\d*'
            const titlePattern = /^Untitled ?\d*$/;
            const title = file.basename;
            const isUntitled = titlePattern.test(title);

            // Conditionally render the title
            if (!isUntitled) {
                const titleEl = card.createEl('h3', { text: title, cls: 'note-title' });
            }

            // Content Preview
            const content = await this.getNotePreview(file);
            const contentEl = card.createEl('p', { text: content, cls: 'note-content' });

            // Click to open the note
            card.addEventListener('click', () => {
                this.plugin.app.workspace.getLeaf(true).openFile(file);
            });
        }

        // Initialize Masonry
        new Masonry(scrollContainer, {
            itemSelector: '.note-card',
            columnWidth: '.note-card',
            percentPosition: true,
            gutter: 16,
        });

        // Remove animation class after animation ends
        if (animate) {
            const cards = scrollContainer.querySelectorAll('.note-card');
            cards.forEach(card => {
                card.addEventListener('animationend', () => {
                    card.classList.remove('fade-in');
                });
            });
        }
    }

    /**
     * Sorts the array of TFile based on the sort option.
     */
    sortFiles(files: TFile[], sortOption: SortOption): TFile[] {
        return files.sort((a, b) => {
            switch (sortOption) {
                case 'title':
                    return a.basename.localeCompare(b.basename);
                case 'created':
                    return a.stat.ctime - b.stat.ctime;
                case 'modified':
                    return a.stat.mtime - b.stat.mtime;
                default:
                    return 0;
            }
        });
    }

    /**
     * Adds a debounce to limit the rate of function execution.
     */
    debounce(func: Function, delay: number) {
        let timeoutId: number;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                func(...args);
            }, delay);
        };
    }

    /**
     * Filters notes based on the search query.
     */
    filterNotes(query: string, container: HTMLElement) {
        const cards = container.querySelectorAll('.note-card');
        cards.forEach(card => {
            const el = card as HTMLElement; // Type assertion

            const titleEl = el.querySelector('.note-title') as HTMLElement;
            const contentEl = el.querySelector('.note-content') as HTMLElement;

            const titleText = titleEl ? titleEl.innerText.toLowerCase() : '';
            const contentText = contentEl ? contentEl.innerText.toLowerCase() : '';

            if (titleText.includes(query) || contentText.includes(query)) {
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        });
    }

    /**
     * Reads the first few characters of the note's content for preview.
     */
    async getNotePreview(file: TFile): Promise<string> {
        try {
            const text = await this.plugin.app.vault.read(file);
            return text.length > 500 ? text.substring(0, 500) + '...' : text;
        } catch (error) {
            console.error(`Error reading file ${file.path}:`, error);
            return '';
        }
    }

    /**
     * Refreshes the notes view when the vault changes.
     */
    async refreshNotes() {
        // Re-render the notes based on the current sort option
        const container = this.containerEl.children[1] as HTMLElement;
        if (container) {
            await this.renderNotes(container, true);
        }
    }
}
