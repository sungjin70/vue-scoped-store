import {AnyTypeStoreService} from './core/any-type-store-service';
// import {BaseStoreService} from './core/base-store-service';

const scopedMap = new Map<string,AnyTypeStoreService>();
const globalMap = new Map<string,AnyTypeStoreService>();
const hashedComponentMap = new Map<string, any[]>();

export const scopedStoreManager = {
    addPathMetaInComponent(hash:string, meta:{path:string,options?:{}}) {
        if (!hashedComponentMap.has(hash))
            hashedComponentMap.set(hash,[]);
            
        const metaArr = hashedComponentMap.get(hash);
        metaArr?.push(meta);
        hashedComponentMap.set(hash, metaArr as any[]);
    },
    getPathMetaInComponent(hash:string) {
        return hashedComponentMap.get(hash);
    },
    getPathMetaInComponentCount(hash:string) {
        const pathMetas = hashedComponentMap.get(hash);
        return (!pathMetas ? 0 : pathMetas.length);
    },

    findOfCreateScopedService(key:string) {
        if (!scopedMap.has(key)) {
            scopedMap.set(key, new AnyTypeStoreService());
        }

        return scopedMap.get(key);
    },
    hasScopedService(key:string) {
        return scopedMap.has(key);
    },
    getScopedService(key:string) {
        if (!scopedMap.has(key)) {
            throw `getting service with key=${key} failed`;
        }

        return scopedMap.get(key);
    },
    removeScopedService(key:string) {
        if (!this.hasScopedService(key))
            return;
        else {
            const service = scopedMap.get(key);
            if (service != undefined)
                service.stop();

            scopedMap.delete(key);
        }
    },

    findOfCreateGlobalService(key:string) {
        if (!globalMap.has(key)) {
            globalMap.set(key, new AnyTypeStoreService());
        }

        return globalMap.get(key);
    },
    hasGlobaService(key:string) {
        return globalMap.has(key);
    },
    hasGlobalService(key:string) {
        if (!globalMap.has(key)) {
            throw `getting service with key=${key} failed`;
        }

        return globalMap.get(key);
    },
    removeGlobalService(key:string) {
        if (!this.hasGlobalService(key))
            return;
        else {
            const service = globalMap.get(key);
            if (service != undefined)
                service.stop();

            globalMap.delete(key);
        }
    },

}
