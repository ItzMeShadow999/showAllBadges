(() => {
    const wreq = Vencord.Webpack.wreq;
    const re = /let ([\w$]+)=([\w$]+)&&!([\w$]+),([\w$]+)=\1\?Math\.max\(/;
    const swaps = new Map();
    const hits = [];

    for (const [id, factory] of Object.entries(wreq.m)) {
        const src = factory.toString();
        if (!src.includes("UserProfileBadgeListRows") || !re.test(src)) continue;

        try {
            const patched = src
                .replace(re, "let $1=!1,$4=$1?Math.max(")
                .replace(/^(?!(async\s+)?function)[\w$]*\s*\(/, "function(");
            const patchedFactory = (0, eval)(`(${patched})\n//# sourceURL=ShowAllBadges-${id}`);
            wreq.m[id] = patchedFactory;

            const fresh = { id, exports: {} };
            patchedFactory.call(fresh.exports, fresh, fresh.exports, wreq);

            const live = wreq.c[id]?.exports;
            if (!live) continue;

            for (const key of Object.keys(fresh.exports)) {
                const oldVal = live[key];
                const newVal = fresh.exports[key];
                Object.defineProperty(live, key, { enumerable: true, configurable: true, get: () => newVal });
                if (typeof oldVal === "function" && oldVal !== newVal) swaps.set(oldVal, newVal);
            }
            hits.push(id);
        } catch (e) {
            console.error("[ShowAllBadges] failed on", id, e);
        }
    }

    const host = [...document.querySelectorAll("*")].find(el => Object.keys(el).some(k => k.startsWith("__reactContainer$")));
    const root = host?.[Object.keys(host).find(k => k.startsWith("__reactContainer$"))];
    const stack = root ? [root] : [];
    let swapped = 0;

    while (stack.length) {
        const fiber = stack.pop();
        if (fiber.sibling) stack.push(fiber.sibling);
        if (fiber.child) stack.push(fiber.child);

        const next = swaps.get(fiber.type);
        if (!next) continue;

        for (const f of [fiber, fiber.alternate]) {
            if (f) f.type = f.elementType = next;
        }
        swapped++;

        for (let p = fiber.return; p; p = p.return) {
            if (p.stateNode?.forceUpdate) {
                p.stateNode.forceUpdate();
                break;
            }
        }
    }

    console.log(hits.length
        ? `[ShowAllBadges] patched: ${hits.join(", ")} | live components swapped: ${swapped}`
        : "[ShowAllBadges] no matching module found");
})();
