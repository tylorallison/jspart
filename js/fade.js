export { FadeParticle };
import { Particle } from "./particle.js";
import { Color } from "./color.js";

/** ========================================================================
 * A particle for a circle that starts at a given position then slowly fades out
 */
class FadeParticle extends Particle {
    /**
     * Create a new fade particle
     * @param {*} spec.x - starting x position of particle
     * @param {*} spec.y - starting y position of particle
     * @param {*} spec.dx - delta x in pixels per second, speed of particle
     * @param {*} spec.dy - delta y in pixels per second, speed of particle
     * @param {*} spec.size - size of particle (radius in pixels)
     * @param {*} spec.color  - color for particle
     * @param {*} spec.ttl - lifetime of particle, in milliseconds
     */
    constructor(spec={}) {
        super(spec);
        this.dx = (spec.dx || 0) * .001;
        this.dy = (spec.dy || 0) * .001;
        this.size = spec.size || 5;
        this.color = spec.color || new Color(255,0,0,1);
        this.ttl = spec.ttl || 1000;
        this.fade = this.color.a;
        this.fadeRate = this.fade/this.ttl;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(ctx) {
        let dt = ctx.deltaTime;
        if (this.done) return;
        // update position
        this.x += (this.dx * dt);
        this.y += (this.dy * dt);
        // fade... slowly fade to nothing
        this.fade -= (dt * this.fadeRate);
        this.color.a = this.fade;
        // time-to-live
        this.ttl -= dt;
        if (this.ttl <= 0) {
            this._done = true;
        }
    }

}