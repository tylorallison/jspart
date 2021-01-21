export { ParticleEmitter };

/** ========================================================================
 * A particle emitter class which is responsible for generating new particles
 * based on a generator function and timing intervals.
 */
class ParticleEmitter {

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new particle emitter
     * @param {*} spec.x - starting x position of emitter
     * @param {*} spec.y - starting y position of emitter
     * @param {*} spec.e - parent emitter of emitter (if any)
     * @param {*} spec.psys - link to the particle system
     * @param {*} spec.genFcn - particle generator function
     * @param {*} spec.interval - interval (in milliseconds) between particle generation
     * @param {*} spec.jitter - percentage of interval to create a jitter between particle generation.  0 would indicate no jitter, 1 would indicate an interval between 0 and 2x interval.
     * @param {*} spec.ttl - emitter lifetime (in milliseconds), defaults to 0 which means no lifetime.
     * @param {*} spec.count - number of particles to emit per interval
     */
    constructor(spec={}) {
        this._x = spec.x || 0;
        this._y = spec.y || 0;
        this.e = spec.e;
        this.psys = spec.psys || ParticleSystem.instance;
        this.genFcn = spec.genFcn;
        this.interval = spec.interval || 500;
        this.jitter = (spec.jitter) ? spec.jitter/100 : 0;
        this.ttl = spec.ttl || 0;
        this.count = spec.count || 1;
        this.currentTick = 0;
        this._done = false;
        this._active = true;
        // compute next time to emit
        this.tte = 0;
        this.nextTTE();
        // keep track of particles emitter has generated
        this.particles = [];
        this.first = true;
    }

    // PROPERTIES ----------------------------------------------------------
    /**
     * Indicates if the emitter has completed its life-cycle (and can be discarded)
     */
    get done() {
        return this._done;
    }
    set done(value) {
        this._done = (value) ? true : false;
    }

    /**
     * Indicates if the emitter is active
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

    // METHODS -------------------------------------------------------------
    /**
     * computes new time to emit based on interval and jitter
     */
    nextTTE() {
        this.tte = this.interval;
        if (this.jitter) {
            let ij = this.jitter * this.interval;
            this.tte += ((Math.random() * ij * 2) - ij);
        }
        if (this.tte < 1) this.tte = 1; // minimum interval;
    }

    /**
     * run generator to emit particle
     */
    emit() {
        if (!this.genFcn) return;
        for (let i=0; i<this.count; i++) {
            let p = this.genFcn(this);
            if (p) this.psys.add(p);
        }
    }

    /**
     * Update the particle emitter.  This is where new particles get generated based on the emitter schedule.
     */
    update(ctx) {
        // emit on first iteration
        if (this.first) {
            this.first = false;
            this.emit();
        }
        // don't update if emitter is done
        if (this.done) return;
        let dt = ctx.deltaTime;
        // update running emitter lifetime (if set)
        if (this.ttl) {
            this.ttl -= dt;
            if (this.ttl <= 0) {
                this._done = true;
                return;
            }
        }
        // update tte
        this.tte -= dt;
        // run generator if tte is zero
        if (this.tte <= 0) {
            this.emit();
            // compute next tte
            this.nextTTE();
        }
    }
}