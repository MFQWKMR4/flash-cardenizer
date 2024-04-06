import { useState, useContext, createContext, ReactNode } from 'react';
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
    handleKeyPress: (event: KeyboardEvent) => void,
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
    handleKeyPress: () => { },
    generateFlashCard: () => { },
    getDisplay: () => { return [] },
}

export const FlashCardContext = createContext(DefaultFlashCardContext)

export function FlashCardProvider({ children }: { children?: ReactNode }) {
    const [tmp, setTmp] = useState([] as any[]);
    const [flashCard, setFlashCard] = useState([] as Row[]);
    const [cursor, setCursor] = useState(0);
    const [setting, setSetting] = useState(defaultSetting);

    const handleFileChange = (event) => {
        console.log("event.target.files.length")
        console.log(event.target.files.length)
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            Papa.parse(file, {
                complete: (result) => {
                    const data = result.data;
                    console.log(data);
                    setTmp(data);
                    // const pages = data.map(row2Page);
                    // setFlashCard(pages);
                },
                header: true,
            });
        } else {
            console.log('no file');
        }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        console.log('key:', event.key);
        if (flashCard.length === 0) {
            console.log('flashCard is empty');
            return;
        }
        if (event.key === 'ArrowRight') {
            setCursor((cursor + 1) % flashCard.length);
        }

        if (event.key === 'ArrowLeft') {
            setCursor((cursor - 1 + flashCard.length) % flashCard.length);
        }
    };

    const generateFlashCard = () => {
        console.log(JSON.stringify(setting));
        console.log(tmp);
        const row2Page = genRow2Page(setting);
        const pages = tmp.map((r) => {
            console.log(r);
            return row2Page(r)
        });
        console.log(pages);
        setFlashCard(pages);
    }

    const getDisplay = (cursor: number): string[] => {
        const rowIndex = Math.floor(cursor / setting.screenPerRow);
        const row = flashCard[rowIndex];
        const screenKey = indexMapping(cursor % setting.screenPerRow);
        const displayStrings = row[screenKey];
        return displayStrings;
    }

    return (
        <FlashCardContext.Provider value={{ flashCard, cursor, setting, setFlashCard, setCursor, setSetting, handleFileChange, handleKeyPress, generateFlashCard, getDisplay }}>
            {children}
        </FlashCardContext.Provider>
    )
}

export const useFlashCard = () => {
    return useContext(FlashCardContext);
}
