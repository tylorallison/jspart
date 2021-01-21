import { ParticleEmitter } from "./emitter.js";
import { ParticleSystem } from "./system.js";
import { FadeParticle } from "./fade.js";

class Env {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        this.toUpdate = [];
        this.toRender = [];
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    add(obj) {
        if (obj.update) this.toUpdate.push(obj);
        if (obj.render) this.toRender.push(obj);
    }

    remove(obj) {
        let idx = obj.toUpdate.indexOf(obj);
        if (idx >= 0) obj.toUpdate.splice(idx, 1);
        idx = obj.toRender.indexOf(obj);
        if (idx >= 0) obj.toRender.splice(idx, 1);
    }

    update(ctx) {
        for (const updateable of this.toUpdate) {
            updateable.update(ctx);
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const obj of this.toRender) {
            obj.render(this.ctx);
        }
    }

    async load() {
        // loading stuff goes here
    }

    setup() {
        // setup stuff goes here
        // particle system
        this.psys = new ParticleSystem();
        this.add(this.psys);
        // test emitter
        const halfHeight = this.height * .5;
        const ttl = 3000;
        let dy = halfHeight / (ttl*.001);
        this.psys.add( new ParticleEmitter({
            psys: this.psys,
            x: 10,
            y: this.height*.5,
            count: 5,
            interval: 50,
            genFcn: (e) => {
                return new FadeParticle({
                    e: e,
                    ttl: ttl,
                    dy: -(dy - Math.random() * 40),
                    x: Math.round(Math.random() * (this.width-20)),
                    y: Math.round(Math.random() * 20 - 10),
                    size: Math.random() * 5 + 3,
                });
            },
        }));

        this.psys.add( new ParticleEmitter({
            psys: this.psys,
            x: 10,
            y: this.height*.5,
            count: 5,
            interval: 50,
            genFcn: (e) => {
                return new FadeParticle({
                    e: e,
                    ttl: ttl,
                    dy: (dy - Math.random() * 40),
                    x: Math.round(Math.random() * (this.width-20)),
                    y: Math.round(Math.random() * 20 - 10),
                    size: Math.random() * 5 + 3,
                });
            },
        }));

    }

}

window.onload = async function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    let lastUpdate = performance.now();
    let loopID = 0;
    const maxDeltaTime = 1000/20;
    let ctx = {
        deltaTime: 0,
    }

    // create environment
    const env = new Env();
    // -- load
    await env.load();
    // -- setup
    env.setup();
    // -- start main process loop
    window.requestAnimationFrame(loop);

    function getDeltaTime(hts) {
        const dt = Math.min(maxDeltaTime, hts - lastUpdate);
        lastUpdate = hts;
        return dt;
    }

    function loop(hts) {
        // compute delta time
        const dt = Math.min(maxDeltaTime, hts - lastUpdate);
        lastUpdate = hts;
        ctx.deltaTime = dt;
        env.update(ctx);
        env.render();
        // setup next iteration
        loopID = window.requestAnimationFrame(loop);
    }
}