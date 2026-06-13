// 背景 — 本物の流体シミュレーション（Stable Fluids / Navier-Stokes）
// マウスの動きが流体に力を与え、淡い青鼠のインクが渦を巻いて流れ、ゆっくり消える
// 触らなくても、時折ゆるい流れが生まれて漂いつづける
// WebGL2非対応・reduced-motion時は静的背景のまま
(function () {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
        'position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;';
    const gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false, alpha: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) return;
    document.body.prepend(canvas);

    // ---------- シェーダー ----------
    const VERT = `#version 300 es
in vec2 p;
out vec2 vUv;
void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;

    const FR = (body) => `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
${body}`;

    const SRC = {
        advect: FR(`
uniform sampler2D uVel, uSrc;
uniform float uDt, uDiss;
void main(){
    vec2 pos = vUv - uDt * texture(uVel, vUv).xy;
    o = uDiss * texture(uSrc, pos);
}`),
        splat: FR(`
uniform sampler2D uSrc;
uniform vec2 uPoint;
uniform vec3 uValue;
uniform float uRadius;
uniform float uAspect;
void main(){
    vec2 d = vUv - uPoint;
    d.x *= uAspect;
    float a = exp(-dot(d,d)/uRadius);
    o = vec4(texture(uSrc, vUv).xyz + uValue * a, 1.);
}`),
        divergence: FR(`
uniform sampler2D uVel;
uniform vec2 uTexel;
void main(){
    float l = texture(uVel, vUv - vec2(uTexel.x,0.)).x;
    float r = texture(uVel, vUv + vec2(uTexel.x,0.)).x;
    float b = texture(uVel, vUv - vec2(0.,uTexel.y)).y;
    float t = texture(uVel, vUv + vec2(0.,uTexel.y)).y;
    o = vec4(.5*(r-l+t-b), 0., 0., 1.);
}`),
        pressure: FR(`
uniform sampler2D uPre, uDiv;
uniform vec2 uTexel;
void main(){
    float l = texture(uPre, vUv - vec2(uTexel.x,0.)).x;
    float r = texture(uPre, vUv + vec2(uTexel.x,0.)).x;
    float b = texture(uPre, vUv - vec2(0.,uTexel.y)).x;
    float t = texture(uPre, vUv + vec2(0.,uTexel.y)).x;
    float div = texture(uDiv, vUv).x;
    o = vec4((l+r+b+t-div)*.25, 0., 0., 1.);
}`),
        gradient: FR(`
uniform sampler2D uPre, uVel;
uniform vec2 uTexel;
void main(){
    float l = texture(uPre, vUv - vec2(uTexel.x,0.)).x;
    float r = texture(uPre, vUv + vec2(uTexel.x,0.)).x;
    float b = texture(uPre, vUv - vec2(0.,uTexel.y)).x;
    float t = texture(uPre, vUv + vec2(0.,uTexel.y)).x;
    vec2 v = texture(uVel, vUv).xy - .5*vec2(r-l, t-b);
    o = vec4(v, 0., 1.);
}`),
        display: FR(`
uniform sampler2D uDye;
uniform vec2 uTexel;
void main(){
    float d = clamp(texture(uDye, vUv).x, 0., 1.4);

    // インクの起伏に淡いつやを走らせる
    float dx = texture(uDye, vUv + vec2(uTexel.x,0.)).x - d;
    float dy = texture(uDye, vUv + vec2(0.,uTexel.y)).x - d;
    float sheen = clamp(dx+dy, 0., 1.) * .5;

    vec3 base = vec3(.945,.949,.957);
    vec3 inkLight = vec3(.905,.915,.935);  // ごく薄い青鼠
    vec3 inkDeep  = vec3(.80,.83,.90);   // 濃いところでもごく淡く
    vec3 col = mix(base, inkLight, smoothstep(0., .8, d));
    col = mix(col, inkDeep, smoothstep(.7, 1.6, d) * .4);
    col += sheen * .05;
    o = vec4(col, 1.);
}`),
    };

    function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    const vs = compile(gl.VERTEX_SHADER, VERT);
    if (!vs) { canvas.remove(); return; }

    const progs = {};
    for (const k in SRC) {
        const fsh = compile(gl.FRAGMENT_SHADER, SRC[k]);
        if (!fsh) { canvas.remove(); return; }
        const pr = gl.createProgram();
        gl.attachShader(pr, vs);
        gl.attachShader(pr, fsh);
        gl.linkProgram(pr);
        const u = {};
        const n = gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < n; i++) {
            const name = gl.getActiveUniform(pr, i).name;
            u[name] = gl.getUniformLocation(pr, name);
        }
        progs[k] = { pr, u };
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // ---------- FBO ----------
    function makeTarget(w, h) {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA16F, w, h);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return { tex, fbo, w, h };
    }
    function makePair(w, h) {
        return { a: makeTarget(w, h), b: makeTarget(w, h),
                 swap() { const t = this.a; this.a = this.b; this.b = t; } };
    }

    const SIM = 144, DYE = 512;
    let vel, dye, pre, div;
    function allocate() {
        const ar = innerWidth / innerHeight;
        const sw = ar >= 1 ? SIM : Math.round(SIM * ar);
        const sh = ar >= 1 ? Math.round(SIM / ar) : SIM;
        const dw = ar >= 1 ? DYE : Math.round(DYE * ar);
        const dh = ar >= 1 ? Math.round(DYE / ar) : DYE;
        vel = makePair(sw, sh);
        dye = makePair(dw, dh);
        pre = makePair(sw, sh);
        div = makeTarget(sw, sh);
    }

    function bindTex(unit, tex) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        return unit;
    }
    function blit(target) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
        gl.viewport(0, 0, target ? target.w : canvas.width, target ? target.h : canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function resize() {
        const dpr = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = innerWidth * dpr * 0.7;
        canvas.height = innerHeight * dpr * 0.7;
        allocate();
    }
    addEventListener('resize', resize, { passive: true });
    resize();

    // ---------- 入力 ----------
    const aspect = () => innerWidth / innerHeight;
    function splat(x, y, dx, dy, amount) {
        // 速度を加える
        let P = progs.splat;
        gl.useProgram(P.pr);
        gl.uniform1i(P.u.uSrc, bindTex(0, vel.a.tex));
        gl.uniform2f(P.u.uPoint, x, y);
        gl.uniform3f(P.u.uValue, dx, dy, 0);
        gl.uniform1f(P.u.uRadius, 0.0026);
        gl.uniform1f(P.u.uAspect, aspect());
        blit(vel.b); vel.swap();
        // インクを落とす
        gl.useProgram(P.pr);
        gl.uniform1i(P.u.uSrc, bindTex(0, dye.a.tex));
        gl.uniform2f(P.u.uPoint, x, y);
        gl.uniform3f(P.u.uValue, amount, amount, amount);
        gl.uniform1f(P.u.uRadius, 0.0018);
        gl.uniform1f(P.u.uAspect, aspect());
        blit(dye.b); dye.swap();
    }

    let last = null;
    addEventListener('pointermove', e => {
        const x = e.clientX / innerWidth;
        const y = 1 - e.clientY / innerHeight;
        if (last) {
            const dx = (x - last[0]), dy = (y - last[1]);
            const sp = Math.hypot(dx, dy);
            if (sp > 0.0001) splat(x, y, dx * 11, dy * 11, Math.min(sp * 9, 0.18));
        }
        last = [x, y];
    }, { passive: true });

    // 触らなくても時折ゆるい流れが生まれる
    function ambient() {
        const x = 0.15 + Math.random() * 0.7;
        const y = 0.15 + Math.random() * 0.7;
        const a = Math.random() * Math.PI * 2;
        const s = 0.4 + Math.random() * 0.5;
        splat(x, y, Math.cos(a) * s, Math.sin(a) * s, 0.05);
        setTimeout(ambient, 2200 + Math.random() * 2600);
    }
    setTimeout(ambient, 400);

    // ---------- ループ ----------
    let visible = true, lastT = performance.now();
    document.addEventListener('visibilitychange', () => {
        visible = !document.hidden;
        lastT = performance.now();
        if (visible) requestAnimationFrame(frame);
    });

    function frame() {
        if (!visible) return;
        const now = performance.now();
        const dt = Math.min((now - lastT) / 1000, 1 / 30);
        lastT = now;

        let P;
        // 速度の移流
        P = progs.advect; gl.useProgram(P.pr);
        gl.uniform1i(P.u.uVel, bindTex(0, vel.a.tex));
        gl.uniform1i(P.u.uSrc, bindTex(1, vel.a.tex));
        gl.uniform1f(P.u.uDt, dt);
        gl.uniform1f(P.u.uDiss, 0.998);
        blit(vel.b); vel.swap();

        // インクの移流（ゆっくり薄れて消える）
        gl.useProgram(P.pr);
        gl.uniform1i(P.u.uVel, bindTex(0, vel.a.tex));
        gl.uniform1i(P.u.uSrc, bindTex(1, dye.a.tex));
        gl.uniform1f(P.u.uDt, dt);
        gl.uniform1f(P.u.uDiss, 0.984);
        blit(dye.b); dye.swap();

        // 圧力投影（非圧縮性 → 渦が生きる）
        P = progs.divergence; gl.useProgram(P.pr);
        gl.uniform1i(P.u.uVel, bindTex(0, vel.a.tex));
        gl.uniform2f(P.u.uTexel, 1 / vel.a.w, 1 / vel.a.h);
        blit(div);

        P = progs.pressure; gl.useProgram(P.pr);
        gl.uniform2f(P.u.uTexel, 1 / vel.a.w, 1 / vel.a.h);
        for (let i = 0; i < 22; i++) {
            gl.uniform1i(P.u.uPre, bindTex(0, pre.a.tex));
            gl.uniform1i(P.u.uDiv, bindTex(1, div.tex));
            blit(pre.b); pre.swap();
        }

        P = progs.gradient; gl.useProgram(P.pr);
        gl.uniform1i(P.u.uPre, bindTex(0, pre.a.tex));
        gl.uniform1i(P.u.uVel, bindTex(1, vel.a.tex));
        gl.uniform2f(P.u.uTexel, 1 / vel.a.w, 1 / vel.a.h);
        blit(vel.b); vel.swap();

        // 描画
        P = progs.display; gl.useProgram(P.pr);
        gl.uniform1i(P.u.uDye, bindTex(0, dye.a.tex));
        gl.uniform2f(P.u.uTexel, 1 / dye.a.w, 1 / dye.a.h);
        blit(null);

        requestAnimationFrame(frame);
    }
    frame();
})();
