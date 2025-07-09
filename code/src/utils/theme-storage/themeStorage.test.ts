import { getStoredTheme, setStoredTheme, initializeTheme, THEME_KEY } from '@/utils/theme-storage/themeStorage';

import { Theme } from '@/constants/theme';

describe("Test themeStorage util", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
    });

    describe("Test getStoredTheme", () => {
        test("returns theme if valid 'light' value is stored", () => {
            localStorage.setItem(THEME_KEY, Theme.Light);
            expect(getStoredTheme()).toBe(Theme.Light);
        });
        test("returns theme if valid 'dark' value is stored", () => {
            localStorage.setItem(THEME_KEY, Theme.Dark);
            expect(getStoredTheme()).toBe(Theme.Dark);
        });
        test("returns null if stored value is invalid", () => {
            localStorage.setItem(THEME_KEY, "invalid-value");
            expect(getStoredTheme()).toBeNull();
        });
        test("returns null if nothing stored", () => {
            expect(getStoredTheme()).toBeNull();
        });
        test("returns null if error was catched", () => {
            jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {throw new Error('failed to get theme')});
            expect(getStoredTheme()).toBeNull();
        });
    });

    describe("Test setStoredTheme", () => {
        test("stores 'light' value in localStorage", () => {
            setStoredTheme(Theme.Light);
            expect(localStorage.getItem(THEME_KEY)).toBe(Theme.Light);
        });
        test("stores 'dark' value in localStorage", () => {
            setStoredTheme(Theme.Dark);
            expect(localStorage.getItem(THEME_KEY)).toBe(Theme.Dark);
        });
         test("logs error if localStorage.setItem throws", () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('fail to set item');
            });

            setStoredTheme(Theme.Light);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'setStoredTheme error:',
                expect.any(Error)
            );

            consoleErrorSpy.mockRestore();
        });
    });

    describe("Test initializeTheme", () => {
        test("returns stored theme if exists", () => {
            localStorage.setItem(THEME_KEY, Theme.Dark);
            expect(initializeTheme()).toBe(Theme.Dark);
        });
        test("returns prefers-color-scheme dark if no stored theme", () => {
            localStorage.removeItem(THEME_KEY);
            window.matchMedia = jest.fn().mockImplementation(query => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
            }));

            expect(initializeTheme()).toBe(Theme.Dark);
        });
        test("returns prefers-color-scheme light if no stored theme", () => {
            localStorage.removeItem(THEME_KEY);
            window.matchMedia = jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
            }));

            expect(initializeTheme()).toBe(Theme.Light);
        });
    });
});

