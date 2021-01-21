export { Particle };

/** ========================================================================
 * The base particle class
 */
class Particle {

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new particle
     * @param {*} spec.x - starting x position of particle
     * @param {*} spec.y - starting y position of particle
     * @param {*} spec.e - parent emitter of particle (if any) used to track position of particle
     */
    constructor(spec={}) {
        this._x = spec.x || 0;
        this._y = spec.y || 0;
        this.e = spec.e;
        this._done = false;
        this._active = true;
    }

    // PROPERTIES ----------------------------------------------------------
    /**
     * Indicates if the particle has completed its life-cycle (and can be discarded)
     */
    get done() {
        return this._done;
    }
    set done(value) {
        this._done = (value) ? true : false;
    }

    /**
     * Indicates if the particle is active
     */
    get active() {
        if (this.e && !this.e.active) return false;
        return this._active;
    }

    get x() {
        return this._x + ((this.e) ? this.e.x : 0);
    }
    set x(value) {
        this._x = value - ((this.e) ? this.e.x : 0);
    }
    get y() {
        return this._y + ((this.e) ? this.e.y : 0);
    }
    set y(value) {
        this._y = value - ((this.e) ? this.e.y : 0);
    }

}