type $$ComponentProps = {
    format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4';
    scale: number;
    bgColor: string | 'transparent';
};
declare const ArtifactPreview: import("svelte").Component<$$ComponentProps, {}, "">;
type ArtifactPreview = ReturnType<typeof ArtifactPreview>;
export default ArtifactPreview;
