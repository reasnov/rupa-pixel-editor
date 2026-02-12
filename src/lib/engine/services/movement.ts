import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';

export class MovementService {
    move(dx: number, dy: number): boolean {
        const newX = Math.max(0, Math.min(atelier.linen.width - 1, atelier.needle.pos.x + dx));
        const newY = Math.max(0, Math.min(atelier.linen.height - 1, atelier.needle.pos.y + dy));

        if (newX !== atelier.needle.pos.x || newY !== atelier.needle.pos.y) {
            atelier.needle.setPos(newX, newY);
            sfx.playMove();
            return true;
        }
        return false;
    }
}
