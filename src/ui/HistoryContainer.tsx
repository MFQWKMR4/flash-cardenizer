import { useRecord } from "@/lib/RecordProvider";
import { ExecutionHistory } from "@/lib/model";

export function HistoryContainer() {

    const { history } = useRecord();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold underline">History</h1>
            {history && history.histories && history.histories.map((eh: ExecutionHistory, index: number) => (
                <div key={index} className="border p-4 mt-2">
                    <div>start: {eh.startDatetime}</div>
                    <div>end: {eh.endDatetime}</div>
                    <div>size: {eh.size}</div>
                    <div>success: {eh.success}</div>
                    <div>isRandom: {eh.isRandom ? 'true' : 'false'}</div>
                </div>
            ))}
        </div>
    );
}
