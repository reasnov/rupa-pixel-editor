type $$ComponentProps = {
    title?: string;
    subtitle?: string;
    icon?: string;
    onClose: () => void;
    children: any;
    width?: string;
    maxHeight?: string;
    scrollable?: boolean;
};
declare const Modal: import("svelte").Component<$$ComponentProps, {}, "">;
type Modal = ReturnType<typeof Modal>;
export default Modal;
