import React from 'react';
import Papa from 'papaparse';
import './App.css';

interface Page {
  first: string;
  second: string;
}

interface FlashCard {
  pages: Page[];
}

const row2Page = (row: any) => {
  const ks = Object.keys(row);
  return {
    first: row[ks[1]],
    second: row[ks[2]],
  }
};

function App() {
  const [flashCard, setFlashCard] = React.useState([] as Page[]);
  const [cursor, setCursor] = React.useState(0);

  const handleKeyPress = (event: KeyboardEvent) => {
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

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [flashCard, cursor]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        const data = result.data;
        const pages = data.map(row2Page);
        setFlashCard(pages);
      },
      header: true,
    });
  };

  console.log('cursor:', cursor);

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold underline">1CSV File Upload</h1>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div className="container mx-auto p-4">
        {flashCard.length > 0 ? <FlashCardContainer flashCard={{ pages: flashCard }} cursor={cursor} /> : null}
      </div>
    </div>
  );
}


function FlashCardContainer(props: { flashCard: FlashCard, cursor: number }) {

  const { flashCard, cursor } = props;
  const pageIndex = Math.floor(cursor / 2);
  const page = flashCard.pages[pageIndex];
  const parity = cursor % 2 === 0 ? 'first' : 'second';
  console.log('pageIndex:', pageIndex);
  console.log('page:', page);
  console.log('parity:', parity);
  const display = page[parity];
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold underline">Flash Card</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">{display}</div>
      </div>
    </div>
  );
}

// 1page　につき、 表と裏がある
// 表の時に -> で　同じpageの裏にいく、　<- で　prev pageの裏に行く
// 裏の時に -> で　next pageの表にいく、　<- で　同じpageの表に行く

export default App;
