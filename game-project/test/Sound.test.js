import Sound from '../src/Experience/World/Sound';
import { Howl, Howler } from 'howler';

// Hacemos mock de la clase Howl y del contexto de Howler
jest.mock('howler', () => {
  return {
    Howl: jest.fn().mockImplementation(() => ({
      play: jest.fn(),
      stop: jest.fn(),
      playing: jest.fn().mockReturnValue(false),   // Simulamos que no está reproduciendo
    })),
    Howler: {
      ctx: {
        state: 'suspended',   // Simulamos el estado como "suspended"
        resume: jest.fn().mockResolvedValue(true), // Simulamos la reanudación del contexto
      },
    },
  };
});

describe('Sound class', () => {
  let sound;

  beforeEach(() => {
    sound = new Sound('path/to/sound');
    // Resetear el estado del contexto antes de cada prueba que lo modifique
    Howler.ctx.state = 'suspended';
  });

  test('should create an instance of Sound and initialize Howl', () => {
    expect(Howl).toHaveBeenCalledWith({ src: ['path/to/sound'] });
  });

  test('should play sound if AudioContext is running and not already playing', async () => {
    Howler.ctx.state = 'running';
    sound.sound.play.mockClear();

    await sound.play();

    expect(sound.sound.play).toHaveBeenCalled();
    expect(sound._retryCount).toBe(0);
  });

  test('should not play if AudioContext is not active after retries', async () => {
    Howler.ctx.state = 'suspended';
    sound._retryCount = 5;

    const playMock = sound.sound.play;
    const warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await sound.play();

    expect(playMock).not.toHaveBeenCalled();
    expect(warnMock).toHaveBeenCalledWith('🛑 Máximo número de intentos de reproducción alcanzado.');

    warnMock.mockRestore();
  });

  test('should stop sound and reset retry count', () => {
    sound.stop();

    expect(sound.sound.stop).toHaveBeenCalled();
    expect(sound._retryCount).toBe(0);
  });
});
