export class TimerAudio {
  private static instance: TimerAudio;
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private stopTimeout: number | null = null;

  private constructor() {}

  static getInstance(): TimerAudio {
    if (!TimerAudio.instance) {
      TimerAudio.instance = new TimerAudio();
      TimerAudio.instance.stop = TimerAudio.instance.stop.bind(TimerAudio.instance);
    }
    return TimerAudio.instance;
  }

  private async initializeAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async play(): Promise<void> {
    try {
      await this.initializeAudioContext();
      
      if (!this.audioContext) {
        throw new Error('AudioContext not initialized');
      }

      if (this.isPlaying) return;
      this.isPlaying = true;

      const playTone = () => {
        if (!this.isPlaying) return;

        this.oscillator = this.audioContext!.createOscillator();
        this.gainNode = this.audioContext!.createGain();

        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(880, this.audioContext!.currentTime);

        this.gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext!.currentTime + 0.01);
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 0.5);

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioContext!.destination);

        this.oscillator.start();
        this.oscillator.stop(this.audioContext!.currentTime + 0.5);

        setTimeout(playTone, 600);
      };

      playTone();

      this.stopTimeout = window.setTimeout(() => {
        this.stop();
      }, 5000);
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  stop(): void {
    this.isPlaying = false; 

    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    this.cleanup();
  }

  private cleanup(): void {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (error) {
        console.log(error);
      }
      this.oscillator = null;
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }
}
