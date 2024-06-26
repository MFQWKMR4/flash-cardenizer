import React from 'react';
import './App.css';
import { SettingDialog } from '@/ui/SettingDialog';
import { useFlashCard } from './lib/FcProvider';
import { Button } from './components/ui/button';
import { HistoryContainer } from './ui/HistoryContainer';
import { useRecord } from './lib/RecordProvider';

function App() {

  const { flashCard, cursor, handleKeyPress } = useFlashCard();
  const { fireGoButton, fireFinButton } = useRecord();
  const [isExecuting, setIsExecuting] = React.useState(false);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, flashCard, cursor]);

  console.log('cursor:', cursor);

  return (
    <div className="container mx-auto p-4 max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      <div className='flex justify-between'>
        <SettingDialog />
        {flashCard.length > 0 ? <Button onClick={() => {
          if (isExecuting) {
            fireFinButton();
          } else {
            fireGoButton();
          }
          setIsExecuting(!isExecuting);
        }}>{isExecuting ? "Fin" : "Go!"}</Button> : null}
      </div>
      <div className="container mx-auto p-4">
        {isExecuting ? <FlashCardContainer cursor={cursor} /> : <HistoryContainer />}
      </div>
    </div >
  );
}

const handleSpeak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1; // ピッチを設定（0～2）
    utterance.rate = 1; // 速度を設定（0.1～10）
    utterance.lang = 'en-US'; // 言語を設定
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Speech synthesis not supported in this browser.');
  }
};

function FlashCardContainer(props: { cursor: number }) {

  const { incrementNgCount } = useRecord();
  const { getDisplay, toNext, toPrev } = useFlashCard();
  const { cursor } = props;
  const displayStrings = getDisplay(cursor);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold underline">Flash Card</h1>
      <div className="flex flex-col justify-center mt-8">
        {displayStrings.map((displayString, index) => (
          <>
            <div key={index} className="border p-4 mt-2" >
              {displayString}
            </div>
            <Button onClick={() => { handleSpeak(displayString) }}>Listen</Button>
          </>
        ))}
        <Button onClick={incrementNgCount}>+NG</Button>
        <div className="flex justify-between">
          <Button onClick={toPrev}> ← </Button>
          <Button onClick={toNext}> → </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
