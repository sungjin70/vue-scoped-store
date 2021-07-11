
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

/*
    'pageObject':{
      //direction:'both', //read / write / both  - default:both
      //path:'', // a path of store. default:the same as key
      deep:true, //an option of watch
      //immediate:true, //an option of watch
      shareOnCreated:false, // share this data at the created stage - default:false
      onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeSend for pageObject', val, oldVal, options);
      },
      onBeforeReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeReceive for pageObject', val, oldVal, options);
      },
    },

*/



