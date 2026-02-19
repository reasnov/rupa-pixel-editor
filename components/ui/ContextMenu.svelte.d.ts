interface MenuItem {
    label: string;
    icon?: string;
    action: () => void;
    danger?: boolean;
    disabled?: boolean;
}
type $$ComponentProps = {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
};
declare const ContextMenu: import("svelte").Component<$$ComponentProps, {}, "">;
type ContextMenu = ReturnType<typeof ContextMenu>;
export default ContextMenu;
