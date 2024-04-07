export interface Row {
    first: string[];
    second: string[];
    third: string[];
    fourth: string[];
}

export interface FlashCard {
    pages: Row[];
}

export const row2Page = (row: any) => {
    const ks = Object.keys(row);
    return {
        first: row[ks[1]],
        second: row[ks[2]],
    }
};

export const indexMapping = (index: number) => {
    switch (index) {
        case 0:
            return 'first';
        case 1:
            return 'second';
        case 2:
            return 'third';
        case 3:
            return 'fourth';
        default:
            return 'first';
    }
}

export interface Screens {
    first: number[];
    second: number[];
    third: number[];
    fourth: number[];
}

export interface ExecutionSetting {
    size: number;
    isRandom: boolean;
    from: number;
    to: number;
}

export interface Setting {
    fileName: string;
    screenPerRow: number;
    screens: Screens;
    executionSetting?: ExecutionSetting;
}

export const defaultSetting: Setting = {
    fileName: '',
    screenPerRow: 2,
    screens: {
        first: [1, -1, -1, -1],
        second: [2, -1, -1, -1],
        third: [-1, -1, -1, -1],
        fourth: [-1, -1, -1, -1],
    }
}

export const genRow2Page = (setting: Setting): ((row: any) => Row) => {
    return (row: any) => {
        const ks = Object.keys(row);
        return {
            first: setting.screens.first.filter((i) => i >= 0).map((i) => row[ks[i]]),
            second: setting.screens.second.filter((i) => i >= 0).map((i) => row[ks[i]]),
            third: setting.screens.third.filter((i) => i >= 0).map((i) => row[ks[i]]),
            fourth: setting.screens.fourth.filter((i) => i >= 0).map((i) => row[ks[i]]),
        }
    }
}

export interface ExecutionHistory {
    startDatetime: string;
    endDatetime: string;
    size: number;
    success: number;
    isRandom: boolean;
}

export interface WrappedRow {
    filename: string;
    col0: string;
}

export interface FlashCardExecutionHistory {
    executionNumber: number;
    histories: ExecutionHistory[];
    recordedRows: WrappedRow[];
}
