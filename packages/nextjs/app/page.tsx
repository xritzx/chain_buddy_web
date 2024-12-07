"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ChatBubbleBottomCenterIcon, TicketIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import TileGrid from "~~/components/TileGrid";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">CatFlix.ai</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
             by clicking{" "}
             <Link href="/chat" passHref className="link">here </Link>
            </code>
          </p>
          <TileGrid />
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12 bg-transparent">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <ChatBubbleBottomCenterIcon className="h-8 w-8 fill-secondary" />
              <p>
                Get all your TV series and movies recommendations{" "}
                <Link href="/chat" passHref className="link">
                  Jump to chat
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <TicketIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore all your NFT tickets that you have booked {" "}
                <Link href="/tickets" passHref className="link">
                  Ticket
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
