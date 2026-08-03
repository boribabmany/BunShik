describe("신규 주문 알림음", () => {
  test("두 음계가 차례로 상승하는 알림음을 만든다", async () => {
    const oscillators = [];
    const createOscillator = jest.fn(() => {
      const oscillator = {
        connect: jest.fn(),
        frequency: { setValueAtTime: jest.fn() },
        start: jest.fn(),
        stop: jest.fn(),
        type: "",
      };
      oscillators.push(oscillator);
      return oscillator;
    });
    const context = {
      createGain: jest.fn(() => ({
        connect: jest.fn(),
        gain: {
          setValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn(),
        },
      })),
      createOscillator,
      currentTime: 1,
      destination: {},
      state: "running",
    };
    const AudioContextMock = jest.fn(() => context);
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: AudioContextMock,
    });

    const { playNewOrderSound } = require("../utils/newOrderSound");
    await playNewOrderSound();

    expect(createOscillator).toHaveBeenCalledTimes(2);
    expect(oscillators[0].frequency.setValueAtTime).toHaveBeenCalledWith(
      880,
      1.02,
    );
    expect(oscillators[1].frequency.setValueAtTime).toHaveBeenCalledWith(
      1174.66,
      1.19,
    );
  });
});
