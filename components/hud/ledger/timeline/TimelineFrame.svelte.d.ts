import type { FrameState } from '../../../../state/frame.svelte.js';
type $$ComponentProps = {
    frame: FrameState;
    index: number;
    isActive: boolean;
    isDragged: boolean;
    isDropTarget: boolean;
};
declare const TimelineFrame: import("svelte").Component<$$ComponentProps, {}, "">;
type TimelineFrame = ReturnType<typeof TimelineFrame>;
export default TimelineFrame;
