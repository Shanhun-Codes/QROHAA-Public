import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppLoaderService {
  private readonly _isAppLoading = signal(true);

  readonly isAppLoading = this._isAppLoading.asReadonly();

  async runInitialLoad(load: () => Promise<void>): Promise<void> {
    if (!this._isAppLoading()) {
      await load();
      return;
    }

    const minimumDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, 1500),
    );

    const fontsReady = document.fonts.ready;

    try {
      await Promise.all([load(), minimumDelay, fontsReady]);
    } finally {
      this.stopLoading();
    }
  }

  stopLoading(): void {
    this._isAppLoading.set(false);
  }
}
