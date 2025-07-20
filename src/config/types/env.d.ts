declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'dev' | 'prod' | 'test';
    PORT: string;
    API_KEY: string;
    // Ajoutez d'autres variables au besoin
  }
}

export {};
