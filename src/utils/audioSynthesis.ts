// Dummy audio effects to ensure 0ms latency and 0 browser audio hangs

class SoundEffects {
  public setEnabled(_enabled: boolean) {}
  public setVolume(_vol: number) {}
  public playClick() {}
  public playDialogueBlip() {}
  public playSuccess() {}
  public playError() {}
  public playCoin() {}
  public playLevelUp() {}
}

export const sfx = new SoundEffects();
