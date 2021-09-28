import * as fs from 'fs';

export default function initializeModules(router) {
    const modules = (fs.readdirSync(__dirname))
        .filter((it) => it.endsWith('.ts'))
        .filter((it) => it !== 'index.ts')
        .map((it) => it.replace('.ts', ''));

    modules.map((module) => {
        const moduleController = require(`${__dirname}/${module}`).default;
        const controller = new moduleController();

        if(Array.isArray(controller.__routeName)) {
            controller.__routeName.forEach(route => {
                router.use(route || '', controller.__router.routes(), controller.__router.allowedMethods());
            });
        } else {
            router.use(controller.__routeName || '', controller.__router.routes(), controller.__router.allowedMethods());
        }
    });
}
