import { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import Papa from 'papaparse';
import { Row, defaultSetting, genRow2Page, indexMapping, Setting } from './model';

type FlashCardContextType = {
    flashCard: Row[],
    cursor: number,
    setting: Setting,
    setFlashCard: (flashCard: Row[]) => void,
    setCursor: (cursor: number) => void,
    setSetting: (setting: any) => void,
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    submitFileUrl: (url: string) => void,
    handleKeyPress: (event: KeyboardEvent) => void,
    toNext: () => void,
    toPrev: () => void,
    generateFlashCard: () => void,
    getDisplay: (cursor: number) => string[],
}

const DefaultFlashCardContext: FlashCardContextType = {
    flashCard: [],
    cursor: 0,
    setting: defaultSetting,
    setFlashCard: () => { },
    setCursor: () => { },
    setSetting: () => { },
    handleFileChange: () => { },
    submitFileUrl: () => { },
    handleKeyPress: () => { },
    toNext: () => { },
    toPrev: () => { },
    generateFlashCard: () => { },
    getDisplay: () => { return [] },
}

export const FlashCardContext = createContext(DefaultFlashCardContext)

const localStorageKey = 'FlashCardSettings';

export function FlashCardProvider({ children }: { children?: ReactNode }) {
    const [tmp, setTmp] = useState([] as any[]);
    const [flashCard, setFlashCard] = useState([] as Row[]);
    const [cursor, setCursor] = useState(0);
    const [setting, setSetting] = useState(defaultSetting);

    const handleFileChange = (event) => {
        console.log(event.target.files.length)
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            Papa.parse(file, {
                complete: (result) => {
                    const data = result.data;
                    console.log(data);
                    setTmp(data);
                },
                header: true,
            });
        } else {
            console.log('no file');
        }
    };

    const submitFileUrl = (url: string) => {

        setSetting((prev) => {

            const filename = url.split('/').pop();
            const fileUrl = { filename: filename, url: url };

            const candicates = prev.cachedFileUrls?.candicates || [];
            candicates.push(fileUrl);

            prev.cachedFileUrls = { candicates: candicates };
            return prev;
        });

        fetch(url)
            .then((response) => response.text())
            .then((text) => {
                const result = Papa.parse(text, { header: true });
                const data = result.data;
                console.log(data);
                setTmp(data);
            });
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        console.log('key:', event.key);
        if (flashCard.length === 0) {
            console.log('flashCard is empty');
            return;
        }
        const numScreen = setting.screenPerRow * flashCard.length;
        if (event.key === 'ArrowRight') {
            setCursor((cursor + 1) % numScreen);
        }

        if (event.key === 'ArrowLeft') {
            setCursor((cursor - 1 + numScreen) % numScreen);
        }
    };

    const toNext = () => {
        const numScreen = setting.screenPerRow * flashCard.length;
        setCursor((cursor + 1) % numScreen);
    };

    const toPrev = () => {
        const numScreen = setting.screenPerRow * flashCard.length;
        setCursor((cursor - 1 + numScreen) % numScreen);
    };

    const generateFlashCard = () => {
        console.log(JSON.stringify(setting));
        localStorage.setItem(localStorageKey, JSON.stringify(setting));
        const row2Page = genRow2Page(setting);

        const entire = tmp.length;
        const from = setting.executionSetting?.from || 1;
        const to = setting.executionSetting?.to || entire;
        if (from < to) {
            const slicedTmp = tmp.slice(from - 1, to);
            const pages = slicedTmp.map((r) => {
                return row2Page(r)
            });
            console.log(pages);
            if (setting.executionSetting?.isRandom) {
                shuffle(pages);
            }
            const pageSize = setting.executionSetting?.size || pages.length;
            const generatedPages = pages.slice(0, pageSize);
            setFlashCard(generatedPages);
        } else {
            console.log('[error] invalid range');
            const pages = tmp.map((r) => {
                return row2Page(r)
            });
            console.log(pages);
            setFlashCard(pages);
        }
    }

    const getDisplay = (cursor: number): string[] => {
        const rowIndex = Math.floor(cursor / setting.screenPerRow);
        const row = flashCard[rowIndex];
        const screenKey = indexMapping(cursor % setting.screenPerRow);
        const displayStrings = row[screenKey];
        return displayStrings;
    }

    useEffect(() => {
        const s = localStorage.getItem(localStorageKey);
        if (s) {
            setSetting(JSON.parse(s));
        }
    }, []);

    return (
        <FlashCardContext.Provider value={{ flashCard, cursor, setting, setFlashCard, setCursor, setSetting, handleFileChange, submitFileUrl, handleKeyPress, generateFlashCard, getDisplay, toNext, toPrev }}>
            {children}
        </FlashCardContext.Provider>
    )
}

export const useFlashCard = () => {
    return useContext(FlashCardContext);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
