type $$ComponentProps = {
    label: string;
    icon: string;
    value: number;
    min?: number;
    max: number;
    step?: number;
    unit?: string;
    isHue?: boolean;
};
declare const ColorSlider: import("svelte").Component<$$ComponentProps, {}, "value">;
type ColorSlider = ReturnType<typeof ColorSlider>;
export default ColorSlider;
