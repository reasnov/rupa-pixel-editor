type $$ComponentProps = {
    action: {
        label: string;
        shortcut: string;
        action: () => void;
    };
    isSelected: boolean;
    onSelect: () => void;
};
declare const CatalogAction: import("svelte").Component<$$ComponentProps, {}, "">;
type CatalogAction = ReturnType<typeof CatalogAction>;
export default CatalogAction;
