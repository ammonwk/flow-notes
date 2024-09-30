// types/masonry-layout.d.ts

declare module 'masonry-layout' {
    interface MasonryOptions {
        itemSelector?: string;
        columnWidth?: string | number;
        gutter?: string | number;
        percentPosition?: boolean;
        fitWidth?: boolean;
        // Add other options as needed
    }

    type MasonryEvent = 'layoutComplete' | 'removeComplete' | 'addItems' | 'removeItems';

    interface LayoutCompleteEvent {
        items: any[]; // Replace 'any' with a more specific type if available
    }

    interface RemoveCompleteEvent {
        items: any[]; // Replace 'any' with a more specific type if available
    }

    class Masonry {
        constructor(element: Element | string, options?: MasonryOptions);
        layout(): void;
        reloadItems(): void;
        destroy(): void;
        on(eventName: 'layoutComplete', callback: (event: LayoutCompleteEvent) => void): void;
        on(eventName: 'removeComplete', callback: (event: RemoveCompleteEvent) => void): void;
        // Add other methods and event listeners as needed
    }

    export default Masonry;
}
