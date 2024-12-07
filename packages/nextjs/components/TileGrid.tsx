import Link from 'next/link';
import React from 'react';

const TileGrid = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-4 grod-cols-2-md gap-4">
        <div className="pl-2 pr-2 bg-transparent border h-20 rounded flex justify-center items-center text-white font-bold">
          talk to your &nbsp;
          <Link href="https://nook.social" className='text-accent'>nook.social</Link>
        </div>
        <div className="pl-2 pr-2 bg-transparent border h-20 rounded flex justify-center items-center text-white font-bold">
          book a movie ticket as NFT
        </div>
        <div className="pl-2 pr-2  bg-transparent border h-20 rounded flex justify-center items-center text-white font-bold">
          get movie/series recomms
        </div>
        <div className="pl-2 pr-2 bg-transparent border h-20 rounded flex justify-center items-center text-white font-bold">
          latest movie news
        </div>
      </div>
    </div>
  );
};

export default TileGrid;
