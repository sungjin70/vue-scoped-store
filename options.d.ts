
export interface PageStoreOptions {
  direction?: 'both'|'read'|'write';
  path?:string;
  shareOnCreated?:boolean;
  deep?:boolean;
  immediate?: boolean;
}

export interface PageStoreMethodOptions {
  key:string;
}

export interface GlobalStoreOptions {
  direction?: 'both'|'read'|'write';
  path?:string;
  deep?:boolean;
  immediate?: boolean;
}

export interface GlobalStoreMethodOptions {
  key:string;
}

