export type ModeType = 'READY' | 'PAINT' | 'ERASE' | 'SELECT' | 'PICK' | 'FLOW' | 'PAN';
interface ModeDescriptor {
    type: ModeType;
    label: string;
    icon: string;
    color: string;
    isPulse: boolean;
}
export declare class ModeEngine {
    current: ModeDescriptor;
}
export declare const mode: ModeEngine;
export {};
