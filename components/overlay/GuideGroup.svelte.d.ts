type $$ComponentProps = {
    group: {
        group: string;
        items: Array<{
            intent: string;
            label: string;
            customKey?: string;
        }>;
    };
};
declare const GuideGroup: import("svelte").Component<$$ComponentProps, {}, "">;
type GuideGroup = ReturnType<typeof GuideGroup>;
export default GuideGroup;
