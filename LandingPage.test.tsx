import React from 'react';
import { render, cleanup } from '@testing-library/react';
import LandingPage from './LandingPage';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock Swiper
const mockDestroy = vi.fn();
const Swiper = vi.fn().mockImplementation(() => ({
  destroy: mockDestroy,
}));

// Mock Swiper constructor
global.Swiper = Swiper;

describe('LandingPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('initializes and destroys Swiper correctly', () => {
    const { unmount } = render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Swiper should be initialized
    expect(Swiper).toHaveBeenCalledTimes(1);

    // Unmount the component
    unmount();

    // The destroy method should have been called
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });
});
