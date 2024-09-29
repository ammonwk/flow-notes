// main.ts

import { Plugin, WorkspaceLeaf } from 'obsidian';
import { NotesMainView, VIEW_TYPE_NOTES_MAIN } from './NotesMainView';
import './styles.css';

export default class FlowNotes extends Plugin {
	async onload() {
		console.log('Loading My Keep-Like Plugin');

		// Register the view
		this.registerView(
			VIEW_TYPE_NOTES_MAIN,
			(leaf: WorkspaceLeaf) => new NotesMainView(leaf, this)
		);

		// Add a ribbon icon
		const ribbonIconEl = this.addRibbonIcon('dice', 'View All Notes', (evt: MouseEvent) => {
			this.activateView();
		});

		// Optional: Add a status bar item
		this.addStatusBarItem().setText('MyKeepLike');

		// Optional: Add a command to open the view
		this.addCommand({
			id: 'open-my-keep-like-view',
			name: 'Open All Notes View',
			callback: () => {
				this.activateView();
			}
		});
	}

	onunload() {
		console.log('Unloading My Keep-Like Plugin');
	}

	// main.ts

	async activateView() {
		// Detach any existing leaves of this view type to avoid duplicates
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_NOTES_MAIN);

		// Get a new leaf in the main workspace
		const leaf = this.app.workspace.getLeaf(true);
		if (leaf) {
			await leaf.setViewState({
				type: VIEW_TYPE_NOTES_MAIN,
				active: true,
			});

			this.app.workspace.revealLeaf(leaf);
		} else {
			console.error('Failed to get a leaf to set the view state.');
		}
	}
}
