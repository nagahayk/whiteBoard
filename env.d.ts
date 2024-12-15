/// <reference types="vite/client" />
declare interface Window { //追加
    ENGINE_DATA: {
      scenes: any[];
      parameter: any;
      frame: number;
      id: number;
    };
  }