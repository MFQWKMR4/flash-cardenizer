import { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import { FlashCardExecutionHistory, ExecutionHistory } from './model';
import { useFlashCard } from './FcProvider';

type RecordContextType = {
    history: FlashCardExecutionHistory,
    fireGoButton: () => void,
    fireFinButton: () => void,
    setSuccessCount: (count: number) => void,

}

const DefaultRecordContext: RecordContextType = {
    history: { histories: [], executionNumber: 0, recordedRows: [] },
    fireGoButton: () => { },
    fireFinButton: () => { },
    setSuccessCount: () => { },
}

export const RecordContext = createContext(DefaultRecordContext)

const localStorageKey = 'FlashCardExecutionHistory';

export function RecordProvider({ children }: { children?: ReactNode }) {

    const { setting } = useFlashCard();
    const [history, setHistory] = useState({} as FlashCardExecutionHistory);
    const [currentExecution, setCurrentExecution] = useState({
        startDatetime: '',
        endDatetime: '',
        size: 0,
        success: 0,
        isRandom: false,
    } as ExecutionHistory);
    const [successCount, setSuccessCount] = useState(0);

    const appendHistory = (eh: ExecutionHistory) => {
        if (!history.histories) {
            setHistory({ histories: [eh], executionNumber: 1, recordedRows: [] });
        } else {
            history.histories.push(eh);
            history.executionNumber = history.executionNumber + 1;
            setHistory({ ...history });
            localStorage.setItem(localStorageKey, JSON.stringify(history));
        }
    };

    const fireGoButton = () => {
        setCurrentExecution((prev) => {
            prev.startDatetime = new Date().toISOString();
            prev.size = setting.executionSetting?.size || 0;
            prev.isRandom = setting.executionSetting?.isRandom || false;
            return prev;
        });
    };

    const fireFinButton = () => {
        currentExecution.endDatetime = new Date().toISOString();
        currentExecution.success = successCount;
        appendHistory(currentExecution);

        // reset
        setCurrentExecution({
            startDatetime: '',
            endDatetime: '',
            size: setting.executionSetting?.size || 0,
            success: 0,
            isRandom: setting.executionSetting?.isRandom || false,
        });
    };

    useEffect(() => {
        const history = localStorage.getItem(localStorageKey);
        if (history) {
            setHistory(JSON.parse(history));
        }
    }, []);

    return (
        <RecordContext.Provider value={{ history, fireGoButton, fireFinButton, setSuccessCount }}>
            {children}
        </RecordContext.Provider>
    )
}

export const useRecord = () => {
    return useContext(RecordContext);
}
