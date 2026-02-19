type $$ComponentProps = {
    onExport: (format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4', scale: number, bgColor: string) => void;
    onClose?: () => void;
};
declare const ExportMenu: import("svelte").Component<$$ComponentProps, {}, "">;
type ExportMenu = ReturnType<typeof ExportMenu>;
export default ExportMenu;
