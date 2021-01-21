export { ParticleSystem };

/** ========================================================================
 * class representing particle system
 * - all emitters and particles are managed and rendered under a single particle system.
 */
class ParticleSystem {
    // STATIC VARIABLES ----------------------------------------------------
    static _instance;

    // STATIC PROPERTIES ---------------------------------------------------
    static get instance() {
        if (!this._instance) this._instance = new this({});
        return this._instance;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new particle system
     */
    constructor(spec={}) {
        if (!ParticleSystem._instance) ParticleSystem._instance = this;
        this.dbg = Object.hasOwnProperty(spec, "dbg") ? spec.dbg : false;
        this.visiblePred = Object.hasOwnProperty(spec, "visiblePred") ? spec.visiblePred : () => true;
        this.items = [];
        this.active = [];
        this.dbgTimer = 0;
        return ParticleSystem._instance;
    }

    // METHODS -------------------------------------------------------------
    /**
     * Add a tracked particle or emitter
     * @param {*} p
     */
    add(p) {
        this.items.push(p);
    }

    /**
     * Remove a particle or emitter from tracked list
     * @param {*} p
     */
    remove(p) {
        let idx = this.items.indexOf(p);
        if (idx >= 0) this.items.splice(idx, 1);
    }

    /**
     * Execute the main update thread for all emitters/particles
     */
    update(ctx) {
        let dt = ctx.deltaTime;
        // iterate through tracked items
        let inactive = 0;
        for (let i=this.items.length-1; i>=0; i--) {
            const item = this.items[i];
            // skip inactive items
            if (!item.active) {
                inactive++;
                continue;
            }
            // update each object
            item.update(ctx);
            // if any items are done, remove them
            if (item.done) {
                this.items.splice(i, 1);
            }
        }
        if (this.dbg) {
            this.dbgTimer += dt;
            if (this.dbgTimer > 1000) {
                this.dbgTimer = 0;
                debug.log("objs: " + this.items.length + " inactive: " + inactive);
            }
        }
    }

    render(ctx) {
        // make sure particles don't impact the rest of the drawing code
        ctx.save();
        // iterate through tracked items
        this.items.filter(item => item.render
                                  && this.visiblePred(item)
                                  && this.active) // (skip drawing for emitters)
            .forEach(item => {
                item.render(ctx);
            });
        ctx.restore();
    }

}