export interface PwaState {
  canInstall: boolean;
  isIos: boolean;
  offlineReady: boolean;
  updateAvailable: boolean;
  installed: boolean;
}
export interface PwaServices {
  subscribe(callback: (state: PwaState) => void): () => void;
  install(): Promise<void>;
  update(): Promise<void>;
}
