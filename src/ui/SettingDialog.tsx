import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFlashCard } from "@/lib/FcProvider";
import { FileUrl, Setting, indexMapping } from "@/lib/model";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";

export function SettingDialog() {
    const { setting, setSetting, handleFileChange, generateFlashCard, submitFileUrl } = useFlashCard();

    const [fileUrl, setFileUrl] = useState('');

    const [numberOfScreenPerRow, setNumberOfScreenPerRow] = useState(2);
    const [numberOfDisplayedDisplayColumnInputField1, setNumberOfDisplayedDisplayColumnInputField1] = useState(1);
    const [numberOfDisplayedDisplayColumnInputField2, setNumberOfDisplayedDisplayColumnInputField2] = useState(1);
    const [numberOfDisplayedDisplayColumnInputField3, setNumberOfDisplayedDisplayColumnInputField3] = useState(1);
    const [numberOfDisplayedDisplayColumnInputField4, setNumberOfDisplayedDisplayColumnInputField4] = useState(1);
    const numberOfDisplayedDisplayColumnInputFields = [numberOfDisplayedDisplayColumnInputField1, numberOfDisplayedDisplayColumnInputField2, numberOfDisplayedDisplayColumnInputField3, numberOfDisplayedDisplayColumnInputField4];

    const handleNumberOfDisplayedDisplayColumnInputField = (screen: number) => (str: "+" | "-") => {
        switch (screen) {
            case 0:
                if (str === "+") {
                    setNumberOfDisplayedDisplayColumnInputField1(numberOfDisplayedDisplayColumnInputField1 + 1);
                } else {
                    if (1 < numberOfDisplayedDisplayColumnInputField1) {
                        setNumberOfDisplayedDisplayColumnInputField1(numberOfDisplayedDisplayColumnInputField1 - 1);
                    }
                }
                break;
            case 1:
                if (str === "+") {
                    setNumberOfDisplayedDisplayColumnInputField2(numberOfDisplayedDisplayColumnInputField2 + 1);
                } else {
                    if (1 < numberOfDisplayedDisplayColumnInputField2) {
                        setNumberOfDisplayedDisplayColumnInputField2(numberOfDisplayedDisplayColumnInputField2 - 1);
                    }
                }
                break;
            case 2:
                if (str === "+") {
                    setNumberOfDisplayedDisplayColumnInputField3(numberOfDisplayedDisplayColumnInputField3 + 1);
                } else {
                    if (1 < numberOfDisplayedDisplayColumnInputField3) {
                        setNumberOfDisplayedDisplayColumnInputField3(numberOfDisplayedDisplayColumnInputField3 - 1);
                    }
                }
                break;
            case 3:
                if (str === "+") {
                    setNumberOfDisplayedDisplayColumnInputField4(numberOfDisplayedDisplayColumnInputField4 + 1);
                } else {
                    if (1 < numberOfDisplayedDisplayColumnInputField4) {
                        setNumberOfDisplayedDisplayColumnInputField4(numberOfDisplayedDisplayColumnInputField4 - 1);
                    }
                }
                break;
            default:
                break;
        }
    }
    const handleDeleteButtonClick = (screen: number, columnIndex: number) => {
        handleNumberOfDisplayedDisplayColumnInputField(screen)("-");
        const key = indexMapping(screen);
        setSetting((setting: Setting) => {
            const screens = { ...setting.screens };
            screens[key][columnIndex] = -1;
            return { ...setting, screens };
        });
    }

    const handleAddButtonClick = (screen: number, columnIndex: number) => {
        handleNumberOfDisplayedDisplayColumnInputField(screen)("+");
        const key = indexMapping(screen);
        setSetting((setting: Setting) => {
            const screens = { ...setting.screens };
            screens[key][columnIndex] = 1;
            return { ...setting, screens };
        });
    }

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSetting((setting: Setting) => {
            return { ...setting, executionSetting: { ...setting.executionSetting, size: Number(e.target.value) } };
        });
    }

    const handleRandomChange = (e: CheckedState) => {
        const isRandom = e === true ? true : false;
        setSetting((setting: Setting) => {
            return { ...setting, executionSetting: { ...setting.executionSetting, isRandom } };
        });
    }

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSetting((setting: Setting) => {
            return { ...setting, executionSetting: { ...setting.executionSetting, from: Number(e.target.value) } };
        });
    }

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSetting((setting: Setting) => {
            return { ...setting, executionSetting: { ...setting.executionSetting, to: Number(e.target.value) } };
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Settings</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px] overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>Edit FlashCard Settings</DialogTitle>
                    <DialogDescription>
                        {/* Make changes to your profile here. Click save when you're done. */}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                            Choose Local File
                        </Label>
                        <Input id="file" type="file" className="col-span-3" onChange={handleFileChange} />
                        <Label htmlFor="file" className="text-right">
                            Or Input File URL
                        </Label>
                        <Input id="url" type="text" className="col-span-3" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
                        <Label htmlFor="file" className="text-right">
                            Or Select URL
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger>Open History</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>↓ FileNames</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={fileUrl} onValueChange={setFileUrl} />
                                {setting.cachedFileUrls?.candicates.map((fu: FileUrl) => (
                                    <DropdownMenuRadioItem value={fu.url}  >{fu.filename}</DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {
                            fileUrl === '' ? null : <Button type="submit" onClick={() => {
                                submitFileUrl(fileUrl)
                            }}>Load Remote File</Button>
                        }
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="number of screen per row" className="text-right">
                            Screen Per Row
                        </Label>
                        <Input
                            id="number of screen per row"
                            type="number"
                            defaultValue={2}
                            min={2}
                            max={4}
                            className="col-span-3"
                            onChange={(e) => setNumberOfScreenPerRow(Number(e.target.value))}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="number of displayed display column input field" className="text-right">
                            Column index to screen display
                        </Label>
                        <div className="col-span-3 grid grid-cols-1 items-center">
                            {
                                [...Array(numberOfScreenPerRow)].map((_, i) => {
                                    return (
                                        <div key={i} className="flex items-center m-4">
                                            <Label htmlFor={`screen-${i}`} className="text-right mr-2">
                                                Screen {i + 1}
                                            </Label>
                                            <div className="flex flex-wrap w-100%">
                                                {[...Array(numberOfDisplayedDisplayColumnInputFields[i])].map((_, j) => {
                                                    return (
                                                        <div className="mr-4 w-[64px]">
                                                            <DisplayColumnInputField screen={i} columnIndex={j} setSetting={setSetting} />
                                                        </div>
                                                    )
                                                })}
                                                {numberOfDisplayedDisplayColumnInputFields[i] > 1 ? <Button size="sm" variant="outline" onClick={() => handleDeleteButtonClick(i, numberOfDisplayedDisplayColumnInputFields[i] - 1)}>-</Button> : null}
                                                {numberOfDisplayedDisplayColumnInputFields[i] > 3 ? null : <Button size="sm" variant="outline" onClick={() => handleAddButtonClick(i, numberOfDisplayedDisplayColumnInputFields[i])}>+</Button>}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="size" className="text-right">
                            Size
                        </Label>
                        <Input
                            id="size"
                            type="number"
                            min={1}
                            max={1000}
                            className="col-span-3"
                            onChange={handleSizeChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="size" className="text-right">
                            Random?
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="random"
                                checked={setting.executionSetting?.isRandom ?? false}
                                onCheckedChange={handleRandomChange}
                            />
                            <label
                                htmlFor="random"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                random ON
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="from" className="text-right">
                            From
                        </Label>
                        <Input
                            id="from"
                            type="number"
                            min={1}
                            max={10000}
                            className="col-span-3"
                            onChange={handleFromChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="to" className="text-right">
                            To
                        </Label>
                        <Input
                            id="to"
                            type="number"
                            min={1}
                            max={10000}
                            className="col-span-3"
                            onChange={handleToChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={() => {
                        generateFlashCard();
                    }}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface DisplayColumnInputFieldProps {
    screen: number;
    columnIndex: number;
    setSetting: React.Dispatch<React.SetStateAction<Setting>>;
}

function DisplayColumnInputField(props: DisplayColumnInputFieldProps) {

    const { screen, columnIndex, setSetting } = props;
    const { setting } = useFlashCard();
    const k = `screen-${screen}`;
    const key = indexMapping(screen);

    return (
        <div >
            {/* - Display Column */}
            <Input
                id={k}
                type="number"
                defaultValue={1}
                min={0}
                className="text-lg w-16"
                value={setting.screens[key][columnIndex]}
                onChange={(e) => {
                    setSetting((setting: Setting) => {
                        const screens = { ...setting.screens };
                        screens[key][columnIndex] = Number(e.target.value);
                        return { ...setting, screens };
                    })
                }} />
        </div>
    )
}

