import React from 'react';
import './App.css';
import { SettingDialog } from '@/ui/SettingDialog';
import { useFlashCard } from './lib/FcProvider';
import { Button } from './components/ui/button';

function App() {

  const { flashCard, cursor, handleKeyPress } = useFlashCard();
  const [isExecuting, setIsExecuting] = React.useState(false);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [flashCard, cursor]);

  console.log('cursor:', cursor);

  return (
    <div className="container mx-auto p-4 max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      <div className='flex justify-between'>
        <SettingDialog />
        {flashCard.length > 0 ? <Button onClick={() => {
          setIsExecuting(!isExecuting)
        }}>{isExecuting ? "Fin" : "Go!"}</Button> : null}
      </div>
      <div className="container mx-auto p-4">
        {isExecuting ? <FlashCardContainer cursor={cursor} /> : <HistoryContainer />}
      </div>
    </div >
  );
}

function HistoryContainer() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold underline">History</h1>
    </div>
  );
}


function FlashCardContainer(props: { cursor: number }) {

  const { getDisplay } = useFlashCard();
  const { cursor } = props;
  const displayStrings = getDisplay(cursor);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold underline">Flash Card</h1>
      <div className="flex flex-col justify-center mt-8">
        {displayStrings.map((displayString, index) => (
          <div key={index} className="border p-4 mt-2">
            {displayString}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
